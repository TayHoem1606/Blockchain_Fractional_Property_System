//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * UserManager
 * Handles user registration, authentication, profile management, and role-based access control
 * Updated: Fixed stack too deep error with multiple solutions
 */
contract UserManager {
    
    // Constants
    uint256 private constant MAX_FAILED_ATTEMPTS = 3;
    uint256 private constant LOCKOUT_DURATION = 1800; // 30 minutes in seconds
    
    // Struct for User Details
    struct User {
        string email;
        string password;
        string name;
        string phone;
        string role;                    // "Admin" or "User"
        bool isRegistered;
        bool isBlacklisted;
        uint256 failedLoginAttempts;
        uint256 lastFailedLoginTime;
        uint256 lockoutEndTime;
    }

    // New struct to return user information
    struct UserInfo {
        string email;
        string name;
        string phone;
        string role;
        bool isRegistered;
        bool isBlacklisted;
        uint256 failedLoginAttempts;
        bool isLocked;
    }
    
    // Storage
    mapping(address => User) private users;
    mapping(string => address) private emailToAddress;  // Prevent duplicate emails
    address public superAdmin;
    
    // Events
    event UserRegistered(address indexed user, string email, string role);
    event AdminAdded(address indexed admin, string email);
    event UserLoggedIn(address indexed user, uint256 timestamp);
    event UserUpdated(address indexed user);
    event UserBlacklisted(address indexed user, bool status);
    event LoginAttemptFailed(address indexed user, uint256 attempts);
    event AccountLocked(address indexed user, uint256 lockoutEndTime);
    event AccountUnlocked(address indexed user);
    
    // Modifiers
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    modifier onlyAdmin() {
        require(users[msg.sender].isRegistered, "User not registered");
        require(keccak256(abi.encodePacked(users[msg.sender].role)) == keccak256(abi.encodePacked("Admin")), "Admin access required");
        _;
    }
    
    modifier onlyUser() {
        require(users[msg.sender].isRegistered, "User not registered");
        require(keccak256(abi.encodePacked(users[msg.sender].role)) == keccak256(abi.encodePacked("User")), "User access required");
        _;
    }
    
    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Super admin access required");
        _;
    }
    
    modifier notBlacklisted() {
        require(!users[msg.sender].isBlacklisted, "Account is blacklisted");
        _;
    }
    
    modifier notLocked() {
        require(!isAccountLocked(msg.sender), "Account is temporarily locked due to failed login attempts");
        _;
    }
    
    modifier emailNotExists(string memory _email) {
        require(emailToAddress[_email] == address(0), "Email already registered");
        _;
    }
    
    // Constructor
    constructor() {
        superAdmin = msg.sender;
        
        // Register super admin
        users[superAdmin] = User({
            email: "admin@system.com",
            password: "admin123",
            name: "System Admin",
            phone: "1234567890",
            role: "Admin",
            isRegistered: true,
            isBlacklisted: false,
            failedLoginAttempts: 0,
            lastFailedLoginTime: 0,
            lockoutEndTime: 0
        });
        
        emailToAddress["admin@system.com"] = superAdmin;
        emit UserRegistered(superAdmin, "admin@system.com", "Admin");
    }
    
    // User Registration Functions
    function registerUser(
        string memory _email,
        string memory _password,
        string memory _name,
        string memory _phone
    ) public emailNotExists(_email) {
        require(!users[msg.sender].isRegistered, "Address already registered");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_password).length >= 6, "Password must be at least 6 characters");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_phone).length > 0, "Phone cannot be empty");
        
        // Store user data
        users[msg.sender] = User({
            email: _email,
            password: _password,
            name: _name,
            phone: _phone,
            role: "User",
            isRegistered: true,
            isBlacklisted: false,
            failedLoginAttempts: 0,
            lastFailedLoginTime: 0,
            lockoutEndTime: 0
        });
        
        emailToAddress[_email] = msg.sender;
        nameToAddress[_name] = msg.sender;   //new - Purchase
        addressToName[msg.sender] = _name;         //new - purchase
        emit UserRegistered(msg.sender, _email, "User");
    }
    
    /**
     * Add a new admin (only super admin can call this)
     */
    function addAdmin(
        address _userAddr,
        string memory _email,
        string memory _password,
        string memory _name,
        string memory _phone
    ) public onlySuperAdmin emailNotExists(_email) {
        require(!users[_userAddr].isRegistered, "Address already registered");
        require(_userAddr != address(0), "Invalid address");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_password).length >= 6, "Password must be at least 6 characters");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_phone).length > 0, "Phone cannot be empty");
        
        // Store admin data
        users[_userAddr] = User({
            email: _email,
            password: _password,
            name: _name,
            phone: _phone,
            role: "Admin",
            isRegistered: true,
            isBlacklisted: false,
            failedLoginAttempts: 0,
            lastFailedLoginTime: 0,
            lockoutEndTime: 0
        });
        
        emailToAddress[_email] = _userAddr;
        nameToAddress[_name] = msg.sender;          //new - Purchase
        addressToName[msg.sender] = _name;         //new - purchase
        emit AdminAdded(_userAddr, _email);
        emit UserRegistered(_userAddr, _email, "Admin");
    }
    
    // Authentication Functions
    function login(string memory _email, string memory _password) 
        public 
        onlyRegistered 
        notBlacklisted 
        notLocked
    {
        require(
            keccak256(abi.encodePacked(users[msg.sender].email)) == keccak256(abi.encodePacked(_email)),
            "Email does not match"
        );
        
        // Check password
        if (keccak256(abi.encodePacked(users[msg.sender].password)) != keccak256(abi.encodePacked(_password))) {
            // Handle failed login attempt
            _handleFailedLogin(msg.sender);
            revert("Invalid password");
        }
        
        // Successful login - reset failed attempts
        users[msg.sender].failedLoginAttempts = 0;
        users[msg.sender].lastFailedLoginTime = 0;
        users[msg.sender].lockoutEndTime = 0;
        
        emit UserLoggedIn(msg.sender, block.timestamp);
    }
    
    //Handle failed login attempts
    function _handleFailedLogin(address _userAddr) private {
        users[_userAddr].failedLoginAttempts++;
        users[_userAddr].lastFailedLoginTime = block.timestamp;
        
        emit LoginAttemptFailed(_userAddr, users[_userAddr].failedLoginAttempts);
        
        // Lock account if max attempts reached
        if (users[_userAddr].failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
            users[_userAddr].lockoutEndTime = block.timestamp + LOCKOUT_DURATION;
            emit AccountLocked(_userAddr, users[_userAddr].lockoutEndTime);
        }
    }
    
    //Check if account is locked due to failed login attempts
    function isAccountLocked(address _userAddr) public view returns (bool) {
        if (users[_userAddr].lockoutEndTime == 0) {
            return false;
        }
        
        if (block.timestamp >= users[_userAddr].lockoutEndTime) {
            return false; // Lockout period has ended
        }
        
        return true;
    }
    
    /**
     * Get remaining lockout time in seconds
     */
    function getLockoutTimeRemaining(address _userAddr) public view returns (uint256) {
        if (!isAccountLocked(_userAddr)) {
            return 0;
        }
        
        return users[_userAddr].lockoutEndTime - block.timestamp;
    }
    
    /**
     * Manually unlock account (admin only)
     */
    function unlockAccount(address _userAddr) public onlyAdmin {
        require(users[_userAddr].isRegistered, "User not registered");
        
        users[_userAddr].failedLoginAttempts = 0;
        users[_userAddr].lastFailedLoginTime = 0;
        users[_userAddr].lockoutEndTime = 0;
        
        emit AccountUnlocked(_userAddr);
    }
    
    // Profile Management Functions
    function updateUser(string memory _name, string memory _phone) 
        public 
        onlyRegistered 
        notBlacklisted 
    {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_phone).length > 0, "Phone cannot be empty");
        
        users[msg.sender].name = _name;
        users[msg.sender].phone = _phone;
        
        emit UserUpdated(msg.sender);
    }

    function changePassword(string memory _oldPassword, string memory _newPassword) 
        public 
        onlyRegistered 
        notBlacklisted 
    {
        require(bytes(_newPassword).length >= 6, "New password must be at least 6 characters");
        require(
            keccak256(abi.encodePacked(users[msg.sender].password)) == keccak256(abi.encodePacked(_oldPassword)),
            "Invalid old password"
        );
        require(
            keccak256(abi.encodePacked(_oldPassword)) != keccak256(abi.encodePacked(_newPassword)),
            "New password must be different from old password"
        );
        
        // Update password
        users[msg.sender].password = _newPassword;
        
        emit UserUpdated(msg.sender);
    }

    //New added-----------------------
     mapping(string => address) private nameToAddress;
     function getAddressByName(string memory _name) public view returns (address) {
        return nameToAddress[_name];
        }

    mapping(address => string) private addressToName;
    function getNameByAddress(address _user) public view returns (string memory) {
    return addressToName[_user];
    }
    //---------------------------------------------
    
    function getMyProfile() public view onlyRegistered returns (
        string memory email,
        string memory name,
        string memory phone,
        string memory role
    ) {
        User memory user = users[msg.sender];
        return (user.email, user.name, user.phone, user.role);
    }
    
    // Get the user info
    function getUserInfo(address _userAddr) public view onlyAdmin returns (UserInfo memory) {
        User storage user = users[_userAddr];
        return UserInfo({
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isRegistered: user.isRegistered,
            isBlacklisted: user.isBlacklisted,
            failedLoginAttempts: user.failedLoginAttempts,
            isLocked: isAccountLocked(_userAddr)
        });
    }
    
    // Role & Access Control Functions
    function isAdmin(address _userAddr) public view returns (bool) {
        return users[_userAddr].isRegistered && 
               keccak256(abi.encodePacked(users[_userAddr].role)) == keccak256(abi.encodePacked("Admin"));
    }
    
    function isUser(address _userAddr) public view returns (bool) {
        return users[_userAddr].isRegistered && 
               keccak256(abi.encodePacked(users[_userAddr].role)) == keccak256(abi.encodePacked("User"));
    }
    
    function isRegistered(address _userAddr) public view returns (bool) {
        return users[_userAddr].isRegistered;
    }
    
    function isBlacklisted(address _userAddr) public view returns (bool) {
        return users[_userAddr].isBlacklisted;
    }
    
    // Admin Functions
    function setBlacklistStatus(address _userAddr, bool _status) public onlyAdmin {
        require(users[_userAddr].isRegistered, "User not registered");
        require(_userAddr != superAdmin, "Cannot blacklist super admin");
        
        users[_userAddr].isBlacklisted = _status;
        
        // If removing from blacklist, also reset failed login attempts
        if (!_status) {
            users[_userAddr].failedLoginAttempts = 0;
            users[_userAddr].lastFailedLoginTime = 0;
            users[_userAddr].lockoutEndTime = 0;
        }
        
        emit UserBlacklisted(_userAddr, _status);
    }
    
    function getUserRole(address _userAddr) public view returns (string memory) {
        require(users[_userAddr].isRegistered, "User not registered");
        return users[_userAddr].role;
    }
    
    /**
     * Get failed login attempt information
     */
    function getFailedLoginInfo(address _userAddr) public view onlyAdmin returns (
        uint256 failedAttempts,
        uint256 lastFailedTime,
        bool isLocked,
        uint256 lockoutTimeRemaining
    ) {
        User storage user = users[_userAddr];
        return (
            user.failedLoginAttempts,
            user.lastFailedLoginTime,
            isAccountLocked(_userAddr),
            getLockoutTimeRemaining(_userAddr)
        );
    }
    
    /**
     * Get maximum failed attempts allowed
     */
    function getMaxFailedAttempts() public pure returns (uint256) {
        return MAX_FAILED_ATTEMPTS;
    }
    
    /**
     * Get lockout duration in seconds
     */
    function getLockoutDuration() public pure returns (uint256) {
        return LOCKOUT_DURATION;
    }
}
