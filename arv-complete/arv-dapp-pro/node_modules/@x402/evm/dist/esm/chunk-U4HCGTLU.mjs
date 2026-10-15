// src/batch-settlement/types.ts
function isObject(payload) {
  return typeof payload === "object" && payload !== null;
}
function isVoucherFields(payload) {
  return isObject(payload) && "channelId" in payload && "maxClaimableAmount" in payload && "signature" in payload;
}
function isBatchSettlementDepositPayload(payload) {
  return isObject(payload) && payload.type === "deposit" && "channelConfig" in payload && isVoucherFields(payload.voucher) && isObject(payload.deposit) && typeof payload.deposit.amount === "string" && isObject(payload.deposit.authorization);
}
function isBatchSettlementVoucherPayload(payload) {
  return isObject(payload) && payload.type === "voucher" && "channelConfig" in payload && isVoucherFields(payload.voucher);
}
function isBatchSettlementRefundPayload(payload) {
  return isObject(payload) && payload.type === "refund" && "channelConfig" in payload && isVoucherFields(payload.voucher);
}
function isBatchSettlementClaimPayload(payload) {
  return isObject(payload) && payload.type === "claim" && "claims" in payload;
}
function isBatchSettlementSettlePayload(payload) {
  return isObject(payload) && payload.type === "settle" && "receiver" in payload && "token" in payload;
}
function isBatchSettlementEnrichedRefundPayload(payload) {
  return isBatchSettlementRefundPayload(payload) && "amount" in payload && "refundNonce" in payload && "claims" in payload;
}

export {
  isBatchSettlementDepositPayload,
  isBatchSettlementVoucherPayload,
  isBatchSettlementRefundPayload,
  isBatchSettlementClaimPayload,
  isBatchSettlementSettlePayload,
  isBatchSettlementEnrichedRefundPayload
};
//# sourceMappingURL=chunk-U4HCGTLU.mjs.map