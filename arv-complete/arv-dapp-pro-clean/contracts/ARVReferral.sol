// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ARVReferral {
    address public owner;

    // Mapping from Referral Code (e.g., "ARVAB12") to Referrer Address
    mapping(string => address) public codeToReferrer;
    
    // Mapping from User Address to their generated Referral Code
    mapping(address => string) public userToCode;
    
    // Mapping from User Address to the Referrer they used
    mapping(address => address) public referredBy;
    
    // Mapping to count how many people a referrer invited
    mapping(address => uint256) public inviteCount;

    event CodeRegistered(address indexed user, string code);
    event ReferralRegistered(address indexed referrer, address indexed newUser, string code);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev کاربر کد اختصاصی خودش رو ثبت می‌کنه
     * @param code کد تولید شده (مثلاً ARVAB12)
     */
    function registerMyCode(string memory code) external {
        require(bytes(userToCode[msg.sender]).length == 0, "Code already set");
        require(codeToReferrer[code] == address(0), "Code already taken");
        
        userToCode[msg.sender] = code;
        codeToReferrer[code] = msg.sender;
        
        emit CodeRegistered(msg.sender, code);
    }

    /**
     * @dev کاربر جدید با کد معرف ثبت‌نام می‌کنه
     * @param code کد معرف
     */
    function registerReferral(string memory code) external {
        require(referredBy[msg.sender] == address(0), "Already referred");
        require(codeToReferrer[code] != address(0), "Invalid code");
        require(codeToReferrer[code] != msg.sender, "Cannot refer yourself");

        address referrer = codeToReferrer[code];
        referredBy[msg.sender] = referrer;
        inviteCount[referrer] += 1;

        emit ReferralRegistered(referrer, msg.sender, code);
    }

    /**
     * @dev دریافت اطلاعات یک آدرس
     */
    function getReferralInfo(address user) external view returns (
        string memory code,
        address referrer,
        uint256 invites
    ) {
        return (userToCode[user], referredBy[user], inviteCount[user]);
    }
}
