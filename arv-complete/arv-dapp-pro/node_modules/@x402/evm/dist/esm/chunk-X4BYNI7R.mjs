import {
  getEvmChainId
} from "./chunk-EKCH75YB.mjs";
import {
  DEFAULT_MAX_FEE_PER_GAS,
  DEFAULT_MAX_PRIORITY_FEE_PER_GAS,
  ERC20_APPROVE_GAS_LIMIT,
  PERMIT2_ADDRESS,
  eip2612NoncesAbi,
  eip2612PermitTypes,
  erc20AllowanceAbi,
  erc20ApproveAbi
} from "./chunk-GPMYUGHX.mjs";

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
function appendDataSuffix(calldata, suffix) {
  if (!suffix || suffix === "0x" || suffix.length <= 2) {
    return calldata;
  }
  const suffixHex = suffix.startsWith("0x") ? suffix.slice(2) : suffix;
  return `${calldata}${suffixHex}`;
}

// src/exact/extensions.ts
var EIP2612_GAS_SPONSORING_KEY = "eip2612GasSponsoring";
var ERC20_APPROVAL_GAS_SPONSORING_KEY = "erc20ApprovalGasSponsoring";
var ERC20_APPROVAL_GAS_SPONSORING_VERSION = "1";
function _extractInfo(payload, extensionKey) {
  const extensions = payload.extensions;
  if (!extensions) return null;
  const extension = extensions[extensionKey];
  if (!extension?.info) return null;
  return extension.info;
}
function extractEip2612GasSponsoringInfo(payload) {
  const info = _extractInfo(payload, EIP2612_GAS_SPONSORING_KEY);
  if (!info) return null;
  if (!info.from || !info.asset || !info.spender || !info.amount || !info.nonce || !info.deadline || !info.signature || !info.version) {
    return null;
  }
  return info;
}
function validateEip2612GasSponsoringInfo(info) {
  const addressPattern = /^0x[a-fA-F0-9]{40}$/;
  const numericPattern = /^[0-9]+$/;
  const hexPattern = /^0x[a-fA-F0-9]+$/;
  const versionPattern = /^[0-9]+(\.[0-9]+)*$/;
  return addressPattern.test(info.from) && addressPattern.test(info.asset) && addressPattern.test(info.spender) && numericPattern.test(info.amount) && numericPattern.test(info.nonce) && numericPattern.test(info.deadline) && hexPattern.test(info.signature) && versionPattern.test(info.version);
}
function extractErc20ApprovalGasSponsoringInfo(payload) {
  const info = _extractInfo(payload, ERC20_APPROVAL_GAS_SPONSORING_KEY);
  if (!info) return null;
  if (!info.from || !info.asset || !info.spender || !info.amount || !info.signedTransaction || !info.version) {
    return null;
  }
  return info;
}
function validateErc20ApprovalGasSponsoringInfo(info) {
  const addressPattern = /^0x[a-fA-F0-9]{40}$/;
  const numericPattern = /^[0-9]+$/;
  const hexPattern = /^0x[a-fA-F0-9]+$/;
  const versionPattern = /^[0-9]+(\.[0-9]+)*$/;
  return addressPattern.test(info.from) && addressPattern.test(info.asset) && addressPattern.test(info.spender) && numericPattern.test(info.amount) && hexPattern.test(info.signedTransaction) && versionPattern.test(info.version);
}
function resolveErc20ApprovalExtensionSigner(extension, network) {
  if (!extension) return void 0;
  return extension.signerForNetwork?.(network) ?? extension.signer;
}
function resolvePermit2ReceiptWaitSigner(signer, payload, context) {
  if (!context) return signer;
  const erc20Info = extractErc20ApprovalGasSponsoringInfo(payload);
  if (!erc20Info) return signer;
  const extension = context.getExtension(
    ERC20_APPROVAL_GAS_SPONSORING_KEY
  );
  return resolveErc20ApprovalExtensionSigner(extension, payload.accepted.network) ?? signer;
}

// src/shared/extensions/gasSponsoring.ts
import { getAddress as getAddress3 } from "viem";

// src/exact/client/eip2612.ts
import { getAddress } from "viem";
async function signEip2612Permit(signer, tokenAddress, tokenName, tokenVersion, chainId, deadline, permittedAmount) {
  const owner = signer.address;
  const spender = getAddress(PERMIT2_ADDRESS);
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
import { encodeFunctionData, getAddress as getAddress2, maxUint256 } from "viem";
async function signErc20ApprovalTransaction(signer, tokenAddress, chainId) {
  const from = signer.address;
  const spender = getAddress2(PERMIT2_ADDRESS);
  const data = encodeFunctionData({
    abi: erc20ApproveAbi,
    functionName: "approve",
    args: [spender, maxUint256]
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
    amount: maxUint256.toString(),
    signedTransaction,
    version: ERC20_APPROVAL_GAS_SPONSORING_VERSION
  };
}

// src/shared/rpc.ts
import { createPublicClient, http } from "viem";
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
  const client = createPublicClient({
    transport: http(rpcUrl)
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
  const tokenAddress = getAddress3(requirements.asset);
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
  const tokenAddress = getAddress3(requirements.asset);
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

export {
  ERC20_APPROVAL_GAS_SPONSORING_KEY,
  extractEip2612GasSponsoringInfo,
  validateEip2612GasSponsoringInfo,
  extractErc20ApprovalGasSponsoringInfo,
  validateErc20ApprovalGasSponsoringInfo,
  resolveErc20ApprovalExtensionSigner,
  resolvePermit2ReceiptWaitSigner,
  trySignEip2612PermitExtension,
  trySignErc20ApprovalExtension,
  BUILDER_CODE_KEY,
  resolveDataSuffix,
  appendDataSuffix
};
//# sourceMappingURL=chunk-X4BYNI7R.mjs.map