// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserManager.sol";
import "./purchase.sol";
import "./Admin.sol";

contract Trade {

    UserManager private userManager;
    TokeniseProperty private tokeniseProperty;
    CreateProperty private createProperty;
    FractionalPurchase private fractionalPurchases;

    modifier onlyRegisteredUser() {
        require(userManager.isRegistered(msg.sender), "User not registered");
        require(!userManager.isBlacklisted(msg.sender), "User is blacklisted");
        _;
    }

    constructor(
        address _userManager,
        address _tokeniseProperty,
        address _createProperty,
        address _fractionalPurchaseContract
    ) {
        userManager = UserManager(_userManager);
        tokeniseProperty = TokeniseProperty(_tokeniseProperty);
        createProperty = CreateProperty(_createProperty);
        fractionalPurchases = FractionalPurchase(_fractionalPurchaseContract);
    }

    // Tracks the total number of fractional tokens issued for each property
    mapping(uint256 => uint256) private totalTokens; // propertyId => total tokens issued

    struct onSaleToken{
        uint256 saleID;
        uint256 propertyId;
        uint256 quantity;
        uint256 pricePerToken;
        address seller;
    }

    mapping(uint256 => onSaleToken) public onSaleTokens;
    uint256 onSaleId = 0;

    function sellOwnedToken(
        uint256 _propertyId,
        uint256 _quantity,
        uint256 _pricePerToken
    ) external onlyRegisteredUser {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_pricePerToken > 0, "Price per token must be greater than zero");

        CreateProperty.Property memory prop = createProperty.getProperty(_propertyId);
        require(prop.exists, "Property does not exist");
        
        TokeniseProperty.TokenizedAsset memory asset = tokeniseProperty.getTokenizedAsset(_propertyId);
        require(asset.tokenized, "Property not tokenized");

        // Check if user has enough available tokens
        uint256 availableBalance = fractionalPurchases.getUserBalance(_propertyId, msg.sender);
        require(availableBalance >= _quantity, "Insufficient available token balance");

        onSaleTokens[onSaleId] = onSaleToken(
            onSaleId,
            _propertyId,
            _quantity,
            _pricePerToken,
            msg.sender
        );
        onSaleId++;
    }

    function getOnSaleTokenCount() external view returns (uint256) {
        return onSaleId;
    }

    function cancelUnsoldListing(uint256 _id) public {
        onSaleToken storage item = onSaleTokens[_id];
        require(item.seller == msg.sender, "Only the seller can cancel the listing");

        delete onSaleTokens[_id];
    }

    function buyOnSaleToken(uint256 _id, uint256 _quantity) external onlyRegisteredUser payable  {
        onSaleToken storage item = onSaleTokens[_id];
        require (_quantity <= item.quantity, "Quantity exceeds available tokens");

        uint256 totalPayment = _quantity * item.pricePerToken;
        require(msg.value >= totalPayment, "Insufficient funds");
        require(msg.value <= totalPayment, "Overpayment");
        require(item.seller != msg.sender, "Cannot buy your own tokens");
        require(item.seller != address(0), "Invalid recipient address");

        // Transfer all tokens to buyer
        fractionalPurchases.transfer(msg.sender, item.seller, item.propertyId, _quantity);
        // Transfer funds to seller
        payable(item.seller).transfer(msg.value);

        if (_quantity == item.quantity) {
            // Remove item from onSaleTokens
            delete onSaleTokens[_id];
        } 
        else {
            // Update item quantity
            onSaleTokens[_id].quantity -= _quantity;
        }
    }

    function getOnSaleToken ( uint256 _id) external view returns (onSaleToken memory) {
        return onSaleTokens[_id];
    }
}