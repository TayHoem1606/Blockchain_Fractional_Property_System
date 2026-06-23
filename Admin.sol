// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./UserManager.sol";

// ==========================================================
// AdminLogin Contract
// ==========================================================
abstract contract PropertyBase {
    UserManager internal userManager;
    uint256 internal contractStartTime; // Track deployment time

    event ChangeLogged(
        uint256 propertyId,
        string details,
        address admin,
        uint256 startTime,
        uint256 endTime,
        uint256 durationSeconds
    );

    constructor(address _userManager) {
        userManager = UserManager(_userManager);
        contractStartTime = block.timestamp; // set start time when deployed
    }

    modifier onlyAdmin() {
        require(userManager.isAdmin(msg.sender), "Not an authenticated admin");
        _;
    }

    // 🔹 Special internal logChange (only for this file's contracts)
    function _logChange(uint256 propertyId, string memory details) internal {
        uint256 endTime = block.timestamp;
        uint256 duration = endTime - contractStartTime;
        emit ChangeLogged(propertyId, details, msg.sender, contractStartTime, endTime, duration);
    }
}

// ==========================================================
// CreateProperty Contract
// ==========================================================
contract CreateProperty is PropertyBase {

    struct Property {
        uint256 id;
        string name;
        uint256 price;
        string location;
        uint256 numTokens;
        address creator;
        bool exists;
    }

    mapping(uint256 => Property) private properties;
    uint256 private nextPropertyId;

    event PropertyCreated(
        uint256 propertyId,
        string name,
        uint256 price,
        string location,
        uint256 numTokens,
        address creator
    );

    constructor(address _userManager) PropertyBase(_userManager) {
        nextPropertyId = 1;
    }

    function createProperty(
        string memory name,
        uint256 price,
        string memory location,
        uint256 numTokens
    ) public onlyAdmin returns (uint256){
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");
        require(price > 0, "Price must be a positive number");
        require(numTokens > 0, "Number of tokens must be a positive number");

        uint256 propertyId = nextPropertyId++;
        properties[propertyId] = Property(
            propertyId,
            name,
            price,
            location,
            numTokens,
            msg.sender,
            true
        );

        emit PropertyCreated(propertyId, name, price, location, numTokens, msg.sender);
        
        _logChange(propertyId, "Property created");

        return propertyId;
    }

    function getProperty(uint256 propertyId) public view returns (Property memory) {
        require(properties[propertyId].exists, "Property does not exist");
        return properties[propertyId];
    }

    function getLastPropertyId() public view returns (uint256) {
        require(nextPropertyId > 1, "No property created yet");
        return nextPropertyId - 1;
    }
}

// ==========================================================
// TokeniseProperty Contract
// ==========================================================
contract TokeniseProperty is PropertyBase {

    struct TokenizedAsset {
        uint256 propertyId;
        uint256 totalSupply;
        bool tokenized;
    }

    mapping(uint256 => TokenizedAsset) public tokenizedAssets;
    CreateProperty public createProperty;

    event PropertyTokenized(uint256 propertyId, uint256 totalSupply, address admin);

    // Add createProperty address parameter and initialize it
    constructor(address _userManager, address _createProperty) PropertyBase(_userManager) {
        createProperty = CreateProperty(_createProperty);
    }

    function tokenize(uint256 propertyId, uint256 totalSupply) public onlyAdmin {
        CreateProperty.Property memory prop = createProperty.getProperty(propertyId);
        require(prop.exists, "Property does not exist");
        require(!tokenizedAssets[propertyId].tokenized, "Property already tokenized");

        tokenizedAssets[propertyId] = TokenizedAsset({
            propertyId: propertyId,
            totalSupply: totalSupply,
            tokenized: true
        });

        emit PropertyTokenized(propertyId, totalSupply, msg.sender);
        _logChange(propertyId, "Property tokenized");
    }

    function getTokenizedAsset(uint256 propertyId) external view returns (TokenizedAsset memory) {
        return tokenizedAssets[propertyId];
    }
}

// ==========================================================
// DeployProperty Contract
// ==========================================================
// Fixed DeployProperty Contract
contract DeployProperty is ERC721, PropertyBase {

    struct DeploymentStatus {
        bool deployed;
        bool metadataLocked;
        bool immutableMarked;
    }

    mapping(uint256 => DeploymentStatus) public deployments;
    CreateProperty public createProperty;
    TokeniseProperty public tokeniseProperty;

    event PropertyDeployed(uint256 propertyId, address admin);
    event MetadataLocked(uint256 propertyId, address admin);
    event PropertyImmutable(uint256 propertyId, address admin);

    // Add contract addresses and initialize them
    constructor(
        address _userManager,
        address _createProperty, 
        address _tokeniseProperty
    )
        ERC721("PropertyNFT", "pNFT")
        PropertyBase(_userManager)
    {
        createProperty = CreateProperty(_createProperty);
        tokeniseProperty = TokeniseProperty(_tokeniseProperty);
    }

    function verifyNotDeployed(uint256 propertyId) public onlyAdmin view returns (bool) {
        return !deployments[propertyId].deployed;
    }

    function lockMetadata(uint256 propertyId) public onlyAdmin {
        require(!deployments[propertyId].metadataLocked, "Already locked");

        deployments[propertyId].metadataLocked = true;

        emit MetadataLocked(propertyId, msg.sender);
        _logChange(propertyId, "Metadata locked");
    }

    function mintProperty(uint256 propertyId) public {
        require(deployments[propertyId].metadataLocked, "Metadata must be locked first");
        require(!deployments[propertyId].deployed, "Already deployed");

        _safeMint(msg.sender, propertyId);
        deployments[propertyId].deployed = true;

        emit PropertyDeployed(propertyId, msg.sender);
        _logChange(propertyId, "Property minted & deployed");
    }

    function markAsImmutable(uint256 propertyId) public {
        require(deployments[propertyId].deployed, "Must be deployed first");
        require(!deployments[propertyId].immutableMarked, "Already immutable");

        deployments[propertyId].immutableMarked = true;

        emit PropertyImmutable(propertyId, msg.sender);
        _logChange(propertyId, "Property marked as immutable");
    }

    // Optional: Add validation functions that use the contract references
    function verifyPropertyExists(uint256 propertyId) public view returns (bool) {
        CreateProperty.Property memory prop = createProperty.getProperty(propertyId);
        return prop.exists;
    }

    function verifyPropertyTokenized(uint256 propertyId) public view returns (bool) {
        TokeniseProperty.TokenizedAsset memory asset = tokeniseProperty.getTokenizedAsset(propertyId);
        return asset.tokenized;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://myproperty-metadata.io/";
    }
}
