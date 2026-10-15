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

// src/auth-capture/client/index.ts
var client_exports = {};
__export(client_exports, {
  AuthCaptureEvmScheme: () => AuthCaptureEvmScheme
});
module.exports = __toCommonJS(client_exports);

// src/auth-capture/client/scheme.ts
var import_viem5 = require("viem");

// src/auth-capture/constants.ts
var import_viem = require("viem");
var AUTH_CAPTURE_SCHEME = "auth-capture";
var AUTH_CAPTURE_ESCROW_V1_0_ADDRESS = "0xBdEA0D1bcC5966192B070Fdf62aB4EF5b4420cff";
var EIP3009_TOKEN_COLLECTOR_V1_0_ADDRESS = "0x0E3dF9510de65469C4518D7843919c0b8C7A7757";
var PERMIT2_TOKEN_COLLECTOR_V1_0_ADDRESS = "0x992476B9Ee81d52a5BdA0622C333938D0Af0aB26";
var OPERATOR_REFUND_COLLECTOR_V1_0_ADDRESS = "0x934907bffd0901b6A21e398B9C53A4A38F02fa5d";
var AUTH_CAPTURE_ESCROW_V1_1_ADDRESS = "0xf96815976523E00e65Be8f34cA5e64b4f41EB19c";
var EIP3009_TOKEN_COLLECTOR_V1_1_ADDRESS = "0x8612dfdc421f80336cd14E8EF9cb1E765dB5ab88";
var PERMIT2_TOKEN_COLLECTOR_V1_1_ADDRESS = "0xD69831Aed5bfe262067ec4c751f4F830EcdD446e";
var OPERATOR_REFUND_COLLECTOR_V1_1_ADDRESS = "0x7a03443724d14798c4AB4622F1DAAcA761Fea486";
var AUTH_CAPTURE_ESCROW_ADDRESS = AUTH_CAPTURE_ESCROW_V1_1_ADDRESS;
var AUTH_CAPTURE_DEPLOYMENT_V1_0 = {
  version: "v1.0",
  escrow: AUTH_CAPTURE_ESCROW_V1_0_ADDRESS,
  eip3009Collector: EIP3009_TOKEN_COLLECTOR_V1_0_ADDRESS,
  permit2Collector: PERMIT2_TOKEN_COLLECTOR_V1_0_ADDRESS,
  operatorRefundCollector: OPERATOR_REFUND_COLLECTOR_V1_0_ADDRESS
};
var AUTH_CAPTURE_DEPLOYMENT_V1_1 = {
  version: "v1.1",
  escrow: AUTH_CAPTURE_ESCROW_V1_1_ADDRESS,
  eip3009Collector: EIP3009_TOKEN_COLLECTOR_V1_1_ADDRESS,
  permit2Collector: PERMIT2_TOKEN_COLLECTOR_V1_1_ADDRESS,
  operatorRefundCollector: OPERATOR_REFUND_COLLECTOR_V1_1_ADDRESS
};
function resolveAuthCaptureDeployment(escrow) {
  if (escrow === void 0 || escrow === "") {
    return AUTH_CAPTURE_DEPLOYMENT_V1_1;
  }
  if (!(0, import_viem.isAddress)(escrow)) {
    return void 0;
  }
  const normalized = (0, import_viem.getAddress)(escrow);
  if ((0, import_viem.isAddressEqual)(normalized, AUTH_CAPTURE_ESCROW_V1_1_ADDRESS) || (0, import_viem.isAddressEqual)(normalized, AUTH_CAPTURE_ESCROW_ADDRESS)) {
    return AUTH_CAPTURE_DEPLOYMENT_V1_1;
  }
  if ((0, import_viem.isAddressEqual)(normalized, AUTH_CAPTURE_ESCROW_V1_0_ADDRESS)) {
    return AUTH_CAPTURE_DEPLOYMENT_V1_0;
  }
  return void 0;
}
var SALT_BINDING_TYPEHASH = (0, import_viem.keccak256)(
  (0, import_viem.toBytes)(
    "x402AuthCaptureSaltBinding(address receiverAuthorizer,address policy,uint256 saltNonce)"
  )
);
var RECEIVE_AUTHORIZATION_TYPES = {
  ReceiveWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" }
  ]
};
var PERMIT2_TRANSFER_FROM_TYPES = {
  PermitTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ],
  TokenPermissions: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" }
  ]
};

// src/auth-capture/nonce.ts
var import_viem3 = require("viem");

// src/shared/verifySignature.ts
var import_viem2 = require("viem");

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
var PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

// src/auth-capture/nonce.ts
var PAYMENT_INFO_TYPEHASH = (0, import_viem3.keccak256)(
  new TextEncoder().encode(
    "PaymentInfo(address operator,address payer,address receiver,address token,uint120 maxAmount,uint48 preApprovalExpiry,uint48 authorizationExpiry,uint48 refundExpiry,uint16 minFeeBps,uint16 maxFeeBps,address feeReceiver,uint256 salt)"
  )
);
function hashPaymentInfo(chainId, paymentInfo, payer, escrowAddress = AUTH_CAPTURE_ESCROW_ADDRESS) {
  const paymentInfoEncoded = (0, import_viem3.encodeAbiParameters)(
    [
      { name: "typehash", type: "bytes32" },
      { name: "operator", type: "address" },
      { name: "payer", type: "address" },
      { name: "receiver", type: "address" },
      { name: "token", type: "address" },
      { name: "maxAmount", type: "uint120" },
      { name: "preApprovalExpiry", type: "uint48" },
      { name: "authorizationExpiry", type: "uint48" },
      { name: "refundExpiry", type: "uint48" },
      { name: "minFeeBps", type: "uint16" },
      { name: "maxFeeBps", type: "uint16" },
      { name: "feeReceiver", type: "address" },
      { name: "salt", type: "uint256" }
    ],
    [
      PAYMENT_INFO_TYPEHASH,
      paymentInfo.operator,
      payer,
      paymentInfo.receiver,
      paymentInfo.token,
      BigInt(paymentInfo.maxAmount),
      paymentInfo.preApprovalExpiry,
      paymentInfo.authorizationExpiry,
      paymentInfo.refundExpiry,
      paymentInfo.minFeeBps,
      paymentInfo.maxFeeBps,
      paymentInfo.feeReceiver,
      BigInt(paymentInfo.salt)
    ]
  );
  const paymentInfoHash = (0, import_viem3.keccak256)(paymentInfoEncoded);
  const outerEncoded = (0, import_viem3.encodeAbiParameters)(
    [
      { name: "chainId", type: "uint256" },
      { name: "escrow", type: "address" },
      { name: "paymentInfoHash", type: "bytes32" }
    ],
    [BigInt(chainId), escrowAddress, paymentInfoHash]
  );
  return (0, import_viem3.keccak256)(outerEncoded);
}
function computePayerAgnosticPaymentInfoHash(chainId, paymentInfo, escrowAddress = AUTH_CAPTURE_ESCROW_ADDRESS) {
  return hashPaymentInfo(chainId, paymentInfo, import_viem3.zeroAddress, escrowAddress);
}
async function signERC3009(signer, authorization, extra, tokenAddress, chainId) {
  const domain = {
    name: extra.name,
    version: extra.version,
    chainId,
    verifyingContract: (0, import_viem3.getAddress)(tokenAddress)
  };
  const message = {
    from: (0, import_viem3.getAddress)(authorization.from),
    to: (0, import_viem3.getAddress)(authorization.to),
    value: BigInt(authorization.value),
    validAfter: BigInt(authorization.validAfter),
    validBefore: BigInt(authorization.validBefore),
    nonce: authorization.nonce
  };
  return signer.signTypedData({
    domain,
    types: RECEIVE_AUTHORIZATION_TYPES,
    primaryType: "ReceiveWithAuthorization",
    message
  });
}
async function signPermit2(signer, permit, chainId) {
  const domain = {
    name: "Permit2",
    chainId,
    verifyingContract: PERMIT2_ADDRESS
  };
  const message = {
    permitted: {
      token: (0, import_viem3.getAddress)(permit.permitted.token),
      amount: BigInt(permit.permitted.amount)
    },
    spender: (0, import_viem3.getAddress)(permit.spender),
    nonce: BigInt(permit.nonce),
    deadline: BigInt(permit.deadline)
  };
  return signer.signTypedData({
    domain,
    types: PERMIT2_TRANSFER_FROM_TYPES,
    primaryType: "PermitTransferFrom",
    message
  });
}
function generateSalt() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return (0, import_viem3.toHex)(bytes);
}
function extraAddress(value) {
  if (!value || !(0, import_viem3.isAddress)(value)) return import_viem3.zeroAddress;
  return (0, import_viem3.getAddress)(value);
}
function isNonZeroAddress(value) {
  if (!value || !(0, import_viem3.isAddress)(value)) return false;
  return !(0, import_viem3.isAddressEqual)((0, import_viem3.getAddress)(value), import_viem3.zeroAddress);
}
function isSaltBindingOn(extra) {
  return isNonZeroAddress(extra.receiverAuthorizer) || isNonZeroAddress(extra.policy);
}
function deriveBoundSalt(receiverAuthorizer, policy, saltNonce) {
  const encoded = (0, import_viem3.encodeAbiParameters)(
    [
      { name: "typehash", type: "bytes32" },
      { name: "receiverAuthorizer", type: "address" },
      { name: "policy", type: "address" },
      { name: "saltNonce", type: "uint256" }
    ],
    [SALT_BINDING_TYPEHASH, receiverAuthorizer, policy, BigInt(saltNonce)]
  );
  return (0, import_viem3.keccak256)(encoded);
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

// src/utils.ts
var import_viem4 = require("viem");
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

// src/auth-capture/client/scheme.ts
var AuthCaptureEvmScheme = class {
  /**
   * Construct a client-side auth-capture scheme bound to a specific signer.
   *
   * @param signer - Client-side signer that exposes `address` and `signTypedData`.
   */
  constructor(signer) {
    this.signer = signer;
    this.scheme = AUTH_CAPTURE_SCHEME;
    this.findDefaultAsset = findDefaultAsset;
  }
  /**
   * Build and sign an auth-capture payment payload for the given requirements.
   * Validates all spec-mandated `extra` fields and the asset-transfer method
   * (default `eip3009`, alternative `permit2`), reconstructs the on-chain
   * PaymentInfo struct, computes its payer-agnostic hash, and returns the
   * signed wire payload.
   *
   * @param x402Version - Wire protocol version; only `2` is supported.
   * @param requirements - Resource server's payment requirements (includes scheme `extra`).
   * @param _ - Unused FacilitatorContext (interface compatibility).
   * @returns The signed wire payload tagged with the x402 protocol version.
   * @throws If `x402Version !== 2` or any required `extra` field is missing.
   */
  async createPaymentPayload(x402Version, requirements, _) {
    if (x402Version !== 2) {
      throw new Error(`Unsupported x402Version: ${x402Version}. Only version 2 is supported.`);
    }
    const extra = requirements.extra;
    if (!extra.name) {
      throw new Error(
        `EIP-712 domain parameter 'name' is required in payment requirements for asset ${requirements.asset}`
      );
    }
    if (!extra.version) {
      throw new Error(
        `EIP-712 domain parameter 'version' is required in payment requirements for asset ${requirements.asset}`
      );
    }
    if (!extra.captureAuthorizer) {
      throw new Error(`'captureAuthorizer' is required in payment requirements extra`);
    }
    if (!extra.feeRecipient) {
      throw new Error(`'feeRecipient' is required in payment requirements extra`);
    }
    if (typeof extra.captureDeadline !== "number") {
      throw new Error(`'captureDeadline' is required in payment requirements extra`);
    }
    if (typeof extra.refundDeadline !== "number") {
      throw new Error(`'refundDeadline' is required in payment requirements extra`);
    }
    if (typeof extra.minFeeBps !== "number") {
      throw new Error(`'minFeeBps' is required in payment requirements extra`);
    }
    if (typeof extra.maxFeeBps !== "number") {
      throw new Error(`'maxFeeBps' is required in payment requirements extra`);
    }
    if (typeof requirements.maxTimeoutSeconds !== "number") {
      throw new Error(
        `'maxTimeoutSeconds' is required in PaymentRequirements (used to derive preApprovalExpiry)`
      );
    }
    const chainId = getEvmChainId(requirements.network);
    const deployment = resolveAuthCaptureDeployment(extra.authCaptureEscrow);
    if (!deployment) {
      throw new Error(`Invalid authCaptureEscrow in payment requirements extra`);
    }
    const maxAmount = requirements.amount;
    const nowSeconds = Math.floor(Date.now() / 1e3);
    const preApprovalExpiry = nowSeconds + requirements.maxTimeoutSeconds;
    const assetTransferMethod = extra.assetTransferMethod ?? "eip3009";
    const bindOn = isSaltBindingOn(extra);
    const saltNonce = generateSalt();
    const salt = bindOn ? deriveBoundSalt(
      extraAddress(extra.receiverAuthorizer),
      extraAddress(extra.policy),
      saltNonce
    ) : saltNonce;
    const paymentInfo = {
      operator: extra.captureAuthorizer,
      payer: this.signer.address,
      receiver: requirements.payTo,
      token: requirements.asset,
      maxAmount,
      preApprovalExpiry,
      authorizationExpiry: extra.captureDeadline,
      refundExpiry: extra.refundDeadline,
      minFeeBps: extra.minFeeBps,
      maxFeeBps: extra.maxFeeBps,
      feeReceiver: extra.feeRecipient,
      salt
    };
    const nonce = computePayerAgnosticPaymentInfoHash(chainId, paymentInfo, deployment.escrow);
    if (assetTransferMethod === "permit2") {
      const permit2Authorization = {
        from: this.signer.address,
        permitted: {
          token: requirements.asset,
          amount: maxAmount
        },
        spender: deployment.permit2Collector,
        nonce: (0, import_viem5.hexToBigInt)(nonce).toString(),
        deadline: String(preApprovalExpiry)
      };
      const signature2 = await signPermit2(this.signer, permit2Authorization, chainId);
      const payload2 = bindOn ? { permit2Authorization, signature: signature2, salt, saltNonce } : { permit2Authorization, signature: signature2, salt };
      return { x402Version, payload: payload2 };
    }
    const authorization = {
      from: this.signer.address,
      to: deployment.eip3009Collector,
      value: maxAmount,
      validAfter: "0",
      validBefore: String(preApprovalExpiry),
      nonce
    };
    const signature = await signERC3009(
      this.signer,
      authorization,
      extra,
      requirements.asset,
      chainId
    );
    const payload = bindOn ? { authorization, signature, salt, saltNonce } : { authorization, signature, salt };
    return { x402Version, payload };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthCaptureEvmScheme
});
//# sourceMappingURL=index.js.map