// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * HistoryRecorder (dual-indexed)
 * - Append-only logs, written by authorized contracts (FractionalPurchase, RecordModule, Admin ops).
 * - Logs are indexed by:
 *     (A) user  -> Tx[]
 *     (B) propertyId -> Tx[]
 * - Users can read ONLY their own history (global or filtered by property).
 * - Admin can read any user's history and any property's history.
 * - Includes lightweight public, non-PII property summary (totals only).
 */

contract HistoryRecorder {
    // ---- Roles ----
    address public immutable admin;
    modifier onlyAdmin() { require(msg.sender == admin, "not admin"); _; }

    mapping(address => bool) public isAuthorized; // contracts allowed to write
    modifier onlyAuthorized() {
        require(isAuthorized[msg.sender] || msg.sender == admin, "not authorized");
        _;
    }

    constructor() {
        admin = msg.sender;
        isAuthorized[msg.sender] = true;
        emit AuthorizedWriterSet(msg.sender, true);
    }

    event AuthorizedWriterSet(address indexed writer, bool enabled);
    function setAuthorizedWriter(address writer, bool enabled) external onlyAdmin {
        isAuthorized[writer] = true;
        emit AuthorizedWriterSet(writer, true);
    }

    // ---- Data model ----
    enum TxType {
        Buy,            // 0
        Sell,           // 1 (reserved for future)
        TransferIn,     // 2
        TransferOut,    // 3
        DividendRecv,   // 4
        AdminAction     // 5
    }

    struct Tx {
        uint8   txType;        // cast of TxType
        uint256 propertyId;    // 0 if N/A
        uint256 amount;        // tokens for buys/transfers; wei for dividends
        uint256 valueWei;      // optional: total ETH paid/received; 0 if N/A
        address counterparty;  // other side of transfer, else 0
        address actor;         // who initiated (msg.sender on writer contract)
        uint40  timestamp;     // block time
        uint64  refId;         // e.g., planId/distributionId/orderId
        string  meta;          // short note / reference
    }

    // Primary indexes
    mapping(address => Tx[]) private _byUser;        // user -> their transactions
    mapping(uint256 => Tx[]) private _byProperty;    // propertyId -> all tx for that property

    // Simple property summaries (no PII)
    struct PropertySummary {
        uint256 totalBuys;        // number of buy tx
        uint256 totalBuyTokens;   // sum of tokens bought
        uint256 totalTransfers;   // number of transfer tx (in+out)
        uint256 totalDividends;   // number of dividend receipts
        uint256 sumDividendsWei;  // sum of dividend wei paid out
    }
    mapping(uint256 => PropertySummary) public propertySummary;

    // ---- Events ----
    event TxLogged(
        address indexed user,       // subject user (for per-user log)
        uint256 indexed propertyId,
        TxType   indexed txType,
        uint256 amount,
        uint256 valueWei,
        address counterparty,
        uint64  refId,
        string  meta
    );

    // ---- Writers (call from your other contracts) ----

    function recordBuy(
        address user,
        uint256 propertyId,
        uint256 amountTokens,
        uint256 valueWei,
        string calldata note
    ) external onlyAuthorized {
        Tx memory t = Tx({
            txType: uint8(TxType.Buy),
            propertyId: propertyId,
            amount: amountTokens,
            valueWei: valueWei,
            counterparty: address(0),
            actor: msg.sender,
            timestamp: uint40(block.timestamp),
            refId: 0,
            meta: note
        });

        _byUser[user].push(t);
        _byProperty[propertyId].push(t);

        // update summary
        PropertySummary storage ps = propertySummary[propertyId];
        ps.totalBuys += 1;
        ps.totalBuyTokens += amountTokens;

        emit TxLogged(user, propertyId, TxType.Buy, amountTokens, valueWei, address(0), 0, note);
    }

    function recordTransfer(
        address from,
        address to,
        uint256 propertyId,
        uint256 amountTokens,
        string calldata note
    ) external onlyAuthorized {
        // sender (out)
        Tx memory outTx = Tx({
            txType: uint8(TxType.TransferOut),
            propertyId: propertyId,
            amount: amountTokens,
            valueWei: 0,
            counterparty: to,
            actor: msg.sender,
            timestamp: uint40(block.timestamp),
            refId: 0,
            meta: note
        });
        _byUser[from].push(outTx);
        _byProperty[propertyId].push(outTx);
        emit TxLogged(from, propertyId, TxType.TransferOut, amountTokens, 0, to, 0, note);

        // receiver (in)
        Tx memory inTx = Tx({
            txType: uint8(TxType.TransferIn),
            propertyId: propertyId,
            amount: amountTokens,
            valueWei: 0,
            counterparty: from,
            actor: msg.sender,
            timestamp: uint40(block.timestamp),
            refId: 0,
            meta: note
        });
        _byUser[to].push(inTx);
        _byProperty[propertyId].push(inTx);
        emit TxLogged(to, propertyId, TxType.TransferIn, amountTokens, 0, from, 0, note);

        // summary
        propertySummary[propertyId].totalTransfers += 2; // count both directions
    }

    function recordDividend(
        address user,
        uint256 propertyId,
        uint256 amountWei,
        uint64  refId,
        string calldata note
    ) external onlyAuthorized {
        Tx memory t = Tx({
            txType: uint8(TxType.DividendRecv),
            propertyId: propertyId,
            amount: amountWei,
            valueWei: amountWei,
            counterparty: address(0),
            actor: msg.sender,
            timestamp: uint40(block.timestamp),
            refId: refId,
            meta: note
        });

        _byUser[user].push(t);
        _byProperty[propertyId].push(t);

        // summary
        PropertySummary storage ps = propertySummary[propertyId];
        ps.totalDividends += 1;
        ps.sumDividendsWei += amountWei;

        emit TxLogged(user, propertyId, TxType.DividendRecv, amountWei, amountWei, address(0), refId, note);
    }

    function recordAdminAction(
        address user,
        uint256 propertyId,
        string calldata note
    ) external onlyAuthorized {
        Tx memory t = Tx({
            txType: uint8(TxType.AdminAction),
            propertyId: propertyId,
            amount: 0,
            valueWei: 0,
            counterparty: msg.sender,
            actor: msg.sender,
            timestamp: uint40(block.timestamp),
            refId: 0,
            meta: note
        });

        _byUser[user].push(t);
        if (propertyId != 0) {
            _byProperty[propertyId].push(t);
        }

        emit TxLogged(user, propertyId, TxType.AdminAction, 0, 0, msg.sender, 0, note);
    }

    // ---- Readers (privacy enforced for per-user) ----

    // Users: full personal history (paginated)
    function getMyHistory(uint256 offset, uint256 limit) external view returns (Tx[] memory out) {
        out = _slice(_byUser[msg.sender], offset, limit);
    }

    // Users: personal history for a property (paginated)
    function getMyHistoryForProperty(uint256 propertyId, uint256 offset, uint256 limit)
        external view returns (Tx[] memory out)
    {
        // filter into a bounded window first to keep gas low
        Tx[] storage src = _byUser[msg.sender];
        (uint256 start, uint256 end) = _window(src.length, offset, limit);
        uint256 cnt;
        for (uint256 i = start; i < end; i++) if (src[i].propertyId == propertyId) cnt++;
        out = new Tx[](cnt);
        uint256 j;
        for (uint256 i = start; i < end; i++) {
            if (src[i].propertyId == propertyId) out[j++] = src[i];
        }
    }

    // Admin: any user's history (paginated)
    function getHistoryOf(address user, uint256 offset, uint256 limit)
        external view onlyAdmin returns (Tx[] memory out)
    {
        out = _slice(_byUser[user], offset, limit);
    }

    // Admin: full property history (paginated)
    function getPropertyHistory(uint256 propertyId, uint256 offset, uint256 limit)
        external view onlyAdmin returns (Tx[] memory out)
    {
        out = _slice(_byProperty[propertyId], offset, limit);
    }

    // Counts
    function getMyCount() external view returns (uint256) { return _byUser[msg.sender].length; }
    function getCountOf(address user) external view onlyAdmin returns (uint256) { return _byUser[user].length; }
    function getPropertyCount(uint256 propertyId) external view onlyAdmin returns (uint256) { return _byProperty[propertyId].length; }

    // Public non-PII summary for property pages
    function getPropertySummary(uint256 propertyId)
        external view
        returns (uint256 totalBuys, uint256 totalBuyTokens, uint256 totalTransfers, uint256 totalDividends, uint256 sumDividendsWei)
    {
        PropertySummary memory ps = propertySummary[propertyId];
        return (ps.totalBuys, ps.totalBuyTokens, ps.totalTransfers, ps.totalDividends, ps.sumDividendsWei);
    }

    // ---- Internal utils ----
    function _slice(Tx[] storage src, uint256 offset, uint256 limit) private view returns (Tx[] memory out) {
        (uint256 start, uint256 end) = _window(src.length, offset, limit);
        uint256 len = (end > start) ? (end - start) : 0;
        out = new Tx[](len);
        for (uint256 i = 0; i < len; i++) out[i] = src[start + i];
    }

    function _window(uint256 n, uint256 offset, uint256 limit) private pure returns (uint256 start, uint256 end) {
        if (limit == 0 || offset >= n) return (0, 0);
        start = offset;
        end = offset + limit;
        if (end > n) end = n;
    }
}
