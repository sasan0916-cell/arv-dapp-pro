import {
  AUTH_CAPTURE_ESCROW_ADDRESS,
  AUTH_CAPTURE_ESCROW_V1_0_ADDRESS,
  AUTH_CAPTURE_ESCROW_V1_1_ADDRESS,
  AUTH_CAPTURE_SCHEME,
  AuthCaptureEvmScheme,
  EIP3009_TOKEN_COLLECTOR_ADDRESS,
  EIP3009_TOKEN_COLLECTOR_V1_0_ADDRESS,
  OPERATOR_REFUND_COLLECTOR_ADDRESS,
  PERMIT2_TOKEN_COLLECTOR_ADDRESS,
  resolveAuthCaptureDeployment
} from "./chunk-KPBDMMIU.mjs";
import {
  BatchSettlementEvmScheme
} from "./chunk-QJHO4KEV.mjs";
import "./chunk-W6ON4LG2.mjs";
import "./chunk-H25OEB2U.mjs";
import {
  BATCH_SETTLEMENT_ADDRESS,
  BATCH_SETTLEMENT_DOMAIN,
  BATCH_SETTLEMENT_SCHEME,
  ERC3009_DEPOSIT_COLLECTOR_ADDRESS,
  claimBatchTypes,
  refundTypes,
  voucherTypes
} from "./chunk-5XX3PMSD.mjs";
import {
  ExactEvmScheme
} from "./chunk-DLPUE5VK.mjs";
import {
  DEFAULT_ASSET_CONTRACT_CACHE_TTL_MS,
  isEIP3009Payload,
  isPermit2Payload,
  isUptoPermit2Payload,
  resetAssetContractCache,
  startAssetContractCheck,
  validateAssetIsContract
} from "./chunk-BPTXPSEK.mjs";
import {
  isBatchSettlementClaimPayload,
  isBatchSettlementDepositPayload,
  isBatchSettlementEnrichedRefundPayload,
  isBatchSettlementRefundPayload,
  isBatchSettlementSettlePayload,
  isBatchSettlementVoucherPayload
} from "./chunk-U4HCGTLU.mjs";
import "./chunk-DBLZWTJ6.mjs";
import {
  classifyErc6492Payer,
  verifyHashSignature,
  verifyHashSignatureWithCode,
  verifyTypedDataSignature
} from "./chunk-BEMCJZKA.mjs";
import {
  UptoEvmScheme
} from "./chunk-3LEU2NZ6.mjs";
import {
  createPermit2ApprovalTx,
  getPermit2AllowanceReadParams
} from "./chunk-OR6TZGCV.mjs";
import "./chunk-XP6HEYCL.mjs";
import "./chunk-VEDHRFNU.mjs";
import {
  BUILDER_CODE_KEY,
  appendDataSuffix,
  resolveDataSuffix
} from "./chunk-X4BYNI7R.mjs";
import "./chunk-VS3RYAYE.mjs";
import "./chunk-EKCH75YB.mjs";
import {
  DEFAULT_ASSETS,
  findDefaultAsset,
  getDefaultAsset
} from "./chunk-LQQ3M4DU.mjs";
import {
  PERMIT2_ADDRESS,
  authorizationTypes,
  eip3009ABI,
  erc20AllowanceAbi,
  permit2WitnessTypes,
  uptoPermit2WitnessTypes,
  x402ExactPermit2ProxyABI,
  x402ExactPermit2ProxyAddress,
  x402UptoPermit2ProxyABI,
  x402UptoPermit2ProxyAddress
} from "./chunk-GPMYUGHX.mjs";

// src/signer.ts
function toClientEvmSigner(signer, publicClient) {
  const readContract = signer.readContract ?? publicClient?.readContract.bind(publicClient);
  const result = {
    address: signer.address,
    signTypedData: (msg) => signer.signTypedData(msg)
  };
  if (readContract) {
    result.readContract = readContract;
  }
  const signTransaction = signer.signTransaction;
  if (signTransaction) {
    result.signTransaction = (args) => signTransaction(args);
  }
  const getTransactionCount = signer.getTransactionCount ?? publicClient?.getTransactionCount?.bind(publicClient);
  if (getTransactionCount) {
    result.getTransactionCount = (args) => getTransactionCount(args);
  }
  const estimateFeesPerGas = signer.estimateFeesPerGas ?? publicClient?.estimateFeesPerGas?.bind(publicClient);
  if (estimateFeesPerGas) {
    result.estimateFeesPerGas = () => estimateFeesPerGas();
  }
  return result;
}
var DEFAULT_CONFIRMATION_TIMEOUT_MS = 18e4;
function toFacilitatorEvmSigner(client, {
  confirmationTimeoutMs = DEFAULT_CONFIRMATION_TIMEOUT_MS
} = {}) {
  return {
    ...client,
    getAddresses: () => [client.address],
    waitForTransactionReceipt: (args) => client.waitForTransactionReceipt({ ...args, timeout: confirmationTimeoutMs })
  };
}

// src/shared/erc7702.ts
var ERC7702_PREFIX = "0xef0100";
var ERC7702_BYTECODE_LENGTH = 48;
function isERC7702Delegation(bytecode) {
  if (!bytecode || bytecode === "0x") return false;
  if (bytecode.length !== ERC7702_BYTECODE_LENGTH) return false;
  return bytecode.toLowerCase().startsWith(ERC7702_PREFIX);
}
function getERC7702DelegateAddress(bytecode) {
  if (!isERC7702Delegation(bytecode)) return null;
  return "0x" + bytecode.slice(8).toLowerCase();
}

// src/auth-capture/types.ts
function isAuthCaptureExtra(value) {
  if (typeof value !== "object" || value === null) return false;
  const v = value;
  return typeof v.captureAuthorizer === "string" && typeof v.captureDeadline === "number" && typeof v.refundDeadline === "number" && typeof v.feeRecipient === "string" && typeof v.minFeeBps === "number" && typeof v.maxFeeBps === "number" && typeof v.name === "string" && typeof v.version === "string";
}
function isLifecyclePayload(value) {
  if (typeof value !== "object" || value === null) return false;
  const type = value.type;
  return type === "capture" || type === "void" || type === "refund";
}
function isCapturePayload(value) {
  if (!isLifecyclePayload(value) || value.type !== "capture") return false;
  const v = value;
  const hasFeeBps = typeof v.feeBps === "number";
  const hasFeeAmount = typeof v.feeAmount === "string";
  if (hasFeeBps === hasFeeAmount) return false;
  return isPaymentInfoStruct(v.paymentInfo) && typeof v.saltNonce === "string" && typeof v.amount === "string" && typeof v.feeReceiver === "string" && typeof v.expectedCapturableAmount === "string" && typeof v.expectedRefundableAmount === "string" && typeof v.authorizerSignature === "string" && (v.voidAuthorizerSignature === void 0 || typeof v.voidAuthorizerSignature === "string");
}
function isVoidPayload(value) {
  if (!isLifecyclePayload(value) || value.type !== "void") return false;
  const v = value;
  return isPaymentInfoStruct(v.paymentInfo) && typeof v.saltNonce === "string" && typeof v.authorizerSignature === "string" && v.voidAuthorizerSignature === void 0;
}
function isRefundPayload(value) {
  if (!isLifecyclePayload(value) || value.type !== "refund") return false;
  const v = value;
  return isPaymentInfoStruct(v.paymentInfo) && typeof v.saltNonce === "string" && typeof v.amount === "string" && typeof v.expectedCapturableAmount === "string" && typeof v.expectedRefundableAmount === "string" && typeof v.authorizerSignature === "string" && v.voidAuthorizerSignature === void 0;
}
function isPaymentInfoStruct(value) {
  if (typeof value !== "object" || value === null) return false;
  const v = value;
  return typeof v.operator === "string" && typeof v.payer === "string" && typeof v.receiver === "string" && typeof v.token === "string" && typeof v.maxAmount === "string" && typeof v.preApprovalExpiry === "number" && typeof v.authorizationExpiry === "number" && typeof v.refundExpiry === "number" && typeof v.minFeeBps === "number" && typeof v.maxFeeBps === "number" && typeof v.feeReceiver === "string" && typeof v.salt === "string";
}
function isHexString(value) {
  return typeof value === "string" && value.startsWith("0x");
}
function readChargeCompletion(v) {
  const hasAny = "amount" in v || "feeBps" in v || "feeAmount" in v || "feeReceiver" in v || "authorizerSignature" in v;
  if (!hasAny) return void 0;
  if (typeof v.amount === "string" && typeof v.feeBps === "number" && v.feeAmount === void 0 && typeof v.feeReceiver === "string" && typeof v.authorizerSignature === "string") {
    return {
      amount: v.amount,
      feeBps: v.feeBps,
      feeReceiver: v.feeReceiver,
      authorizerSignature: v.authorizerSignature
    };
  }
  if (typeof v.amount === "string" && typeof v.feeAmount === "string" && v.feeBps === void 0 && typeof v.feeReceiver === "string" && typeof v.authorizerSignature === "string") {
    return {
      amount: v.amount,
      feeAmount: v.feeAmount,
      feeReceiver: v.feeReceiver,
      authorizerSignature: v.authorizerSignature
    };
  }
  return void 0;
}
function collectExtras(v) {
  if (!isHexString(v.salt)) return void 0;
  if (v.saltNonce === void 0) {
    return { salt: v.salt };
  }
  if (!isHexString(v.saltNonce)) return void 0;
  return { salt: v.salt, saltNonce: v.saltNonce };
}
function isEip3009Payload(value) {
  if (typeof value !== "object" || value === null) return false;
  const v = value;
  if (v.type !== void 0) return false;
  if (typeof v.authorization !== "object" || v.authorization === null || typeof v.signature !== "string") {
    return false;
  }
  const saltFields = collectExtras(v);
  if (!saltFields) return false;
  const hasAnyCharge = "amount" in v || "feeBps" in v || "feeAmount" in v || "feeReceiver" in v || "authorizerSignature" in v;
  if (hasAnyCharge) {
    if (!saltFields.saltNonce) return false;
    return readChargeCompletion(v) !== void 0;
  }
  return true;
}
function isPermit2Payload2(value) {
  if (typeof value !== "object" || value === null) return false;
  const v = value;
  if (v.type !== void 0) return false;
  if (typeof v.signature !== "string") return false;
  if (typeof v.permit2Authorization !== "object" || v.permit2Authorization === null) return false;
  const a = v.permit2Authorization;
  if (typeof a.from !== "string" || typeof a.spender !== "string" || typeof a.nonce !== "string" || typeof a.deadline !== "string" || typeof a.permitted !== "object" || a.permitted === null) {
    return false;
  }
  const saltFields = collectExtras(v);
  if (!saltFields) return false;
  const hasAnyCharge = "amount" in v || "feeBps" in v || "feeAmount" in v || "feeReceiver" in v || "authorizerSignature" in v;
  if (hasAnyCharge) {
    if (!saltFields.saltNonce) return false;
    return readChargeCompletion(v) !== void 0;
  }
  return true;
}
function isAuthCaptureCollectPayload(value) {
  return isEip3009Payload(value) || isPermit2Payload2(value);
}
function isAuthCapturePayload(value) {
  if (isLifecyclePayload(value)) {
    return isCapturePayload(value) || isVoidPayload(value) || isRefundPayload(value);
  }
  return isAuthCaptureCollectPayload(value);
}
export {
  AUTH_CAPTURE_ESCROW_ADDRESS,
  AUTH_CAPTURE_ESCROW_V1_0_ADDRESS,
  AUTH_CAPTURE_ESCROW_V1_1_ADDRESS,
  AUTH_CAPTURE_SCHEME,
  AuthCaptureEvmScheme,
  BATCH_SETTLEMENT_ADDRESS,
  BATCH_SETTLEMENT_DOMAIN,
  BATCH_SETTLEMENT_SCHEME,
  BUILDER_CODE_KEY,
  BatchSettlementEvmScheme,
  DEFAULT_ASSETS,
  DEFAULT_ASSET_CONTRACT_CACHE_TTL_MS,
  EIP3009_TOKEN_COLLECTOR_ADDRESS,
  EIP3009_TOKEN_COLLECTOR_V1_0_ADDRESS,
  ERC3009_DEPOSIT_COLLECTOR_ADDRESS,
  ExactEvmScheme,
  OPERATOR_REFUND_COLLECTOR_ADDRESS,
  PERMIT2_ADDRESS,
  PERMIT2_TOKEN_COLLECTOR_ADDRESS,
  UptoEvmScheme,
  appendDataSuffix,
  authorizationTypes,
  claimBatchTypes,
  classifyErc6492Payer,
  createPermit2ApprovalTx,
  eip3009ABI,
  erc20AllowanceAbi,
  findDefaultAsset,
  getDefaultAsset,
  getERC7702DelegateAddress,
  getPermit2AllowanceReadParams,
  isAuthCaptureExtra,
  isAuthCapturePayload,
  isBatchSettlementClaimPayload,
  isBatchSettlementDepositPayload,
  isBatchSettlementEnrichedRefundPayload,
  isBatchSettlementRefundPayload,
  isBatchSettlementSettlePayload,
  isBatchSettlementVoucherPayload,
  isEIP3009Payload,
  isERC7702Delegation,
  isPermit2Payload,
  isUptoPermit2Payload,
  permit2WitnessTypes,
  refundTypes,
  resetAssetContractCache,
  resolveAuthCaptureDeployment,
  resolveDataSuffix,
  startAssetContractCheck,
  toClientEvmSigner,
  toFacilitatorEvmSigner,
  uptoPermit2WitnessTypes,
  validateAssetIsContract,
  verifyHashSignature,
  verifyHashSignatureWithCode,
  verifyTypedDataSignature,
  voucherTypes,
  x402ExactPermit2ProxyABI,
  x402ExactPermit2ProxyAddress,
  x402UptoPermit2ProxyABI,
  x402UptoPermit2ProxyAddress
};
//# sourceMappingURL=index.mjs.map