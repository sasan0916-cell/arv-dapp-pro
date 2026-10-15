import {
  ErrEip2612AssetMismatch,
  ErrEip2612DeadlineExpired,
  ErrEip2612FromMismatch,
  ErrEip2612SpenderNotPermit2,
  ErrErc20ApprovalAssetMismatch,
  ErrErc20ApprovalBroadcastFailed,
  ErrErc20ApprovalFromMismatch,
  ErrErc20ApprovalInvalidFormat,
  ErrErc20ApprovalSpenderNotPermit2,
  ErrErc20ApprovalTxFailed,
  ErrErc20ApprovalTxInvalidCalldata,
  ErrErc20ApprovalTxInvalidSignature,
  ErrErc20ApprovalTxParseFailed,
  ErrErc20ApprovalTxSignerMismatch,
  ErrErc20ApprovalTxWrongSelector,
  ErrErc20ApprovalTxWrongSpender,
  ErrErc20ApprovalTxWrongTarget,
  ErrInvalidEip2612ExtensionFormat,
  ErrPermit2612AmountMismatch,
  ErrPermit2AllowanceRequired,
  ErrPermit2InsufficientBalance,
  ErrPermit2InvalidAmount,
  ErrPermit2InvalidDestination,
  ErrPermit2InvalidNonce,
  ErrPermit2InvalidOwner,
  ErrPermit2InvalidSignature,
  ErrPermit2PaymentTooEarly,
  ErrPermit2ProxyNotDeployed,
  ErrPermit2SimulationFailed,
  ErrTransactionFailed
} from "./chunk-VEDHRFNU.mjs";
import {
  validateEip2612GasSponsoringInfo,
  validateErc20ApprovalGasSponsoringInfo
} from "./chunk-X4BYNI7R.mjs";
import {
  multicall
} from "./chunk-VS3RYAYE.mjs";
import {
  createPermit2Nonce,
  getEvmChainId,
  truncateErrorMessage
} from "./chunk-EKCH75YB.mjs";
import {
  PERMIT2_ADDRESS,
  eip3009ABI,
  erc20AllowanceAbi,
  erc20ApproveAbi,
  permit2WitnessTypes
} from "./chunk-GPMYUGHX.mjs";

// src/shared/permit2.ts
import { getAddress as getAddress2, encodeFunctionData, parseErc6492Signature } from "viem";

// src/shared/erc20approval.ts
import {
  getAddress,
  parseTransaction,
  decodeFunctionData,
  recoverTransactionAddress
} from "viem";
var APPROVE_SELECTOR = "0x095ea7b3";
async function validateErc20ApprovalForPayment(info, payer, tokenAddress) {
  if (!validateErc20ApprovalGasSponsoringInfo(info)) {
    return {
      isValid: false,
      invalidReason: ErrErc20ApprovalInvalidFormat,
      invalidMessage: "ERC-20 approval extension info failed schema validation"
    };
  }
  if (getAddress(info.from) !== getAddress(payer)) {
    return {
      isValid: false,
      invalidReason: ErrErc20ApprovalFromMismatch,
      invalidMessage: `Expected from=${payer}, got ${info.from}`
    };
  }
  if (getAddress(info.asset) !== tokenAddress) {
    return {
      isValid: false,
      invalidReason: ErrErc20ApprovalAssetMismatch,
      invalidMessage: `Expected asset=${tokenAddress}, got ${info.asset}`
    };
  }
  if (getAddress(info.spender) !== getAddress(PERMIT2_ADDRESS)) {
    return {
      isValid: false,
      invalidReason: ErrErc20ApprovalSpenderNotPermit2,
      invalidMessage: `Expected spender=${PERMIT2_ADDRESS}, got ${info.spender}`
    };
  }
  try {
    const serializedTx = info.signedTransaction;
    const tx = parseTransaction(serializedTx);
    if (!tx.to || getAddress(tx.to) !== tokenAddress) {
      return {
        isValid: false,
        invalidReason: ErrErc20ApprovalTxWrongTarget,
        invalidMessage: `Transaction targets ${tx.to ?? "null"}, expected ${tokenAddress}`
      };
    }
    const data = tx.data ?? "0x";
    if (!data.startsWith(APPROVE_SELECTOR)) {
      return {
        isValid: false,
        invalidReason: ErrErc20ApprovalTxWrongSelector,
        invalidMessage: `Transaction calldata does not start with approve() selector ${APPROVE_SELECTOR}`
      };
    }
    try {
      const decoded = decodeFunctionData({
        abi: erc20ApproveAbi,
        data
      });
      const calldataSpender = getAddress(decoded.args[0]);
      if (calldataSpender !== getAddress(PERMIT2_ADDRESS)) {
        return {
          isValid: false,
          invalidReason: ErrErc20ApprovalTxWrongSpender,
          invalidMessage: `approve() spender is ${calldataSpender}, expected Permit2 ${PERMIT2_ADDRESS}`
        };
      }
    } catch {
      return {
        isValid: false,
        invalidReason: ErrErc20ApprovalTxInvalidCalldata,
        invalidMessage: "Failed to decode approve() calldata from the signed transaction"
      };
    }
    try {
      const recoveredAddress = await recoverTransactionAddress({
        serializedTransaction: serializedTx
      });
      if (getAddress(recoveredAddress) !== getAddress(payer)) {
        return {
          isValid: false,
          invalidReason: ErrErc20ApprovalTxSignerMismatch,
          invalidMessage: `Transaction signed by ${recoveredAddress}, expected payer ${payer}`
        };
      }
    } catch {
      return {
        isValid: false,
        invalidReason: ErrErc20ApprovalTxInvalidSignature,
        invalidMessage: "Failed to recover signer from the signed transaction"
      };
    }
  } catch {
    return {
      isValid: false,
      invalidReason: ErrErc20ApprovalTxParseFailed,
      invalidMessage: "Failed to parse the signed transaction"
    };
  }
  return { isValid: true };
}

// src/upto/facilitator/errors.ts
var ErrUptoTransactionFailed = "invalid_upto_evm_transaction_failed";
var ErrUptoInvalidScheme = "invalid_upto_evm_scheme";
var ErrUptoNetworkMismatch = "invalid_upto_evm_network_mismatch";
var ErrUptoSettlementExceedsAmount = "invalid_upto_evm_payload_settlement_exceeds_amount";
var ErrUptoAmountExceedsPermitted = "upto_amount_exceeds_permitted";
var ErrUptoUnauthorizedFacilitator = "upto_unauthorized_facilitator";
var ErrUptoFacilitatorMismatch = "upto_facilitator_mismatch";

// src/shared/permit2.ts
function mapSettleError(error, payload, payer) {
  let errorReason = ErrTransactionFailed;
  if (error instanceof Error) {
    const message = error.message;
    if (message.includes("Permit2612AmountMismatch")) {
      errorReason = ErrPermit2612AmountMismatch;
    } else if (message.includes("InvalidAmount")) {
      errorReason = ErrPermit2InvalidAmount;
    } else if (message.includes("InvalidDestination")) {
      errorReason = ErrPermit2InvalidDestination;
    } else if (message.includes("InvalidOwner")) {
      errorReason = ErrPermit2InvalidOwner;
    } else if (message.includes("PaymentTooEarly")) {
      errorReason = ErrPermit2PaymentTooEarly;
    } else if (message.includes("InvalidSignature") || message.includes("SignatureExpired")) {
      errorReason = ErrPermit2InvalidSignature;
    } else if (message.includes("InvalidNonce")) {
      errorReason = ErrPermit2InvalidNonce;
    } else if (message.includes(ErrErc20ApprovalTxFailed)) {
      errorReason = ErrErc20ApprovalBroadcastFailed;
    } else if (message.includes("AmountExceedsPermitted")) {
      errorReason = ErrUptoAmountExceedsPermitted;
    } else if (message.includes("UnauthorizedFacilitator")) {
      errorReason = ErrUptoUnauthorizedFacilitator;
    } else {
      errorReason = `${ErrTransactionFailed}: ${truncateErrorMessage(message)}`;
    }
  }
  return {
    success: false,
    errorReason,
    transaction: "",
    network: payload.accepted.network,
    payer
  };
}
function validateEip2612PermitForPayment(info, payer, tokenAddress) {
  if (!validateEip2612GasSponsoringInfo(info)) {
    return { isValid: false, invalidReason: ErrInvalidEip2612ExtensionFormat };
  }
  if (getAddress2(info.from) !== getAddress2(payer)) {
    return { isValid: false, invalidReason: ErrEip2612FromMismatch };
  }
  if (getAddress2(info.asset) !== tokenAddress) {
    return { isValid: false, invalidReason: ErrEip2612AssetMismatch };
  }
  if (getAddress2(info.spender) !== getAddress2(PERMIT2_ADDRESS)) {
    return { isValid: false, invalidReason: ErrEip2612SpenderNotPermit2 };
  }
  const now = Math.floor(Date.now() / 1e3);
  if (BigInt(info.deadline) < BigInt(now + 6)) {
    return { isValid: false, invalidReason: ErrEip2612DeadlineExpired };
  }
  return { isValid: true };
}
async function simulatePermit2Settle(config, signer, settleArgs) {
  try {
    await signer.readContract({
      address: config.proxyAddress,
      abi: config.proxyABI,
      functionName: "settle",
      args: settleArgs
    });
    return true;
  } catch {
    return false;
  }
}
async function simulatePermit2SettleWithPermit(config, signer, settleArgs, eip2612Info) {
  try {
    const { v, r, s } = splitEip2612Signature(eip2612Info.signature);
    await signer.readContract({
      address: config.proxyAddress,
      abi: config.proxyABI,
      functionName: "settleWithPermit",
      args: [
        {
          value: BigInt(eip2612Info.amount),
          deadline: BigInt(eip2612Info.deadline),
          r,
          s,
          v
        },
        ...settleArgs
      ]
    });
    return true;
  } catch {
    return false;
  }
}
async function simulatePermit2SettleWithErc20Approval(config, extensionSigner, settleArgs, erc20Info) {
  if (!extensionSigner.simulateTransactions) {
    return false;
  }
  try {
    const settleData = encodeFunctionData({
      abi: config.proxyABI,
      functionName: "settle",
      args: settleArgs
    });
    return await extensionSigner.simulateTransactions([
      erc20Info.signedTransaction,
      { to: config.proxyAddress, data: settleData, gas: BigInt(3e5) }
    ]);
  } catch {
    return false;
  }
}
async function diagnosePermit2SimulationFailure(config, signer, tokenAddress, permit2Payload, amountRequired) {
  const payer = permit2Payload.permit2Authorization.from;
  const diagnosticCalls = [
    {
      address: config.proxyAddress,
      abi: config.proxyABI,
      functionName: "PERMIT2"
    },
    {
      address: tokenAddress,
      abi: eip3009ABI,
      functionName: "balanceOf",
      args: [payer]
    },
    {
      address: tokenAddress,
      abi: erc20AllowanceAbi,
      functionName: "allowance",
      args: [payer, PERMIT2_ADDRESS]
    }
  ];
  try {
    const results = await multicall(signer.readContract.bind(signer), diagnosticCalls);
    const [proxyResult, balanceResult, allowanceResult] = results;
    if (proxyResult.status === "failure") {
      return { isValid: false, invalidReason: ErrPermit2ProxyNotDeployed, payer };
    }
    if (balanceResult.status === "success") {
      const balance = balanceResult.result;
      if (balance < BigInt(amountRequired)) {
        return { isValid: false, invalidReason: ErrPermit2InsufficientBalance, payer };
      }
    }
    if (allowanceResult.status === "success") {
      const allowance = allowanceResult.result;
      if (allowance < BigInt(amountRequired)) {
        return { isValid: false, invalidReason: ErrPermit2AllowanceRequired, payer };
      }
    }
  } catch {
  }
  return { isValid: false, invalidReason: ErrPermit2SimulationFailed, payer };
}
async function checkPermit2Prerequisites(config, signer, tokenAddress, payer, amountRequired) {
  const diagnosticCalls = [
    {
      address: config.proxyAddress,
      abi: config.proxyABI,
      functionName: "PERMIT2"
    },
    {
      address: tokenAddress,
      abi: eip3009ABI,
      functionName: "balanceOf",
      args: [payer]
    }
  ];
  try {
    const results = await multicall(signer.readContract.bind(signer), diagnosticCalls);
    const [proxyResult, balanceResult] = results;
    if (proxyResult.status === "failure") {
      return { isValid: false, invalidReason: ErrPermit2ProxyNotDeployed, payer };
    }
    if (balanceResult.status === "success") {
      const balance = balanceResult.result;
      if (balance < BigInt(amountRequired)) {
        return { isValid: false, invalidReason: ErrPermit2InsufficientBalance, payer };
      }
    }
  } catch {
  }
  return { isValid: true, invalidReason: void 0, payer };
}
function buildExactPermit2SettleArgs(permit2Payload) {
  const { signature } = parseErc6492Signature(permit2Payload.signature);
  return [
    {
      permitted: {
        token: getAddress2(permit2Payload.permit2Authorization.permitted.token),
        amount: BigInt(permit2Payload.permit2Authorization.permitted.amount)
      },
      nonce: BigInt(permit2Payload.permit2Authorization.nonce),
      deadline: BigInt(permit2Payload.permit2Authorization.deadline)
    },
    getAddress2(permit2Payload.permit2Authorization.from),
    {
      to: getAddress2(permit2Payload.permit2Authorization.witness.to),
      validAfter: BigInt(permit2Payload.permit2Authorization.witness.validAfter)
    },
    signature
  ];
}
function buildUptoPermit2SettleArgs(permit2Payload, settlementAmount, facilitatorAddress) {
  const { signature } = parseErc6492Signature(permit2Payload.signature);
  return [
    {
      permitted: {
        token: getAddress2(permit2Payload.permit2Authorization.permitted.token),
        amount: BigInt(permit2Payload.permit2Authorization.permitted.amount)
      },
      nonce: BigInt(permit2Payload.permit2Authorization.nonce),
      deadline: BigInt(permit2Payload.permit2Authorization.deadline)
    },
    settlementAmount,
    getAddress2(permit2Payload.permit2Authorization.from),
    {
      to: getAddress2(permit2Payload.permit2Authorization.witness.to),
      facilitator: getAddress2(facilitatorAddress),
      validAfter: BigInt(permit2Payload.permit2Authorization.witness.validAfter)
    },
    signature
  ];
}
function splitEip2612Signature(signature) {
  const sig = signature.startsWith("0x") ? signature.slice(2) : signature;
  if (sig.length !== 130) {
    throw new Error(
      `invalid EIP-2612 signature length: expected 65 bytes (130 hex chars), got ${sig.length / 2} bytes`
    );
  }
  const r = `0x${sig.slice(0, 64)}`;
  const s = `0x${sig.slice(64, 128)}`;
  const v = parseInt(sig.slice(128, 130), 16);
  return { v, r, s };
}
async function createPermit2PayloadForProxy(proxyAddress, signer, x402Version, paymentRequirements) {
  const now = Math.floor(Date.now() / 1e3);
  const nonce = createPermit2Nonce();
  const validAfter = "0";
  const deadline = (now + paymentRequirements.maxTimeoutSeconds).toString();
  const permit2Authorization = {
    from: signer.address,
    permitted: {
      token: getAddress2(paymentRequirements.asset),
      amount: paymentRequirements.amount
    },
    spender: proxyAddress,
    nonce,
    deadline,
    witness: {
      to: getAddress2(paymentRequirements.payTo),
      validAfter
    }
  };
  const signature = await signPermit2Authorization(
    signer,
    permit2Authorization,
    paymentRequirements
  );
  return {
    x402Version,
    payload: { signature, permit2Authorization }
  };
}
async function signPermit2Authorization(signer, permit2Authorization, requirements) {
  const chainId = getEvmChainId(requirements.network);
  return await signer.signTypedData({
    domain: { name: "Permit2", chainId, verifyingContract: PERMIT2_ADDRESS },
    types: permit2WitnessTypes,
    primaryType: "PermitWitnessTransferFrom",
    message: {
      permitted: {
        token: getAddress2(permit2Authorization.permitted.token),
        amount: BigInt(permit2Authorization.permitted.amount)
      },
      spender: getAddress2(permit2Authorization.spender),
      nonce: BigInt(permit2Authorization.nonce),
      deadline: BigInt(permit2Authorization.deadline),
      witness: {
        to: getAddress2(permit2Authorization.witness.to),
        validAfter: BigInt(permit2Authorization.witness.validAfter)
      }
    }
  });
}

export {
  validateErc20ApprovalForPayment,
  ErrUptoTransactionFailed,
  ErrUptoInvalidScheme,
  ErrUptoNetworkMismatch,
  ErrUptoSettlementExceedsAmount,
  ErrUptoFacilitatorMismatch,
  mapSettleError,
  validateEip2612PermitForPayment,
  simulatePermit2Settle,
  simulatePermit2SettleWithPermit,
  simulatePermit2SettleWithErc20Approval,
  diagnosePermit2SimulationFailure,
  checkPermit2Prerequisites,
  buildExactPermit2SettleArgs,
  buildUptoPermit2SettleArgs,
  splitEip2612Signature,
  createPermit2PayloadForProxy
};
//# sourceMappingURL=chunk-XP6HEYCL.mjs.map