import {
  batchSettlementABI
} from "./chunk-H25OEB2U.mjs";
import {
  BATCH_SETTLEMENT_ADDRESS,
  ErrChannelIdMismatch,
  ErrReceiverAuthorizerMismatch,
  ErrReceiverMismatch,
  ErrRpcReadFailed,
  ErrTokenMismatch,
  ErrValidAfterInFuture,
  ErrValidBeforeExpired,
  ErrWithdrawDelayMismatch,
  ErrWithdrawDelayOutOfRange,
  MAX_WITHDRAW_DELAY,
  MIN_WITHDRAW_DELAY,
  claimBatchTypes,
  computeChannelId,
  getBatchSettlementEip712Domain,
  refundTypes,
  voucherTypes
} from "./chunk-5XX3PMSD.mjs";
import {
  verifyTypedDataSignature
} from "./chunk-BEMCJZKA.mjs";
import {
  multicall
} from "./chunk-VS3RYAYE.mjs";
import {
  getEvmChainId
} from "./chunk-EKCH75YB.mjs";

// src/batch-settlement/authorizerSigner.ts
async function signClaimBatch(signer, claims, network) {
  const chainId = getEvmChainId(network);
  const claimEntries = claims.map((c) => ({
    channelId: computeChannelId(c.voucher.channel, chainId),
    maxClaimableAmount: BigInt(c.voucher.maxClaimableAmount),
    totalClaimed: BigInt(c.totalClaimed)
  }));
  return signer.signTypedData({
    domain: getBatchSettlementEip712Domain(chainId),
    types: claimBatchTypes,
    primaryType: "ClaimBatch",
    message: {
      claims: claimEntries
    }
  });
}
async function signRefund(signer, channelId, amount, nonce, network) {
  const chainId = getEvmChainId(network);
  return signer.signTypedData({
    domain: getBatchSettlementEip712Domain(chainId),
    types: refundTypes,
    primaryType: "Refund",
    message: {
      channelId,
      nonce: BigInt(nonce),
      amount: BigInt(amount)
    }
  });
}

// src/batch-settlement/facilitator/utils.ts
import { getAddress, hashTypedData, recoverAddress, isAddressEqual } from "viem";
function toContractChannelConfig(config) {
  return {
    payer: getAddress(config.payer),
    payerAuthorizer: getAddress(config.payerAuthorizer),
    receiver: getAddress(config.receiver),
    receiverAuthorizer: getAddress(config.receiverAuthorizer),
    token: getAddress(config.token),
    withdrawDelay: config.withdrawDelay,
    salt: config.salt
  };
}
function erc3009AuthorizationTimeInvalidReason(validAfter, validBefore) {
  const now = Math.floor(Date.now() / 1e3);
  if (validBefore < BigInt(now + 6)) return ErrValidBeforeExpired;
  if (validAfter > BigInt(now)) return ErrValidAfterInFuture;
  return void 0;
}
async function verifyBatchSettlementVoucherTypedData(signer, params, chainId) {
  const domain = getBatchSettlementEip712Domain(chainId);
  const message = {
    channelId: params.channelId,
    maxClaimableAmount: BigInt(params.maxClaimableAmount)
  };
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  if (params.payerAuthorizer !== zeroAddress) {
    try {
      const digest = hashTypedData({
        domain,
        types: voucherTypes,
        primaryType: "Voucher",
        message
      });
      const recovered = await recoverAddress({
        hash: digest,
        signature: params.signature
      });
      return isAddressEqual(recovered, getAddress(params.payerAuthorizer));
    } catch {
      return false;
    }
  }
  return verifyTypedDataSignature(signer, {
    address: getAddress(params.payer),
    domain,
    types: voucherTypes,
    primaryType: "Voucher",
    message,
    signature: params.signature
  });
}
function validateChannelConfig(config, channelId, requirements) {
  const computedId = computeChannelId(config, requirements.network);
  if (computedId.toLowerCase() !== channelId.toLowerCase()) {
    return ErrChannelIdMismatch;
  }
  if (getAddress(config.receiver) !== getAddress(requirements.payTo)) {
    return ErrReceiverMismatch;
  }
  const extra = requirements.extra;
  const requiredReceiverAuthorizer = extra?.receiverAuthorizer;
  if (!requiredReceiverAuthorizer || getAddress(requiredReceiverAuthorizer) === "0x0000000000000000000000000000000000000000" || getAddress(config.receiverAuthorizer) !== getAddress(requiredReceiverAuthorizer)) {
    return ErrReceiverAuthorizerMismatch;
  }
  if (getAddress(config.token) !== getAddress(requirements.asset)) {
    return ErrTokenMismatch;
  }
  if (extra?.withdrawDelay !== void 0 && config.withdrawDelay !== Number(extra.withdrawDelay)) {
    return ErrWithdrawDelayMismatch;
  }
  if (config.withdrawDelay < MIN_WITHDRAW_DELAY || config.withdrawDelay > MAX_WITHDRAW_DELAY) {
    return ErrWithdrawDelayOutOfRange;
  }
  return void 0;
}
async function readChannelState(signer, channelId) {
  const target = getAddress(BATCH_SETTLEMENT_ADDRESS);
  const mcResults = await multicall(signer.readContract.bind(signer), [
    { address: target, abi: batchSettlementABI, functionName: "channels", args: [channelId] },
    {
      address: target,
      abi: batchSettlementABI,
      functionName: "pendingWithdrawals",
      args: [channelId]
    },
    { address: target, abi: batchSettlementABI, functionName: "refundNonce", args: [channelId] }
  ]);
  const [chRes, wdRes, rnRes] = mcResults;
  if (chRes.status === "failure" || wdRes.status === "failure" || rnRes.status === "failure") {
    throw new Error(`${ErrRpcReadFailed}: multicall returned failure for ${channelId}`);
  }
  const [balance, totalClaimed] = chRes.result;
  const [, wdInitiatedAt] = wdRes.result;
  const refundNonce = rnRes.result;
  return { balance, totalClaimed, withdrawRequestedAt: Number(wdInitiatedAt), refundNonce };
}

export {
  signClaimBatch,
  signRefund,
  toContractChannelConfig,
  erc3009AuthorizationTimeInvalidReason,
  verifyBatchSettlementVoucherTypedData,
  validateChannelConfig,
  readChannelState
};
//# sourceMappingURL=chunk-FMDED53H.mjs.map