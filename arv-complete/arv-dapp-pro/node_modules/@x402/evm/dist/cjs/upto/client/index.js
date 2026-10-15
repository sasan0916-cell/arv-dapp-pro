"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/upto/client/index.ts
var client_exports = {};
__export(client_exports, {
  UptoEvmScheme: () => UptoEvmScheme,
  createPermit2ApprovalTx: () => createPermit2ApprovalTx,
  erc20AllowanceAbi: () => erc20AllowanceAbi,
  getPermit2AllowanceReadParams: () => getPermit2AllowanceReadParams
});
module.exports = __toCommonJS(client_exports);

// src/constants.ts
var EVM_NETWORK_CHAIN_ID_MAP = {
  ethereum: 1,
  sepolia: 11155111,
  abstract: 2741,
  "abstract-testnet": 11124,
  "base-sepolia": 84532,
  base: 8453,
  "avalanche-fuji": 43113,
  avalanche: 43114,
  iotex: 4689,
  sei: 1329,
  "sei-testnet": 1328,
  polygon: 137,
  "polygon-amoy": 80002,
  peaq: 3338,
  story: 1514,
  educhain: 41923,
  "skale-base-sepolia": 324705682,
  megaeth: 4326,
  monad: 143,
  "monad-testnet": 10143,
  stable: 988,
  "stable-testnet": 2201,
  celo: 42220,
  flare: 14
};
var NETWORKS = Object.keys(EVM_NETWORK_CHAIN_ID_MAP);
var uptoPermit2WitnessTypes = {
  PermitWitnessTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "witness", type: "Witness" }
  ],
  TokenPermissions: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" }
  ],
  Witness: [
    { name: "to", type: "address" },
    { name: "facilitator", type: "address" },
    { name: "validAfter", type: "uint256" }
  ]
};
var eip2612PermitTypes = {
  Permit: [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ]
};
var eip2612NoncesAbi = [
  {
    type: "function",
    name: "nonces",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view"
  }
];
var erc20ApproveAbi = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable"
  }
];
var erc20AllowanceAbi = [
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view"
  }
];
var ERC20_APPROVE_GAS_LIMIT = 70000n;
var DEFAULT_MAX_FEE_PER_GAS = 1000000000n;
var DEFAULT_MAX_PRIORITY_FEE_PER_GAS = 100000000n;
var PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
var x402UptoPermit2ProxyAddress = "0x4020A4f3b7b90ccA423B9fabCc0CE57C6C240002";

// src/utils.ts
var import_viem = require("viem");
var EIP155_NETWORK_REGEX = /^eip155:(\d+)$/;
function getEvmChainId(network) {
  if (!network.startsWith("eip155:")) {
    throw new Error(`Unsupported network format: ${network} (expected eip155:CHAIN_ID)`);
  }
  const match = EIP155_NETWORK_REGEX.exec(network);
  if (!match) {
    throw new Error(`Invalid CAIP-2 chain ID: ${network}`);
  }
  const chainId = Number(match[1]);
  if (!Number.isSafeInteger(chainId)) {
    throw new Error(`Invalid CAIP-2 chain ID: ${network}`);
  }
  return chainId;
}
function getCrypto() {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj) {
    throw new Error("Crypto API not available");
  }
  return cryptoObj;
}
function createPermit2Nonce() {
  const randomBytes = getCrypto().getRandomValues(new Uint8Array(32));
  return BigInt((0, import_viem.toHex)(randomBytes)).toString();
}

// src/upto/client/permit2.ts
var import_viem6 = require("viem");

// src/exact/client/permit2.ts
var import_viem5 = require("viem");

// src/exact/extensions.ts
var EIP2612_GAS_SPONSORING_KEY = "eip2612GasSponsoring";
var ERC20_APPROVAL_GAS_SPONSORING_KEY = "erc20ApprovalGasSponsoring";
var ERC20_APPROVAL_GAS_SPONSORING_VERSION = "1";

// src/shared/permit2.ts
var import_viem4 = require("viem");

// src/multicall.ts
var import_viem2 = require("viem");

// src/shared/erc20approval.ts
var import_viem3 = require("viem");

// src/exact/client/permit2.ts
var MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function createPermit2ApprovalTx(tokenAddress) {
  const data = (0, import_viem5.encodeFunctionData)({
    abi: erc20ApproveAbi,
    functionName: "approve",
    args: [PERMIT2_ADDRESS, MAX_UINT256]
  });
  return {
    to: (0, import_viem5.getAddress)(tokenAddress),
    data
  };
}
function getPermit2AllowanceReadParams(params) {
  return {
    address: (0, import_viem5.getAddress)(params.tokenAddress),
    abi: erc20AllowanceAbi,
    functionName: "allowance",
    args: [(0, import_viem5.getAddress)(params.ownerAddress), PERMIT2_ADDRESS]
  };
}

// src/upto/client/permit2.ts
async function createUptoPermit2Payload(signer, x402Version, paymentRequirements) {
  const facilitatorAddress = paymentRequirements.extra?.facilitatorAddress;
  if (!facilitatorAddress) {
    throw new Error(
      "upto scheme requires facilitatorAddress in paymentRequirements.extra. Ensure the server is configured with an upto facilitator that provides getExtra()."
    );
  }
  const now = Math.floor(Date.now() / 1e3);
  const nonce = createPermit2Nonce();
  const validAfter = "0";
  const deadline = (now + paymentRequirements.maxTimeoutSeconds).toString();
  if (BigInt(deadline) <= BigInt(validAfter)) {
    throw new Error(
      `Invalid time window: deadline (${deadline}) must be after validAfter (${validAfter}). Check that maxTimeoutSeconds (${paymentRequirements.maxTimeoutSeconds}) is positive.`
    );
  }
  const permit2Authorization = {
    from: signer.address,
    permitted: {
      token: (0, import_viem6.getAddress)(paymentRequirements.asset),
      amount: paymentRequirements.amount
    },
    spender: x402UptoPermit2ProxyAddress,
    nonce,
    deadline,
    witness: {
      to: (0, import_viem6.getAddress)(paymentRequirements.payTo),
      facilitator: (0, import_viem6.getAddress)(facilitatorAddress),
      validAfter
    }
  };
  const chainId = getEvmChainId(paymentRequirements.network);
  const signature = await signer.signTypedData({
    domain: { name: "Permit2", chainId, verifyingContract: PERMIT2_ADDRESS },
    types: uptoPermit2WitnessTypes,
    primaryType: "PermitWitnessTransferFrom",
    message: {
      permitted: {
        token: (0, import_viem6.getAddress)(permit2Authorization.permitted.token),
        amount: BigInt(permit2Authorization.permitted.amount)
      },
      spender: (0, import_viem6.getAddress)(permit2Authorization.spender),
      nonce: BigInt(permit2Authorization.nonce),
      deadline: BigInt(permit2Authorization.deadline),
      witness: {
        to: (0, import_viem6.getAddress)(permit2Authorization.witness.to),
        facilitator: (0, import_viem6.getAddress)(permit2Authorization.witness.facilitator),
        validAfter: BigInt(permit2Authorization.witness.validAfter)
      }
    }
  });
  return {
    x402Version,
    payload: { signature, permit2Authorization }
  };
}

// src/shared/extensions/gasSponsoring.ts
var import_viem10 = require("viem");

// src/exact/client/eip2612.ts
var import_viem7 = require("viem");
async function signEip2612Permit(signer, tokenAddress, tokenName, tokenVersion, chainId, deadline, permittedAmount) {
  const owner = signer.address;
  const spender = (0, import_viem7.getAddress)(PERMIT2_ADDRESS);
  const nonce = await signer.readContract({
    address: tokenAddress,
    abi: eip2612NoncesAbi,
    functionName: "nonces",
    args: [owner]
  });
  const domain = {
    name: tokenName,
    version: tokenVersion,
    chainId,
    verifyingContract: tokenAddress
  };
  const approvalAmount = BigInt(permittedAmount);
  const message = {
    owner,
    spender,
    value: approvalAmount,
    nonce,
    deadline: BigInt(deadline)
  };
  const signature = await signer.signTypedData({
    domain,
    types: eip2612PermitTypes,
    primaryType: "Permit",
    message
  });
  return {
    from: owner,
    asset: tokenAddress,
    spender,
    amount: approvalAmount.toString(),
    nonce: nonce.toString(),
    deadline,
    signature,
    version: "1"
  };
}

// src/exact/client/erc20approval.ts
var import_viem8 = require("viem");
async function signErc20ApprovalTransaction(signer, tokenAddress, chainId) {
  const from = signer.address;
  const spender = (0, import_viem8.getAddress)(PERMIT2_ADDRESS);
  const data = (0, import_viem8.encodeFunctionData)({
    abi: erc20ApproveAbi,
    functionName: "approve",
    args: [spender, import_viem8.maxUint256]
  });
  const nonce = await signer.getTransactionCount({ address: from });
  let maxFeePerGas;
  let maxPriorityFeePerGas;
  try {
    const fees = await signer.estimateFeesPerGas?.();
    if (!fees) {
      throw new Error("no fee estimates available");
    }
    maxFeePerGas = fees.maxFeePerGas;
    maxPriorityFeePerGas = fees.maxPriorityFeePerGas;
  } catch {
    maxFeePerGas = DEFAULT_MAX_FEE_PER_GAS;
    maxPriorityFeePerGas = DEFAULT_MAX_PRIORITY_FEE_PER_GAS;
  }
  const signedTransaction = await signer.signTransaction({
    to: tokenAddress,
    data,
    nonce,
    gas: ERC20_APPROVE_GAS_LIMIT,
    maxFeePerGas,
    maxPriorityFeePerGas,
    chainId
  });
  return {
    from,
    asset: tokenAddress,
    spender,
    amount: import_viem8.maxUint256.toString(),
    signedTransaction,
    version: ERC20_APPROVAL_GAS_SPONSORING_VERSION
  };
}

// src/shared/rpc.ts
var import_viem9 = require("viem");
var rpcClientCache = /* @__PURE__ */ new Map();
function isConfigByChainId(options) {
  const keys = Object.keys(options);
  return keys.length > 0 && keys.every((key) => /^\d+$/.test(key));
}
function getRpcClient(rpcUrl) {
  const existing = rpcClientCache.get(rpcUrl);
  if (existing) {
    return existing;
  }
  const client = (0, import_viem9.createPublicClient)({
    transport: (0, import_viem9.http)(rpcUrl)
  });
  rpcClientCache.set(rpcUrl, client);
  return client;
}
function resolveRpcUrl(network, options) {
  if (!options) {
    return void 0;
  }
  if (isConfigByChainId(options)) {
    const chainId = getEvmChainId(network);
    const optionsByChainId = options;
    return optionsByChainId[chainId]?.rpcUrl;
  }
  return options.rpcUrl;
}
function resolveExtensionRpcCapabilities(network, signer, options) {
  const capabilities = {
    signTransaction: signer.signTransaction,
    readContract: signer.readContract,
    getTransactionCount: signer.getTransactionCount,
    estimateFeesPerGas: signer.estimateFeesPerGas
  };
  const needsRpcBackfill = !capabilities.readContract || !capabilities.getTransactionCount || !capabilities.estimateFeesPerGas;
  if (!needsRpcBackfill) {
    return capabilities;
  }
  const rpcUrl = resolveRpcUrl(network, options);
  if (!rpcUrl) {
    return capabilities;
  }
  const rpcClient = getRpcClient(rpcUrl);
  if (!capabilities.readContract) {
    capabilities.readContract = (args) => rpcClient.readContract(args);
  }
  if (!capabilities.getTransactionCount) {
    capabilities.getTransactionCount = async (args) => rpcClient.getTransactionCount({ address: args.address });
  }
  if (!capabilities.estimateFeesPerGas) {
    capabilities.estimateFeesPerGas = async () => rpcClient.estimateFeesPerGas();
  }
  return capabilities;
}

// src/shared/extensions/gasSponsoring.ts
async function trySignEip2612PermitExtension(signer, options, requirements, result, context, approvalAmount) {
  const capabilities = resolveExtensionRpcCapabilities(requirements.network, signer, options);
  if (!capabilities.readContract) {
    return void 0;
  }
  if (!context?.extensions?.[EIP2612_GAS_SPONSORING_KEY]) {
    return void 0;
  }
  const tokenName = requirements.extra?.name;
  const tokenVersion = requirements.extra?.version;
  if (!tokenName || !tokenVersion) {
    return void 0;
  }
  const chainId = getEvmChainId(requirements.network);
  const tokenAddress = (0, import_viem10.getAddress)(requirements.asset);
  const requiredAllowance = approvalAmount ?? requirements.amount;
  try {
    const allowance = await capabilities.readContract({
      address: tokenAddress,
      abi: erc20AllowanceAbi,
      functionName: "allowance",
      args: [signer.address, PERMIT2_ADDRESS]
    });
    if (allowance >= BigInt(requiredAllowance)) {
      return void 0;
    }
  } catch {
  }
  const permit2Auth = result.payload?.permit2Authorization;
  const deadline = permit2Auth?.deadline ?? Math.floor(Date.now() / 1e3 + requirements.maxTimeoutSeconds).toString();
  const info = await signEip2612Permit(
    {
      address: signer.address,
      signTypedData: (msg) => signer.signTypedData(msg),
      readContract: capabilities.readContract
    },
    tokenAddress,
    tokenName,
    tokenVersion,
    chainId,
    deadline,
    requiredAllowance
  );
  return {
    [EIP2612_GAS_SPONSORING_KEY]: { info }
  };
}
async function trySignErc20ApprovalExtension(signer, options, requirements, context, approvalAmount) {
  const capabilities = resolveExtensionRpcCapabilities(requirements.network, signer, options);
  if (!capabilities.readContract) {
    return void 0;
  }
  if (!context?.extensions?.[ERC20_APPROVAL_GAS_SPONSORING_KEY]) {
    return void 0;
  }
  if (!capabilities.signTransaction || !capabilities.getTransactionCount) {
    return void 0;
  }
  const chainId = getEvmChainId(requirements.network);
  const tokenAddress = (0, import_viem10.getAddress)(requirements.asset);
  const requiredAllowance = approvalAmount ?? requirements.amount;
  try {
    const allowance = await capabilities.readContract({
      address: tokenAddress,
      abi: erc20AllowanceAbi,
      functionName: "allowance",
      args: [signer.address, PERMIT2_ADDRESS]
    });
    if (allowance >= BigInt(requiredAllowance)) {
      return void 0;
    }
  } catch {
  }
  const info = await signErc20ApprovalTransaction(
    {
      address: signer.address,
      signTransaction: capabilities.signTransaction,
      getTransactionCount: capabilities.getTransactionCount,
      estimateFeesPerGas: capabilities.estimateFeesPerGas
    },
    tokenAddress,
    chainId
  );
  return {
    [ERC20_APPROVAL_GAS_SPONSORING_KEY]: { info }
  };
}

// src/defaultAssets.ts
var DEFAULT_ASSETS = {
  "eip155:8453": [
    {
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Base mainnet USDC
  "eip155:84532": [
    {
      asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Base Sepolia USDC
  "eip155:1": [
    {
      asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Ethereum mainnet USDC
  "eip155:43114": [
    {
      asset: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Avalanche C-Chain USDC
  "eip155:4326": [
    {
      asset: "0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7",
      name: "MegaUSD",
      version: "1",
      decimals: 18,
      symbol: "MegaUSD",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // MegaETH mainnet MegaUSD (no EIP-3009, supports EIP-2612)
  "eip155:143": [
    {
      asset: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Monad mainnet USDC
  "eip155:10143": [
    {
      asset: "0x534b2f3A21130d7a60830c2Df862319e593943A3",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Monad testnet USDC
  "eip155:988": [
    {
      asset: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
      name: "USDT0",
      version: "1",
      decimals: 6,
      symbol: "USDT0"
    }
  ],
  // Stable mainnet USDT0
  "eip155:2201": [
    {
      asset: "0x78Cf24370174180738C5B8E352B6D14c83a6c9A9",
      name: "USDT0",
      version: "1",
      decimals: 6,
      symbol: "USDT0"
    }
  ],
  // Stable testnet USDT0
  "eip155:137": [
    {
      asset: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Polygon mainnet USDC
  "eip155:42161": [
    {
      asset: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Arbitrum One USDC
  "eip155:421614": [
    {
      asset: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Arbitrum Sepolia USDC
  "eip155:31612": [
    {
      asset: "0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186",
      name: "Mezo USD",
      version: "1",
      decimals: 18,
      symbol: "mUSD",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // Mezo mainnet mUSD (no EIP-3009, supports EIP-2612)
  "eip155:31611": [
    {
      asset: "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503",
      name: "Mezo USD",
      version: "1",
      decimals: 18,
      symbol: "mUSD",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // Mezo Testnet mUSD (no EIP-3009, supports EIP-2612)
  "eip155:723487": [
    {
      asset: "0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb",
      name: "Stable Coin",
      version: "1",
      decimals: 6,
      symbol: "SBC",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // Radius Network SBC (no EIP-3009, supports EIP-2612)
  "eip155:72344": [
    {
      asset: "0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb",
      name: "Stable Coin",
      version: "1",
      decimals: 6,
      symbol: "SBC",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // Radius Testnet SBC (no EIP-3009, supports EIP-2612)
  "eip155:36900": [
    {
      asset: "0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2",
      name: "USDC.e",
      version: "2",
      decimals: 6,
      symbol: "USDC.e"
    }
  ],
  // ADI Chain USDC.e (EIP-3009 supported)
  "eip155:190415": [
    {
      asset: "0x401eCb1D350407f13ba348573E5630B83638E30D",
      name: "Bridged USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC.e"
    }
  ],
  // HPP mainnet USDC.e
  "eip155:181228": [
    {
      asset: "0x401eCb1D350407f13ba348573E5630B83638E30D",
      name: "Bridged USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC.e"
    }
  ],
  // HPP Sepolia USDC.e
  "eip155:50": [
    {
      asset: "0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // XDC Network mainnet USDC (Bridged USDC Standard, EIP-3009 supported)
  "eip155:51": [
    {
      asset: "0xb5AB69F7bBada22B28e79C8FFAECe55eF1c771D4",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // XDC Apothem testnet USDC (Bridged USDC Standard, EIP-3009 supported)
  "eip155:38833": [
    {
      asset: "0xA5b8BF902b2844dA17d4506cc827F7F1681735E7",
      name: "USDC",
      version: "1",
      decimals: 6,
      symbol: "USDC",
      assetTransferMethod: "permit2"
    }
  ],
  // Igra mainnet USDC (no EIP-3009, no EIP-2612)
  "eip155:14": [
    {
      asset: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D",
      name: "USD\u20AE0",
      version: "1",
      decimals: 6,
      symbol: "USDT0"
    }
  ],
  // Flare mainnet USD₮0 (EIP-3009 supported)
  "eip155:42220": [
    {
      asset: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    },
    {
      asset: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      name: "Tether USD",
      version: "1",
      decimals: 6,
      symbol: "USDT"
    },
    {
      asset: "0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771",
      name: "Tether America USD",
      version: "1",
      decimals: 6,
      symbol: "USAT"
    }
  ],
  // Celo mainnet USDC, USDT, USAT (EIP-3009 supported)
  "eip155:11142220": [
    {
      asset: "0x01C5C0122039549AD1493B8220cABEdD739BC44E",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Celo Sepolia testnet USDC (EIP-3009 supported)
  "eip155:1329": [
    {
      asset: "0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Sei mainnet USDC (EIP-3009 supported)
  "eip155:1328": [
    {
      asset: "0x4fCF1784B31630811181f670Aea7A7bEF803eaED",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Sei testnet USDC (EIP-3009 supported)
  "eip155:5042": [
    {
      asset: "0x3600000000000000000000000000000000000000",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Arc mainnet USDC (EIP-3009 supported)
  "eip155:5042002": [
    {
      asset: "0x3600000000000000000000000000000000000000",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ]
  // Arc Testnet USDC (EIP-3009 supported)
};
function resolveNetworkKey(network) {
  if (network in DEFAULT_ASSETS) {
    return network;
  }
  const chainId = EVM_NETWORK_CHAIN_ID_MAP[network];
  if (chainId !== void 0) {
    return `eip155:${chainId}`;
  }
  return network;
}
var findDefaultAsset = (asset, network) => {
  const key = resolveNetworkKey(network);
  const assets = DEFAULT_ASSETS[key];
  if (!assets) {
    return void 0;
  }
  const normalized = asset.toLowerCase();
  return assets.find((entry) => entry.asset.toLowerCase() === normalized);
};

// src/upto/client/scheme.ts
var UptoEvmScheme = class {
  /**
   * Creates a new UptoEvmScheme instance.
   *
   * @param signer - The EVM signer for client operations
   * @param options - Optional RPC configuration
   */
  constructor(signer, options) {
    this.signer = signer;
    this.options = options;
    this.scheme = "upto";
    this.findDefaultAsset = findDefaultAsset;
  }
  /**
   * Creates a payment payload for the Upto scheme using Permit2.
   *
   * @param x402Version - The x402 protocol version
   * @param paymentRequirements - The payment requirements
   * @param context - Optional context with server-declared extensions
   * @returns Promise resolving to a payment payload result
   */
  async createPaymentPayload(x402Version, paymentRequirements, context) {
    const result = await createUptoPermit2Payload(this.signer, x402Version, paymentRequirements);
    const eip2612Extensions = await trySignEip2612PermitExtension(
      this.signer,
      this.options,
      paymentRequirements,
      result,
      context
    );
    if (eip2612Extensions) {
      return { ...result, extensions: eip2612Extensions };
    }
    const erc20Extensions = await trySignErc20ApprovalExtension(
      this.signer,
      this.options,
      paymentRequirements,
      context
    );
    if (erc20Extensions) {
      return { ...result, extensions: erc20Extensions };
    }
    return result;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UptoEvmScheme,
  createPermit2ApprovalTx,
  erc20AllowanceAbi,
  getPermit2AllowanceReadParams
});
//# sourceMappingURL=index.js.map