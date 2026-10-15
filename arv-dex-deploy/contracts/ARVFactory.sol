// SPDX-License-Identifier: MIT
import "./ARVPair.sol";
pragma solidity ^0.8.20;

interface IARVPair {
    function initialize(address _token0, address _token1) external;
}

contract ARVFactory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);

    constructor(address _feeToSetter) {
        require(_feeToSetter != address(0), "ARVFactory: ZERO_ADDRESS");
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "ARVFactory: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "ARVFactory: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "ARVFactory: PAIR_EXISTS");

        bytes memory bytecode = type(ARVPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        require(pair != address(0), "ARVFactory: CREATE2_FAILED");

        IARVPair(pair).initialize(token0, token1);

        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);

        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "ARVFactory: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "ARVFactory: FORBIDDEN");
        require(_feeToSetter != address(0), "ARVFactory: ZERO_ADDRESS");
        feeToSetter = _feeToSetter;
    }
}

// قرارداد ARVPair رو باید کنار ARVFactory کامپایل کنی
// import './ARVPair.sol';
