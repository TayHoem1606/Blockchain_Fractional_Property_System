// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserManager.sol";
import "./Admin.sol"; // TokeniseProperty and CreateProperty
import "./history.sol";

contract FractionalPurchase {
  
    UserManager private userManager;
    TokeniseProperty private tokeniseProperty;
    CreateProperty private createProperty;
    HistoryRecorder private history;


    // Tracks how many fractional tokens each user owns per property
    mapping(uint256 => mapping(address => uint256)) private userBalances; // propertyId => user => tokens owned

    // Tracks total sold tokens per property
    mapping(uint256 => uint256) private soldTokens; // propertyId => total sold
    
    // Track buyers per property (for reporting)
    mapping(uint256 => address[]) private propertyBuyers;

    mapping(address => mapping(uint256 => uint40[])) public buyingDates;


    // Events
    // -------------------------------
    event TokensPurchased(
        uint256 propertyId,
        address buyer,
        uint256 amount,
        uint256 pricePaid
    );

    constructor(
        address _userManager,
        address _tokeniseProperty,
        address _createProperty,
        address _history
    ) {
        userManager = UserManager(_userManager);
        tokeniseProperty = TokeniseProperty(_tokeniseProperty);
        createProperty = CreateProperty(_createProperty);
        history = HistoryRecorder(_history);
    }

    // Buy Fractional Tokens
    // -------------------------------
function buyTokens(uint256 propertyId, uint256 amount) public payable {
    require(userManager.isRegistered(msg.sender), "User not registered");
    require(!userManager.isBlacklisted(msg.sender), "User is blacklisted");
    require(amount > 0, "Must buy at least 1 token");

    // Check if property is tokenized
    TokeniseProperty.TokenizedAsset memory asset = tokeniseProperty.getTokenizedAsset(propertyId);
    require(asset.tokenized, "Property not tokenized");

    // Get property 
    CreateProperty.Property memory prop = createProperty.getProperty(propertyId);
    require(prop.exists, "Property does not exist");
    require(msg.sender != prop.creator, "Admin cannot buy own property tokens");

    // Ensure enough tokens remain
    require(soldTokens[propertyId] + amount <= asset.totalSupply, "Not enough tokens left");

    // Calculate price for purchase
    uint256 totalPrice = (prop.price * amount) / prop.numTokens;
    require(msg.value >= totalPrice, "Insufficient ETH sent");

    // Update balances first
    userBalances[propertyId][msg.sender] += amount;
    soldTokens[propertyId] += amount;

    // ✅ Record the buy timestamp (for dividend use later)
    buyingDates[msg.sender][propertyId].push(uint40(block.timestamp));

    if (userBalances[propertyId][msg.sender] == amount) {  
    // meaning they had 0 before and now >0
    propertyBuyers[propertyId].push(msg.sender);
}

    // Refund excess ETH
    if (msg.value > totalPrice) {
        payable(msg.sender).transfer(msg.value - totalPrice);
    }
    history.recordBuy(msg.sender, propertyId, amount, totalPrice, "buy");


    emit TokensPurchased(propertyId, msg.sender, amount, totalPrice);
}

/// Get all recorded buying dates for a user in a property
function getBuyingDates(address user, uint256 propertyId) external view returns (uint40[] memory) {
    return buyingDates[user][propertyId];
}
    // Get token price for a property
    function getTokenPrice(uint256 propertyId) public view returns (uint256) {
    CreateProperty.Property memory prop = createProperty.getProperty(propertyId);
    return (prop.price * 1e18) / prop.numTokens; // scaled by 1e18
}


    // Get remaining tokens available for sale
    function getRemainingTokens(uint256 propertyId) public view returns (uint256) {
        TokeniseProperty.TokenizedAsset memory asset = tokeniseProperty.getTokenizedAsset(propertyId);
        return asset.totalSupply - soldTokens[propertyId];
    }

    // Get total tokens sold for a property (just number)
    function getTotalSales(uint256 propertyId) public view returns (uint256) {
        return soldTokens[propertyId];
    }

    // Get property sales summary (name + total sold + buyers + tokens owned)
    function getPropertySalesSummary(uint256 propertyId)
    public
    view
    returns (
        string memory propertyName,
        uint256 totalSold,
        string[] memory buyerNames,
        uint256[] memory tokensOwned,
        address[] memory buyersAddress
    )
{
    CreateProperty.Property memory prop = createProperty.getProperty(propertyId);

    propertyName = prop.name;
    totalSold = soldTokens[propertyId];
    address[] memory buyers = propertyBuyers[propertyId];
    buyerNames = new string[](buyers.length);
    tokensOwned = new uint256[](buyers.length);
    buyersAddress = buyers;

    for (uint256 i = 0; i < buyers.length; i++) {
        buyerNames[i] = userManager.getNameByAddress(buyers[i]);  // ✅ works now
        tokensOwned[i] = userBalances[propertyId][buyers[i]];
    }
}

    // Show all properties owned by user based on username
    function getUserPropertiesByUsername(string memory username)
        public
        view
        returns (string[] memory propertyNames, uint256[] memory tokensOwned)
    {
        address userAddr = userManager.getAddressByName(username);
        require(userAddr != address(0), "User not found");

        uint256 lastId = createProperty.getLastPropertyId();
        uint256 count = 0;

        // Count how many properties user owns
        for (uint256 i = 1; i <= lastId; i++) {
            if (userBalances[i][userAddr] > 0) {
                count++;
            }
        }

        // Allocate arrays
        propertyNames = new string[](count);
        tokensOwned = new uint256[](count);

        // Fill arrays
        uint256 index = 0;
        for (uint256 i = 1; i <= lastId; i++) {
            if (userBalances[i][userAddr] > 0) {
                CreateProperty.Property memory prop = createProperty.getProperty(i);
                propertyNames[index] = prop.name;
                tokensOwned[index] = userBalances[i][userAddr];
                index++;
            }
        }
    }

    // Get how many tokens a user owns for a property
    function getUserBalance(uint256 propertyId, address user) public view returns (uint256) {
        return userBalances[propertyId][user];
    }

    function transfer(address _to, address _from, uint256 _propertyId, uint256 _amount) public {
        require(userManager.isRegistered(_to), "User not registered");
        require(!userManager.isBlacklisted(_to), "User is blacklisted");
        require(userManager.isRegistered(_from), "User not registered");
        require(!userManager.isBlacklisted(_from), "User is blacklisted");
        require(_amount > 0, "Must buy at least 1 token");
        require(userBalances[_propertyId][_from] >= _amount, "Insufficient balance");

        // Update balances
        userBalances[_propertyId][_to] += _amount;
        userBalances[_propertyId][_from] -= _amount;
    }
}

