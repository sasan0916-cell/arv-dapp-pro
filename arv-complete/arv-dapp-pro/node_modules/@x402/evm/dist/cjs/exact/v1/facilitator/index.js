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

// src/exact/v1/facilitator/index.ts
var facilitator_exports = {};
__export(facilitator_exports, {
  ExactEvmSchemeV1: () => ExactEvmSchemeV12
});
module.exports = __toCommonJS(facilitator_exports);

// src/shared/extensions/gasSponsoring.ts
var import_viem5 = require("viem");

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
function getEvmChainIdV1(network) {
  const chainId = EVM_NETWORK_CHAIN_ID_MAP[network];
  if (!chainId) {
    throw new Error(`Unsupported v1 network: ${network}`);
  }
  return chainId;
}
var authorizationTypes = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" }
  ]
};
var eip3009ABI = [
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" }
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
      { name: "signature", type: "bytes" }
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "authorizer", type: "address" },
      { name: "nonce", type: "bytes32" }
    ],
    name: "authorizationState",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
];

// src/utils.ts
var import_viem = require("viem");

// src/exact/client/eip2612.ts
var import_viem2 = require("viem");

// src/exact/client/erc20approval.ts
var import_viem3 = require("viem");

// src/shared/rpc.ts
var import_viem4 = require("viem");

// src/shared/extensions/builderCode.ts
var BUILDER_CODE_KEY = "builder-code";
var BUILDER_CODE_RESOLVER = async (context, ctx) => {
  const ext = context.getExtension(BUILDER_CODE_KEY);
  if (!ext?.buildDataSuffix) {
    return void 0;
  }
  return ext.buildDataSuffix(ctx);
};
var DATA_SUFFIX_RESOLVERS = [BUILDER_CODE_RESOLVER];
async function resolveDataSuffix(context, ctx) {
  if (!context) {
    return void 0;
  }
  const parts = [];
  for (const resolver of DATA_SUFFIX_RESOLVERS) {
    const suffix = await resolver(context, ctx);
    if (suffix && suffix !== "0x" && suffix.length > 2) {
      parts.push(suffix);
    }
  }
  if (parts.length === 0) {
    return void 0;
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return parts.reduce((acc, part, index) => {
    if (index === 0) {
      return part;
    }
    const stripped = part.startsWith("0x") ? part.slice(2) : part;
    return `${acc}${stripped}`;
  });
}

// src/shared/verifySignature.ts
var import_viem6 = require("viem");
var ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
async function classifyErc6492Payer(signer, signature, payerAddress) {
  const erc6492Data = (0, import_viem6.parseErc6492Signature)(signature);
  const hasDeploymentInfo = !!(erc6492Data.address && erc6492Data.data && !(0, import_viem6.isAddressEqual)(erc6492Data.address, ZERO_ADDRESS));
  const innerSignature = hasDeploymentInfo ? erc6492Data.signature : signature;
  const eip6492Deployment = hasDeploymentInfo ? { factoryAddress: erc6492Data.address, factoryCalldata: erc6492Data.data } : void 0;
  let code;
  try {
    code = await signer.getCode({ address: payerAddress });
  } catch {
    code = void 0;
  }
  const isDeployedAtPayer = !!(code && code !== "0x");
  const isCounterfactual = hasDeploymentInfo && !isDeployedAtPayer;
  return {
    isCounterfactual,
    isDeployedAtPayer,
    hasDeploymentInfo,
    innerSignature,
    eip6492Deployment
  };
}
var ERC1271_MAGIC_VALUE = "0x1626ba7e";
var ERC1271_ABI = [
  {
    name: "isValidSignature",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "hash", type: "bytes32" },
      { name: "signature", type: "bytes" }
    ],
    outputs: [{ name: "", type: "bytes4" }]
  }
];
async function verifyTypedDataSignature(signer, params) {
  let digest;
  try {
    digest = (0, import_viem6.hashTypedData)({
      domain: params.domain,
      types: params.types,
      primaryType: params.primaryType,
      message: params.message
    });
  } catch {
    return false;
  }
  return verifyHashSignature(signer, params.address, digest, params.signature);
}
async function verifyHashSignature(signer, address, digest, signature) {
  let code;
  try {
    code = await signer.getCode({ address });
  } catch {
    return false;
  }
  return verifyHashSignatureWithCode(signer, address, code, digest, signature);
}
function verifyHashSignatureWithCode(signer, address, code, digest, signature) {
  if (!code || code === "0x") {
    return verifyECDSA(address, digest, signature);
  }
  return verifyERC1271(signer, address, digest, signature);
}
async function verifyECDSA(address, digest, signature) {
  const sigHex = signature.startsWith("0x") ? signature.slice(2) : signature;
  if (sigHex.length !== 130) return false;
  try {
    const recovered = await (0, import_viem6.recoverAddress)({ hash: digest, signature });
    return (0, import_viem6.isAddressEqual)((0, import_viem6.getAddress)(recovered), (0, import_viem6.getAddress)(address));
  } catch {
    return false;
  }
}
async function verifyERC1271(signer, address, digest, signature) {
  try {
    const result = await signer.readContract({
      address,
      abi: ERC1271_ABI,
      functionName: "isValidSignature",
      args: [digest, signature]
    });
    if (typeof result !== "string") return false;
    return result.toLowerCase().startsWith(ERC1271_MAGIC_VALUE);
  } catch {
    return false;
  }
}

// src/exact/v1/facilitator/scheme.ts
var import_viem10 = require("viem");

// src/exact/v1/client/scheme.ts
var import_viem7 = require("viem");

// src/exact/facilitator/errors.ts
var ErrInvalidScheme = "invalid_exact_evm_scheme";
var ErrNetworkMismatch = "invalid_exact_evm_network_mismatch";
var ErrMissingEip712Domain = "invalid_exact_evm_missing_eip712_domain";
var ErrRecipientMismatch = "invalid_exact_evm_recipient_mismatch";
var ErrInvalidSignature = "invalid_exact_evm_signature";
var ErrValidBeforeExpired = "invalid_exact_evm_payload_authorization_valid_before";
var ErrValidAfterInFuture = "invalid_exact_evm_payload_authorization_valid_after";
var ErrInvalidAuthorizationValue = "invalid_exact_evm_authorization_value";
var ErrTransactionFailed = "invalid_exact_evm_transaction_failed";
var ErrTransferEventMismatch = "invalid_exact_evm_transfer_event_mismatch";
var ErrEip3009TokenNameMismatch = "invalid_exact_evm_token_name_mismatch";
var ErrEip3009TokenVersionMismatch = "invalid_exact_evm_token_version_mismatch";
var ErrEip3009NotSupported = "invalid_exact_evm_eip3009_not_supported";
var ErrEip3009NonceAlreadyUsed = "invalid_exact_evm_nonce_already_used";
var ErrEip3009InsufficientBalance = "invalid_exact_evm_insufficient_balance";
var ErrEip3009SimulationFailed = "invalid_exact_evm_transaction_simulation_failed";
var ErrFactoryNotAllowed = "eip6492_factory_not_allowed";
var ErrSmartWalletDeploymentFailed = "smart_wallet_deployment_failed";

// src/exact/facilitator/eip3009-utils.ts
var import_viem9 = require("viem");

// src/multicall.ts
var import_viem8 = require("viem");
var MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";
var multicall3ABI = [
  {
    inputs: [
      { name: "requireSuccess", type: "bool" },
      {
        name: "calls",
        type: "tuple[]",
        components: [
          { name: "target", type: "address" },
          { name: "callData", type: "bytes" }
        ]
      }
    ],
    name: "tryAggregate",
    outputs: [
      {
        name: "returnData",
        type: "tuple[]",
        components: [
          { name: "success", type: "bool" },
          { name: "returnData", type: "bytes" }
        ]
      }
    ],
    stateMutability: "payable",
    type: "function"
  }
];
async function multicall(readContract, calls) {
  const aggregateCalls = calls.map((call) => {
    if ("callData" in call) {
      return { target: call.address, callData: call.callData };
    }
    const callData = (0, import_viem8.encodeFunctionData)({
      abi: call.abi,
      functionName: call.functionName,
      args: call.args
    });
    return { target: call.address, callData };
  });
  const rawResults = await readContract({
    address: MULTICALL3_ADDRESS,
    abi: multicall3ABI,
    functionName: "tryAggregate",
    args: [false, aggregateCalls]
  });
  return rawResults.map((raw, i) => {
    if (!raw.success) {
      return {
        status: "failure",
        error: new Error(`multicall: call reverted (returnData: ${raw.returnData})`)
      };
    }
    const call = calls[i];
    if ("callData" in call) {
      return { status: "success", result: void 0 };
    }
    try {
      const decoded = (0, import_viem8.decodeFunctionResult)({
        abi: call.abi,
        functionName: call.functionName,
        data: raw.returnData
      });
      return { status: "success", result: decoded };
    } catch (err) {
      return {
        status: "failure",
        error: err instanceof Error ? err : new Error(String(err))
      };
    }
  });
}

// src/exact/facilitator/eip3009-utils.ts
var erc20TransferEventAbi = [
  {
    type: "event",
    name: "Transfer",
    anonymous: false,
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false }
    ]
  }
];
async function simulateEip3009Transfer(signer, erc20Address, payload, eip6492Deployment) {
  return (await simulateEip3009TransferResult(signer, erc20Address, payload, eip6492Deployment)).ok;
}
async function simulateEip3009TransferResult(signer, erc20Address, payload, eip6492Deployment) {
  const auth = payload.authorization;
  const transferArgs = [
    (0, import_viem9.getAddress)(auth.from),
    (0, import_viem9.getAddress)(auth.to),
    BigInt(auth.value),
    BigInt(auth.validAfter),
    BigInt(auth.validBefore),
    auth.nonce
  ];
  if (eip6492Deployment) {
    const { signature: innerSignature } = (0, import_viem9.parseErc6492Signature)(payload.signature);
    const transferCalldata = (0, import_viem9.encodeFunctionData)({
      abi: eip3009ABI,
      functionName: "transferWithAuthorization",
      args: [...transferArgs, innerSignature]
    });
    try {
      const results = await multicall(signer.readContract.bind(signer), [
        {
          address: (0, import_viem9.getAddress)(eip6492Deployment.factoryAddress),
          callData: eip6492Deployment.factoryCalldata
        },
        {
          address: erc20Address,
          callData: transferCalldata
        }
      ]);
      return { ok: results[1]?.status === "success" };
    } catch (error) {
      return { ok: false, error };
    }
  }
  const sig = payload.signature;
  const sigLength = sig.startsWith("0x") ? sig.length - 2 : sig.length;
  const isECDSA = sigLength === 130;
  try {
    if (isECDSA) {
      const parsedSig = (0, import_viem9.parseSignature)(sig);
      await signer.readContract({
        address: erc20Address,
        abi: eip3009ABI,
        functionName: "transferWithAuthorization",
        args: [
          ...transferArgs,
          parsedSig.v ?? parsedSig.yParity,
          parsedSig.r,
          parsedSig.s
        ]
      });
    } else {
      await signer.readContract({
        address: erc20Address,
        abi: eip3009ABI,
        functionName: "transferWithAuthorization",
        args: [...transferArgs, sig]
      });
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
async function diagnoseEip3009SimulationFailure(signer, erc20Address, payload, requirements, amountRequired) {
  const payer = payload.authorization.from;
  const diagnosticCalls = [
    {
      address: erc20Address,
      abi: eip3009ABI,
      functionName: "balanceOf",
      args: [payload.authorization.from]
    },
    {
      address: erc20Address,
      abi: eip3009ABI,
      functionName: "name"
    },
    {
      address: erc20Address,
      abi: eip3009ABI,
      functionName: "version"
    },
    {
      address: erc20Address,
      abi: eip3009ABI,
      functionName: "authorizationState",
      args: [payload.authorization.from, payload.authorization.nonce]
    }
  ];
  try {
    const results = await multicall(signer.readContract.bind(signer), diagnosticCalls);
    const [balanceResult, nameResult, versionResult, authStateResult] = results;
    if (authStateResult.status === "failure") {
      return { isValid: false, invalidReason: ErrEip3009NotSupported, payer };
    }
    if (authStateResult.status === "success" && authStateResult.result === true) {
      return { isValid: false, invalidReason: ErrEip3009NonceAlreadyUsed, payer };
    }
    if (nameResult.status === "success" && requirements.extra?.name && nameResult.result !== requirements.extra.name) {
      return { isValid: false, invalidReason: ErrEip3009TokenNameMismatch, payer };
    }
    if (versionResult.status === "success" && requirements.extra?.version && versionResult.result !== requirements.extra.version) {
      return { isValid: false, invalidReason: ErrEip3009TokenVersionMismatch, payer };
    }
    if (balanceResult.status === "success") {
      const balance = balanceResult.result;
      if (balance < BigInt(amountRequired)) {
        return {
          isValid: false,
          invalidReason: ErrEip3009InsufficientBalance,
          payer
        };
      }
    }
  } catch {
  }
  return { isValid: false, invalidReason: ErrEip3009SimulationFailed, payer };
}
function verifyEip3009TransferEvent(logs, erc20Address, expected) {
  const transferLogs = (0, import_viem9.parseEventLogs)({
    abi: erc20TransferEventAbi,
    eventName: "Transfer",
    logs: logs.filter((log) => (0, import_viem9.isAddressEqual)(log.address, erc20Address))
  });
  return transferLogs.some(
    (log) => (0, import_viem9.isAddressEqual)(log.args.from, expected.from) && (0, import_viem9.isAddressEqual)(log.args.to, expected.to) && log.args.value === expected.value
  );
}
async function executeTransferWithAuthorization(signer, erc20Address, payload, dataSuffix) {
  const { signature } = (0, import_viem9.parseErc6492Signature)(payload.signature);
  const signatureLength = signature.startsWith("0x") ? signature.length - 2 : signature.length;
  const isECDSA = signatureLength === 130;
  const auth = payload.authorization;
  const baseArgs = [
    (0, import_viem9.getAddress)(auth.from),
    (0, import_viem9.getAddress)(auth.to),
    BigInt(auth.value),
    BigInt(auth.validAfter),
    BigInt(auth.validBefore),
    auth.nonce
  ];
  let signatureArgs;
  if (isECDSA) {
    const parsedSig = (0, import_viem9.parseSignature)(signature);
    signatureArgs = [
      parsedSig.v || parsedSig.yParity,
      parsedSig.r,
      parsedSig.s
    ];
  } else {
    signatureArgs = [signature];
  }
  return signer.writeContract({
    address: erc20Address,
    abi: eip3009ABI,
    functionName: "transferWithAuthorization",
    args: [...baseArgs, ...signatureArgs],
    dataSuffix
  });
}

// src/exact/v1/facilitator/scheme.ts
var ExactEvmSchemeV12 = class {
  /**
   * Creates a new ExactEvmFacilitatorV1 instance.
   *
   * @param signer - The EVM signer for facilitator operations
   * @param config - Optional configuration for the facilitator
   */
  constructor(signer, config) {
    this.signer = signer;
    this.scheme = "exact";
    this.caipFamily = "eip155:*";
    this.config = {
      eip6492AllowedFactories: config?.eip6492AllowedFactories ?? [],
      simulateInSettle: config?.simulateInSettle ?? false
    };
  }
  /**
   * Get mechanism-specific extra data for the supported kinds endpoint.
   * For EVM, no extra data is needed.
   *
   * @param _ - The network identifier (unused for EVM)
   * @returns undefined (EVM has no extra data)
   */
  getExtra(_) {
    return void 0;
  }
  /**
   * Get signer addresses used by this facilitator.
   * Returns all addresses this facilitator can use for signing/settling transactions.
   *
   * @param _ - The network identifier (unused for EVM, addresses are network-agnostic)
   * @returns Array of facilitator wallet addresses
   */
  getSigners(_) {
    return [...this.signer.getAddresses()];
  }
  /**
   * Verifies a payment payload (V1).
   *
   * @param payload - The payment payload to verify
   * @param requirements - The payment requirements
   * @returns Promise resolving to verification response
   */
  async verify(payload, requirements) {
    return this._verify(payload, requirements);
  }
  /**
   * Settles a payment by executing the transfer (V1).
   *
   * @param payload - The payment payload to settle
   * @param requirements - The payment requirements
   * @param context - Optional facilitator context for extension capabilities
   * @returns Promise resolving to settlement response
   */
  async settle(payload, requirements, context) {
    const payloadV1 = payload;
    const exactEvmPayload = payload.payload;
    const valid = await this._verify(payload, requirements, {
      simulate: this.config.simulateInSettle ?? false
    });
    if (!valid.isValid) {
      return {
        success: false,
        network: payloadV1.network,
        transaction: "",
        errorReason: valid.invalidReason ?? ErrInvalidScheme,
        payer: exactEvmPayload.authorization.from
      };
    }
    try {
      const { address: factoryAddress, data: factoryCalldata } = (0, import_viem10.parseErc6492Signature)(
        exactEvmPayload.signature
      );
      if (factoryAddress && factoryCalldata && !(0, import_viem10.isAddressEqual)(factoryAddress, "0x0000000000000000000000000000000000000000")) {
        const payerAddress = exactEvmPayload.authorization.from;
        const bytecode = await this.signer.getCode({ address: payerAddress });
        if (!bytecode || bytecode === "0x") {
          const normalizedFactory = factoryAddress.toLowerCase();
          const isAllowed = (this.config.eip6492AllowedFactories ?? []).some(
            (allowed) => allowed.toLowerCase() === normalizedFactory
          );
          if (!isAllowed) {
            return {
              success: false,
              errorReason: ErrFactoryNotAllowed,
              transaction: "",
              network: payloadV1.network,
              payer: exactEvmPayload.authorization.from
            };
          }
          const deployTx = await this.signer.sendTransaction({
            to: factoryAddress,
            data: factoryCalldata
          });
          const deployReceipt = await this.signer.waitForTransactionReceipt({ hash: deployTx });
          if (deployReceipt.status !== "success") {
            return {
              success: false,
              errorReason: ErrSmartWalletDeploymentFailed,
              transaction: "",
              network: payloadV1.network,
              payer: exactEvmPayload.authorization.from
            };
          }
        }
      }
      const dataSuffix = await resolveDataSuffix(context, {
        paymentPayload: payload,
        paymentRequirements: requirements
      });
      const tx = await executeTransferWithAuthorization(
        this.signer,
        (0, import_viem10.getAddress)(requirements.asset),
        exactEvmPayload,
        dataSuffix
      );
      const receipt = await this.signer.waitForTransactionReceipt({ hash: tx });
      if (receipt.status !== "success") {
        return {
          success: false,
          errorReason: ErrTransactionFailed,
          transaction: tx,
          network: payloadV1.network,
          payer: exactEvmPayload.authorization.from
        };
      }
      const auth = exactEvmPayload.authorization;
      if (receipt.logs != null && !verifyEip3009TransferEvent(receipt.logs, (0, import_viem10.getAddress)(requirements.asset), {
        from: (0, import_viem10.getAddress)(auth.from),
        to: (0, import_viem10.getAddress)(auth.to),
        value: BigInt(auth.value)
      })) {
        return {
          success: false,
          errorReason: ErrTransferEventMismatch,
          transaction: tx,
          network: payloadV1.network,
          payer: auth.from
        };
      }
      return {
        success: true,
        transaction: tx,
        network: payloadV1.network,
        payer: exactEvmPayload.authorization.from
      };
    } catch (error) {
      return {
        success: false,
        errorReason: error instanceof Error ? error.message : ErrTransactionFailed,
        transaction: "",
        network: payloadV1.network,
        payer: exactEvmPayload.authorization.from
      };
    }
  }
  /**
   * Internal verify with optional simulation control.
   *
   * @param payload - The payment payload to verify
   * @param requirements - The payment requirements
   * @param options - Verification options (e.g. simulate)
   * @returns Promise resolving to verification response
   */
  async _verify(payload, requirements, options) {
    const requirementsV1 = requirements;
    const payloadV1 = payload;
    const exactEvmPayload = payload.payload;
    const payer = exactEvmPayload.authorization.from;
    let eip6492Deployment;
    if (payloadV1.scheme !== "exact" || requirements.scheme !== "exact") {
      return {
        isValid: false,
        invalidReason: ErrInvalidScheme,
        payer
      };
    }
    let chainId;
    try {
      chainId = getEvmChainIdV1(payloadV1.network);
    } catch {
      return {
        isValid: false,
        invalidReason: ErrNetworkMismatch,
        payer
      };
    }
    if (!requirements.extra?.name || !requirements.extra?.version) {
      return {
        isValid: false,
        invalidReason: ErrMissingEip712Domain,
        payer
      };
    }
    const { name, version } = requirements.extra;
    const erc20Address = (0, import_viem10.getAddress)(requirements.asset);
    if (payloadV1.network !== requirements.network) {
      return {
        isValid: false,
        invalidReason: ErrNetworkMismatch,
        payer
      };
    }
    const permitTypedData = {
      types: authorizationTypes,
      primaryType: "TransferWithAuthorization",
      domain: {
        name,
        version,
        chainId,
        verifyingContract: erc20Address
      },
      message: {
        from: exactEvmPayload.authorization.from,
        to: exactEvmPayload.authorization.to,
        value: BigInt(exactEvmPayload.authorization.value),
        validAfter: BigInt(exactEvmPayload.authorization.validAfter),
        validBefore: BigInt(exactEvmPayload.authorization.validBefore),
        nonce: exactEvmPayload.authorization.nonce
      }
    };
    const signature = exactEvmPayload.signature;
    const {
      isCounterfactual,
      innerSignature,
      eip6492Deployment: classification6492
    } = await classifyErc6492Payer(this.signer, signature, payer);
    if (classification6492) {
      eip6492Deployment = classification6492;
    }
    if (isCounterfactual) {
      const factory = classification6492?.factoryAddress;
      const factoryAllowed = !!factory && this.config.eip6492AllowedFactories.some(
        (a) => a.trim().toLowerCase() === factory.toLowerCase()
      );
      if (!factoryAllowed) {
        return {
          isValid: false,
          invalidReason: ErrFactoryNotAllowed,
          payer
        };
      }
    }
    if (!isCounterfactual) {
      const isValid = await verifyTypedDataSignature(this.signer, {
        address: payer,
        ...permitTypedData,
        signature: innerSignature
      });
      if (!isValid) {
        return {
          isValid: false,
          invalidReason: ErrInvalidSignature,
          payer
        };
      }
    }
    if ((0, import_viem10.getAddress)(exactEvmPayload.authorization.to) !== (0, import_viem10.getAddress)(requirements.payTo)) {
      return {
        isValid: false,
        invalidReason: ErrRecipientMismatch,
        payer
      };
    }
    const now = Math.floor(Date.now() / 1e3);
    if (BigInt(exactEvmPayload.authorization.validBefore) < BigInt(now + 6)) {
      return {
        isValid: false,
        invalidReason: ErrValidBeforeExpired,
        payer
      };
    }
    if (BigInt(exactEvmPayload.authorization.validAfter) > BigInt(now)) {
      return {
        isValid: false,
        invalidReason: ErrValidAfterInFuture,
        payer
      };
    }
    if (BigInt(exactEvmPayload.authorization.value) !== BigInt(requirementsV1.maxAmountRequired)) {
      return {
        isValid: false,
        invalidReason: ErrInvalidAuthorizationValue,
        payer
      };
    }
    if (options?.simulate !== false) {
      const simulationSucceeded = await simulateEip3009Transfer(
        this.signer,
        erc20Address,
        exactEvmPayload,
        eip6492Deployment
      );
      if (!simulationSucceeded) {
        return diagnoseEip3009SimulationFailure(
          this.signer,
          erc20Address,
          exactEvmPayload,
          requirements,
          requirementsV1.maxAmountRequired
        );
      }
    }
    return {
      isValid: true,
      invalidReason: void 0,
      payer
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExactEvmSchemeV1
});
//# sourceMappingURL=index.js.map