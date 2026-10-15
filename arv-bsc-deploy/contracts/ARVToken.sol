// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract ARVToken is IBEP20 {
    string public constant name = "ARV";
    string public constant symbol = "ARV";
    uint8 public constant decimals = 18;
    string public constant version = "ARV Core v1.7.3";

    uint256 private constant TOTAL_SUPPLY = 100_000_000 * 10**18;
    uint256 private constant MASTER_AMOUNT = 60_000_000 * 10**18;
    uint256 private constant REWARD_AMOUNT = 40_000_000 * 10**18;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    address public immutable masterWallet;
    address public immutable rewardPoolWallet;
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "ARV: caller is not the owner");
        _;
    }

    constructor(address _masterWallet, address _rewardPoolWallet) {
        require(_masterWallet != address(0), "ARV: master wallet is zero address");
        require(_rewardPoolWallet != address(0), "ARV: reward pool is zero address");
        require(_masterWallet != _rewardPoolWallet, "ARV: wallets must be different");

        owner = msg.sender;
        masterWallet = _masterWallet;
        rewardPoolWallet = _rewardPoolWallet;
        _totalSupply = TOTAL_SUPPLY;

        _balances[_masterWallet] = MASTER_AMOUNT;
        _balances[_rewardPoolWallet] = REWARD_AMOUNT;

        emit Transfer(address(0), _masterWallet, MASTER_AMOUNT);
        emit Transfer(address(0), _rewardPoolWallet, REWARD_AMOUNT);
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address tokenOwner, address spender) external view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ARV: insufficient allowance");
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }
        _transfer(sender, recipient, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ARV: transfer from zero address");
        require(recipient != address(0), "ARV: transfer to zero address");

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ARV: insufficient balance");

        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function _approve(address tokenOwner, address spender, uint256 amount) internal {
        require(tokenOwner != address(0), "ARV: approve from zero address");
        require(spender != address(0), "ARV: approve to zero address");

        _allowances[tokenOwner][spender] = amount;
        emit Approval(tokenOwner, spender, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ARV: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
