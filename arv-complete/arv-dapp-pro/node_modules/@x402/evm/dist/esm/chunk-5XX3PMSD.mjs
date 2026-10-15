import {
  getEvmChainId
} from "./chunk-EKCH75YB.mjs";

// src/batch-settlement/constants.ts
import { keccak256, toBytes } from "viem";
var BATCH_SETTLEMENT_SCHEME = "batch-settlement";
var BATCH_SETTLEMENT_ADDRESS = "0x4020074e9dF2ce1deE5A9C1b5c3f541D02a10003";
var ERC3009_DEPOSIT_COLLECTOR_ADDRESS = "0x4020806089470a89826cB9fB1f4059150b550004";
var PERMIT2_DEPOSIT_COLLECTOR_ADDRESS = "0x4020425FAf3B746C082C2f942b4E5159887B0005";
var CHANNEL_STATE_POLL_MS = 2e3;
var CHANNEL_STATE_POLL_INTERVAL_MS = 150;
var DEFAULT_SERVER_MIN_DEPOSIT_MULTIPLIER = 10;
var MIN_WITHDRAW_DELAY = 900;
var MAX_WITHDRAW_DELAY = 2592e3;
var BATCH_SETTLEMENT_DOMAIN = {
  name: "x402 Batch Settlement",
  version: "1"
};
var CHANNEL_CONFIG_TYPEHASH = keccak256(
  toBytes(
    "ChannelConfig(address payer,address payerAuthorizer,address receiver,address receiverAuthorizer,address token,uint40 withdrawDelay,bytes32 salt)"
  )
);
var channelConfigTypes = {
  ChannelConfig: [
    { name: "payer", type: "address" },
    { name: "payerAuthorizer", type: "address" },
    { name: "receiver", type: "address" },
    { name: "receiverAuthorizer", type: "address" },
    { name: "token", type: "address" },
    { name: "withdrawDelay", type: "uint40" },
    { name: "salt", type: "bytes32" }
  ]
};
var voucherTypes = {
  Voucher: [
    { name: "channelId", type: "bytes32" },
    { name: "maxClaimableAmount", type: "uint128" }
  ]
};
var refundTypes = {
  Refund: [
    { name: "channelId", type: "bytes32" },
    { name: "nonce", type: "uint256" },
    { name: "amount", type: "uint128" }
  ]
};
var claimBatchTypes = {
  ClaimBatch: [{ name: "claims", type: "ClaimEntry[]" }],
  ClaimEntry: [
    { name: "channelId", type: "bytes32" },
    { name: "maxClaimableAmount", type: "uint128" },
    { name: "totalClaimed", type: "uint128" }
  ]
};
var receiveAuthorizationTypes = {
  ReceiveWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" }
  ]
};
var batchPermit2WitnessTypes = {
  PermitWitnessTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "witness", type: "DepositWitness" }
  ],
  TokenPermissions: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" }
  ],
  DepositWitness: [{ name: "channelId", type: "bytes32" }]
};

// src/batch-settlement/errors.ts
var ErrChannelNotFound = "invalid_batch_settlement_evm_channel_not_found";
var ErrTokenMismatch = "invalid_batch_settlement_evm_token_mismatch";
var ErrInvalidVoucherSignature = "invalid_batch_settlement_evm_voucher_signature";
var ErrCumulativeExceedsBalance = "invalid_batch_settlement_evm_cumulative_exceeds_balance";
var ErrCumulativeAmountBelowClaimed = "invalid_batch_settlement_evm_cumulative_below_claimed";
var ErrInsufficientBalance = "invalid_batch_settlement_evm_insufficient_balance";
var ErrDepositTransactionFailed = "invalid_batch_settlement_evm_deposit_transaction_failed";
var ErrClaimTransactionFailed = "invalid_batch_settlement_evm_claim_transaction_failed";
var ErrSettleTransactionFailed = "invalid_batch_settlement_evm_settle_transaction_failed";
var ErrInvalidScheme = "invalid_batch_settlement_evm_scheme";
var ErrNetworkMismatch = "invalid_batch_settlement_evm_network_mismatch";
var ErrMissingEip712Domain = "invalid_batch_settlement_evm_missing_eip712_domain";
var ErrValidBeforeExpired = "invalid_batch_settlement_evm_payload_authorization_valid_before";
var ErrValidAfterInFuture = "invalid_batch_settlement_evm_payload_authorization_valid_after";
var ErrInvalidReceiveAuthorizationSignature = "invalid_batch_settlement_evm_receive_authorization_signature";
var ErrErc3009AuthorizationRequired = "invalid_batch_settlement_evm_erc3009_authorization_required";
var ErrRefundTransactionFailed = "invalid_batch_settlement_evm_refund_transaction_failed";
var ErrInvalidPayloadType = "invalid_batch_settlement_evm_payload_type";
var ErrWithdrawDelayOutOfRange = "invalid_batch_settlement_evm_withdraw_delay_out_of_range";
var ErrChannelIdMismatch = "invalid_batch_settlement_evm_channel_id_mismatch";
var ErrInvalidChannelId = "invalid_batch_settlement_evm_channel_id_invalid";
var ErrReceiverMismatch = "invalid_batch_settlement_evm_receiver_mismatch";
var ErrReceiverAuthorizerMismatch = "invalid_batch_settlement_evm_receiver_authorizer_mismatch";
var ErrWithdrawDelayMismatch = "invalid_batch_settlement_evm_withdraw_delay_mismatch";
var ErrAuthorizerAddressMismatch = "invalid_batch_settlement_evm_authorizer_address_mismatch";
var ErrAuthorizerNotConfigured = "invalid_batch_settlement_evm_authorizer_not_configured";
var ErrDepositSimulationFailed = "invalid_batch_settlement_evm_deposit_simulation_failed";
var ErrDepositBelowMinDeposit = "invalid_batch_settlement_evm_deposit_below_min_deposit";
var ErrFactoryNotAllowed = "invalid_batch_settlement_evm_eip6492_factory_not_allowed";
var ErrSmartWalletDeploymentFailed = "invalid_batch_settlement_evm_smart_wallet_deployment_failed";
var ErrClaimSimulationFailed = "invalid_batch_settlement_evm_claim_simulation_failed";
var ErrSettleSimulationFailed = "invalid_batch_settlement_evm_settle_simulation_failed";
var ErrNothingToSettle = "invalid_batch_settlement_evm_nothing_to_settle";
var ErrRefundPayload = "invalid_batch_settlement_evm_refund_payload";
var ErrRefundSimulationFailed = "invalid_batch_settlement_evm_refund_simulation_failed";
var ErrRpcReadFailed = "invalid_batch_settlement_evm_rpc_read_failed";
var ErrPermit2AuthorizationRequired = "invalid_batch_settlement_evm_permit2_authorization_required";
var ErrPermit2InvalidSpender = "invalid_batch_settlement_evm_permit2_invalid_spender";
var ErrPermit2AmountMismatch = "invalid_batch_settlement_evm_permit2_amount_mismatch";
var ErrPermit2DeadlineExpired = "invalid_batch_settlement_evm_permit2_deadline_expired";
var ErrPermit2InvalidSignature = "invalid_batch_settlement_evm_permit2_invalid_signature";
var ErrPermit2AllowanceRequired = "invalid_batch_settlement_evm_permit2_allowance_required";
var ErrEip2612AmountMismatch = "invalid_batch_settlement_evm_eip2612_amount_mismatch";
var ErrErc20ApprovalUnavailable = "invalid_batch_settlement_evm_erc20_approval_unavailable";
var ErrCumulativeAmountMismatch = "invalid_batch_settlement_evm_cumulative_amount_mismatch";
var ErrChannelBusy = "invalid_batch_settlement_evm_channel_busy";
var ErrVerificationStateUnavailable = "invalid_batch_settlement_evm_verification_state_unavailable";
var ErrChargeExceedsSignedCumulative = "invalid_batch_settlement_evm_charge_exceeds_signed_cumulative";
var ErrMissingChannel = "invalid_batch_settlement_evm_missing_channel";
var ErrRefundNoBalance = "invalid_batch_settlement_evm_refund_no_balance";
var ErrRefundAmountInvalid = "invalid_batch_settlement_evm_refund_amount_invalid";

// src/batch-settlement/utils.ts
import { getAddress, hashTypedData } from "viem";
var CHANNEL_ID_RE = /^0x[0-9a-fA-F]{64}$/;
function isCanonicalChannelId(value) {
  return typeof value === "string" && CHANNEL_ID_RE.test(value);
}
function normalizeChannelId(channelId) {
  if (!isCanonicalChannelId(channelId)) {
    throw new Error(ErrInvalidChannelId);
  }
  return channelId.toLowerCase();
}
function channelIdBindingError(config, claimedChannelId, networkOrChainId) {
  if (!isCanonicalChannelId(claimedChannelId)) return ErrInvalidChannelId;
  if (computeChannelId(config, networkOrChainId).toLowerCase() !== claimedChannelId.toLowerCase()) {
    return ErrChannelIdMismatch;
  }
  return void 0;
}
function computeChannelId(config, networkOrChainId) {
  const chainId = typeof networkOrChainId === "number" ? networkOrChainId : getEvmChainId(networkOrChainId);
  return hashTypedData({
    domain: getBatchSettlementEip712Domain(chainId),
    types: channelConfigTypes,
    primaryType: "ChannelConfig",
    message: {
      payer: config.payer,
      payerAuthorizer: config.payerAuthorizer,
      receiver: config.receiver,
      receiverAuthorizer: config.receiverAuthorizer,
      token: config.token,
      withdrawDelay: config.withdrawDelay,
      salt: config.salt
    }
  });
}
function getBatchSettlementEip712Domain(chainId) {
  return {
    ...BATCH_SETTLEMENT_DOMAIN,
    chainId,
    verifyingContract: getAddress(BATCH_SETTLEMENT_ADDRESS)
  };
}

export {
  BATCH_SETTLEMENT_SCHEME,
  BATCH_SETTLEMENT_ADDRESS,
  ERC3009_DEPOSIT_COLLECTOR_ADDRESS,
  PERMIT2_DEPOSIT_COLLECTOR_ADDRESS,
  CHANNEL_STATE_POLL_MS,
  CHANNEL_STATE_POLL_INTERVAL_MS,
  DEFAULT_SERVER_MIN_DEPOSIT_MULTIPLIER,
  MIN_WITHDRAW_DELAY,
  MAX_WITHDRAW_DELAY,
  BATCH_SETTLEMENT_DOMAIN,
  voucherTypes,
  refundTypes,
  claimBatchTypes,
  receiveAuthorizationTypes,
  batchPermit2WitnessTypes,
  ErrChannelNotFound,
  ErrTokenMismatch,
  ErrInvalidVoucherSignature,
  ErrCumulativeExceedsBalance,
  ErrCumulativeAmountBelowClaimed,
  ErrInsufficientBalance,
  ErrDepositTransactionFailed,
  ErrClaimTransactionFailed,
  ErrSettleTransactionFailed,
  ErrInvalidScheme,
  ErrNetworkMismatch,
  ErrMissingEip712Domain,
  ErrValidBeforeExpired,
  ErrValidAfterInFuture,
  ErrInvalidReceiveAuthorizationSignature,
  ErrErc3009AuthorizationRequired,
  ErrRefundTransactionFailed,
  ErrInvalidPayloadType,
  ErrWithdrawDelayOutOfRange,
  ErrChannelIdMismatch,
  ErrReceiverMismatch,
  ErrReceiverAuthorizerMismatch,
  ErrWithdrawDelayMismatch,
  ErrAuthorizerAddressMismatch,
  ErrAuthorizerNotConfigured,
  ErrDepositSimulationFailed,
  ErrDepositBelowMinDeposit,
  ErrFactoryNotAllowed,
  ErrSmartWalletDeploymentFailed,
  ErrClaimSimulationFailed,
  ErrSettleSimulationFailed,
  ErrNothingToSettle,
  ErrRefundPayload,
  ErrRefundSimulationFailed,
  ErrRpcReadFailed,
  ErrPermit2AuthorizationRequired,
  ErrPermit2InvalidSpender,
  ErrPermit2AmountMismatch,
  ErrPermit2DeadlineExpired,
  ErrPermit2InvalidSignature,
  ErrPermit2AllowanceRequired,
  ErrEip2612AmountMismatch,
  ErrErc20ApprovalUnavailable,
  ErrCumulativeAmountMismatch,
  ErrChannelBusy,
  ErrVerificationStateUnavailable,
  ErrChargeExceedsSignedCumulative,
  ErrMissingChannel,
  ErrRefundNoBalance,
  ErrRefundAmountInvalid,
  normalizeChannelId,
  channelIdBindingError,
  computeChannelId,
  getBatchSettlementEip712Domain
};
//# sourceMappingURL=chunk-5XX3PMSD.mjs.map