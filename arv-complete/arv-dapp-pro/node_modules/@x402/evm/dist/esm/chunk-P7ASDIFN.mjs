import {
  ErrInvalidTransactionState,
  ErrSettlementPending
} from "./chunk-VEDHRFNU.mjs";
import {
  invalidBroadcastHashResponse,
  isValidTxHash,
  truncateErrorMessage
} from "./chunk-EKCH75YB.mjs";

// src/shared/settleReceipt.ts
async function waitAndReturnSettleResponse(signer, tx, network, payer, options = {}) {
  const {
    failedStatusReason = ErrInvalidTransactionState,
    validateReceipt,
    amount,
    onSuccess
  } = options;
  if (!isValidTxHash(tx)) {
    return invalidBroadcastHashResponse(tx, failedStatusReason, network, payer);
  }
  let receipt;
  try {
    receipt = await signer.waitForTransactionReceipt({ hash: tx });
  } catch (error) {
    return settlementPendingResponse(tx, network, payer, error);
  }
  try {
    if (receipt.status !== "success") {
      return {
        success: false,
        errorReason: failedStatusReason,
        transaction: tx,
        network,
        payer
      };
    }
    const validationFailure = validateReceipt?.(receipt);
    if (validationFailure) {
      return validationFailure;
    }
    if (onSuccess) {
      return await onSuccess(receipt);
    }
    return {
      success: true,
      transaction: tx,
      network,
      payer,
      ...amount !== void 0 ? { amount } : {}
    };
  } catch (error) {
    return settlementPendingResponse(tx, network, payer, error);
  }
}
async function withPendingSettlementStore(store, pendingKey, settle, nonRetryableReason = ErrInvalidTransactionState) {
  const result = await settle();
  if (!pendingKey) {
    return result;
  }
  const isPending = !result.success && result.errorReason === ErrSettlementPending && !!result.transaction;
  if (isPending) {
    try {
      await store.set(pendingKey, result.transaction);
    } catch (storeError) {
      return {
        ...result,
        errorReason: nonRetryableReason,
        errorMessage: `settlement_pending, but failed to persist for retry: ${storeError instanceof Error ? storeError.message : String(storeError)}`
      };
    }
    return result;
  }
  try {
    await store.delete(pendingKey);
  } catch {
  }
  return result;
}
function settlementPendingResponse(tx, network, payer, error) {
  return {
    success: false,
    errorReason: ErrSettlementPending,
    errorMessage: truncateErrorMessage(error instanceof Error ? error.message : String(error)),
    transaction: tx,
    network,
    payer
  };
}

export {
  waitAndReturnSettleResponse,
  withPendingSettlementStore
};
//# sourceMappingURL=chunk-P7ASDIFN.mjs.map