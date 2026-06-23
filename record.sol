// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./history.sol";

interface IPurchase {
    function getPropertySalesSummary(uint256 propertyId)
        external
        view
        returns (
            string memory propertyName,
            uint256 totalSold,
            string[] memory buyerNames,
            uint256[] memory tokensOwned,
            address[] memory buyerAddresses
        );

    function getBuyingDates(address user, uint256 propertyId) external view returns (uint40[] memory);
}

contract RecordModule {
    // ---------------- Admin ----------------
    address public immutable admin;
    modifier onlyAdmin() { require(msg.sender == admin, "RecordModule: not admin"); _; }

    HistoryRecorder private history;


    constructor(address _history) { admin = msg.sender;history = HistoryRecorder(_history);
}

    // ------------- External purchase hookup -------------
    IPurchase public purchase; // set to deployed FractionalPurchase
    event PurchaseSet(address indexed purchase);

    function setPurchase(address _addr) external onlyAdmin {
        require(_addr != address(0), "purchase=0");
        purchase = IPurchase(_addr);
        emit PurchaseSet(_addr);
    }

    // ------------- Plan storage & events ----------------
    enum Mode { FixedPool, PerToken } // FixedPool: split a pool; PerToken: per-token wei

    struct Plan {
        uint256 planId;
        uint256 propertyId;
        Mode    mode;
        uint256 poolWei;        // configured when mode == FixedPool
        uint256 perTokenWei;    // configured when mode == PerToken
        uint40  fromDate;       // 0 = no lower bound
        uint40  toDate;         // 0 = no upper bound
        uint40  createdAt;
    }

    uint256 public lastPlanId;
    mapping(uint256 => Plan) public plans;

    // Execution state
    mapping(uint256 => mapping(address => bool)) public paid;     // planId => user => paid?
    mapping(uint256 => uint256) public poolRemaining;             // only for FixedPool plans

    event PlanCreated(
        uint256 indexed planId,
        uint256 indexed propertyId,
        Mode mode,
        uint256 poolWei,
        uint256 perTokenWei,
        uint40 fromDate,
        uint40 toDate
    );

    event DividendPaid(
        uint256 indexed planId,
        uint256 indexed propertyId,
        address indexed user,
        uint256 userBalance,
        uint256 amount
    );

    event DividendBatchExecuted(
        uint256 indexed planId,
        uint256 indexed propertyId,
        Mode mode,
        uint256 batchPaid,
        uint256 processed,          // number of recipients paid in this batch
        uint256 sumBalancesBatch,   // token sum for paid recipients in this batch
        uint256 poolRemainingAfter  // for FixedPool; 0 for PerToken
    );

    // --------- Create plans (no funds moved here) ---------
    function createPlanFixedPool(
        uint256 propertyId,
        uint256 poolWei,
        uint40 fromDate,
        uint40 toDate
    ) external onlyAdmin returns (uint256 planId) {
        require(address(purchase) != address(0), "purchase not set");
        require(poolWei > 0, "poolWei=0");

        planId = ++lastPlanId;
        plans[planId] = Plan({
            planId: planId,
            propertyId: propertyId,
            mode: Mode.FixedPool,
            poolWei: poolWei,
            perTokenWei: 0,
            fromDate: fromDate,
            toDate: toDate,
            createdAt: uint40(block.timestamp)
        });

        poolRemaining[planId] = poolWei;

        emit PlanCreated(planId, propertyId, Mode.FixedPool, poolWei, 0, fromDate, toDate);
    }

    function createPlanPerToken(
        uint256 propertyId,
        uint256 perTokenWei,
        uint40 fromDate,
        uint40 toDate
    ) external onlyAdmin returns (uint256 planId) {
        require(address(purchase) != address(0), "purchase not set");
        require(perTokenWei > 0, "perTokenWei=0");

        planId = ++lastPlanId;
        plans[planId] = Plan({
            planId: planId,
            propertyId: propertyId,
            mode: Mode.PerToken,
            poolWei: 0,
            perTokenWei: perTokenWei,
            fromDate: fromDate,
            toDate: toDate,
            createdAt: uint40(block.timestamp)
        });

        emit PlanCreated(planId, propertyId, Mode.PerToken, 0, perTokenWei, fromDate, toDate);
    }

    // ---------------- Preview (no transfers) ----------------
    function previewPlan(uint256 planId)
        external
        view
        returns (
            address[] memory recipients,
            uint256[] memory balances,
            uint256[] memory amounts,
            uint256 sumBalances,
            uint256 totalPayout
        )
    {
        Plan memory p = plans[planId];
        require(p.planId != 0, "plan not found");
        require(address(purchase) != address(0), "purchase not set");

        (uint256[] memory tokensOwned, address[] memory buyers) = _pullBalancesAndAddresses(p.propertyId);
        uint256 n = buyers.length;

        // PASS 1: count eligible + sum balances
        uint256 included = 0;
        for (uint256 i = 0; i < n; i++) {
            uint256 bal = tokensOwned[i];
            if (bal == 0) continue;
            if (_eligibleByDate(buyers[i], p.propertyId, p.fromDate, p.toDate)) {
                unchecked { included++; }
                sumBalances += bal;
            }
        }
        require(included > 0, "no eligible holders");

        // Compute total payout
        if (p.mode == Mode.FixedPool) {
            totalPayout = poolRemaining[planId]; // remaining pool (not the original)
        } else {
            totalPayout = p.perTokenWei * sumBalances;
        }

        // PASS 2: fill outputs
        recipients = new address[](included);
        balances  = new uint256[](included);
        amounts   = new uint256[](included);

        uint256 j = 0;
        if (p.mode == Mode.FixedPool) {
            uint256 pool = poolRemaining[planId];
            for (uint256 i = 0; i < n; i++) {
                uint256 bal = tokensOwned[i];
                if (bal == 0) continue;
                address u = buyers[i];
                if (!_eligibleByDate(u, p.propertyId, p.fromDate, p.toDate)) continue;

                recipients[j] = u;
                balances[j]   = bal;
                amounts[j]    = (pool * bal) / sumBalances;
                unchecked { j++; }
            }
        } else {
            for (uint256 i = 0; i < n; i++) {
                uint256 bal = tokensOwned[i];
                if (bal == 0) continue;
                address u = buyers[i];
                if (!_eligibleByDate(u, p.propertyId, p.fromDate, p.toDate)) continue;

                recipients[j] = u;
                balances[j]   = bal;
                amounts[j]    = p.perTokenWei * bal;
                unchecked { j++; }
            }
        }
    }

    // ---------------- Execute (transfers with batching) ----------------
    function executePlan(uint256 planId, uint256 maxCount) external payable onlyAdmin {
        require(address(purchase) != address(0), "purchase not set");
        require(maxCount > 0, "maxCount=0");

        Plan memory p = plans[planId];
        require(p.planId != 0, "plan not found");

        (uint256[] memory tokensOwned, address[] memory buyers) = _pullBalancesAndAddresses(p.propertyId);

        // Collect up to maxCount eligible+unpaid indexes
        uint256[] memory idxs = new uint256[](maxCount);
        (uint256 k, uint256 sumBalancesBatch) = _collectEligibleUnpaid(
            p.propertyId,
            p.fromDate,
            p.toDate,
            planId,
            tokensOwned,
            buyers,
            idxs
        );

        require(k > 0, "nothing to pay");

        if (p.mode == Mode.FixedPool) {
            _payFixedPoolBatch(
                planId,
                tokensOwned,
                buyers,
                idxs,
                k,
                sumBalancesBatch
            );
        } else {
            _payPerTokenBatch(
                planId,
                p.perTokenWei,
                tokensOwned,
                buyers,
                idxs,
                k
            );
        }

    }

    // ---------------- Internal helpers ----------------

    function _collectEligibleUnpaid(
        uint256 propertyId,
        uint40 fromDate,
        uint40 toDate,
        uint256 planId,
        uint256[] memory tokensOwned,
        address[] memory buyers,
        uint256[] memory idxs
    ) internal view returns (uint256 k, uint256 sumBalancesBatch) {
        uint256 n = buyers.length;
        uint256 cap = idxs.length;

        for (uint256 i = 0; i < n; i++) {
            if (k == cap) break;

            address u = buyers[i];
            if (paid[planId][u]) continue;

            uint256 bal = tokensOwned[i];
            if (bal == 0) continue;

            if (!_eligibleByDate(u, propertyId, fromDate, toDate)) continue;

            idxs[k] = i;
            unchecked { k++; }
            sumBalancesBatch += bal;
        }
    }

function _payFixedPoolBatch(
    uint256 planId,
    uint256[] memory tokensOwned,
    address[] memory buyers,
    uint256[] memory idxs,
    uint256 k,
    uint256 sumBalancesBatch
) internal {
    // Validate pool & inputs
    require(poolRemaining[planId] > 0, "pool empty");
    require(msg.value > 0, "no ETH sent");
    require(msg.value <= poolRemaining[planId], "msg.value > remaining pool");
    require(sumBalancesBatch > 0, "sumBalances=0");

    uint256 batchPaid = 0;

    // Pay proportionally; last recipient gets msg.value - batchPaid
    for (uint256 t = 0; t < k; t++) {
        uint256 i = idxs[t];

        uint256 payAmt = (t + 1 == k)
            ? (msg.value - batchPaid)
            : (msg.value * tokensOwned[i]) / sumBalancesBatch;

        if (payAmt > 0) {
            (bool ok, ) = payable(buyers[i]).call{value: payAmt}("");
            require(ok, "transfer failed");
            batchPaid += payAmt;

            // Emits using a tiny helper (derives propertyId inside)
            _emitPaidLite(planId, buyers[i], tokensOwned[i], payAmt);
        }

         if (address(history) != address(0)) {
                history.recordDividend(
                    buyers[i],
                    plans[planId].propertyId,   // read from storage to keep stack light
                    payAmt,
                    uint64(planId),
                    "payout"
                );
            }

        // Mark paid even if 0 (tiny pool edge)
        paid[planId][buyers[i]] = true;
    }

    // Reduce remaining pool and emit batch summary
    poolRemaining[planId] = poolRemaining[planId] - batchPaid;

    emit DividendBatchExecuted(
        planId,
        plans[planId].propertyId,           // read from storage, no local
        Mode.FixedPool,
        batchPaid,
        k,
        sumBalancesBatch,
        poolRemaining[planId]
    );
}

function _payPerTokenBatch(
    uint256 planId,
    uint256 perTokenWei,
    uint256[] memory tokensOwned,
    address[] memory buyers,
    uint256[] memory idxs,
    uint256 k
) internal {
    uint256 need = 0;
    for (uint256 t = 0; t < k; t++) {
        need += perTokenWei * tokensOwned[idxs[t]];
    }
    require(msg.value >= need, "insufficient ETH for batch");

    uint256 batchPaid = 0;
    uint256 surplus   = msg.value;

    for (uint256 t2 = 0; t2 < k; t2++) {
    uint256 i = idxs[t2];
    uint256 payAmt = (t2 + 1 == k)
        ? (need - batchPaid)
        : (perTokenWei * tokensOwned[i]);

    if (payAmt > 0) {
        (bool ok, ) = payable(buyers[i]).call{value: payAmt}("");
        require(ok, "transfer failed");
        batchPaid += payAmt;
        surplus   -= payAmt;

        _emitPaidLite(planId, buyers[i], tokensOwned[i], payAmt);
        _recordDividendLite(planId, buyers[i], payAmt);  // ✅ moved here
    }

    paid[planId][buyers[i]] = true;
}


    if (surplus > 0) {
        (bool ok2, ) = payable(admin).call{value: surplus}("");
        require(ok2, "refund failed");
    }

    emit DividendBatchExecuted(
        planId,
        plans[planId].propertyId,           // read from storage, no local
        Mode.PerToken,
        batchPaid,
        k,
        0,
        0
    );
}

// Minimal emitter: derives propertyId from storage to avoid passing more params
function _emitPaidLite(
    uint256 planId,
    address user,
    uint256 balance,
    uint256 amount
) internal {
    emit DividendPaid(planId, plans[planId].propertyId, user, balance, amount);
}


    // Pull only tokensOwned & buyerAddresses to keep stack shallow
    function _pullBalancesAndAddresses(uint256 propertyId)
        internal
        view
        returns (uint256[] memory tokensOwned, address[] memory buyerAddresses)
    {
        string memory _ignore1;
        uint256 _ignore2;
        string[] memory _ignore3;
        (_ignore1, _ignore2, _ignore3, tokensOwned, buyerAddresses) = purchase.getPropertySalesSummary(propertyId);
    }

    function _eligibleByDate(
        address user,
        uint256 propertyId,
        uint40 fromDate,
        uint40 toDate
    ) internal view returns (bool) {
        if (fromDate == 0 && toDate == 0) return true; // no filtering

        uint40[] memory dates = purchase.getBuyingDates(user, propertyId);
        uint256 m = dates.length;
        if (m == 0) return false;

        for (uint256 i = 0; i < m; i++) {
            uint40 ts = dates[i];
            if (fromDate != 0 && ts < fromDate) continue;
            if (toDate   != 0 && ts > toDate)   continue;
            return true; // any match qualifies
        }
        return false;
    }

    function _recordDividendLite(
    uint256 planId,
    address user,
    uint256 amount
) internal {
    if (address(history) != address(0) && amount > 0) {
        history.recordDividend(
            user,
            plans[planId].propertyId,  // lookup here (separate stack frame)
            amount,
            uint64(planId),
            "payout"
        );
    }
}

}
