// src/exact/facilitator/errors.ts
var ErrAssetNotDeployedContract = "asset_not_deployed_contract";
var ErrInvalidScheme = "invalid_exact_evm_scheme";
var ErrNetworkMismatch = "invalid_exact_evm_network_mismatch";
var ErrMissingEip712Domain = "invalid_exact_evm_missing_eip712_domain";
var ErrRecipientMismatch = "invalid_exact_evm_recipient_mismatch";
var ErrInvalidSignature = "invalid_exact_evm_signature";
var ErrValidBeforeExpired = "invalid_exact_evm_payload_authorization_valid_before";
var ErrValidAfterInFuture = "invalid_exact_evm_payload_authorization_valid_after";
var ErrInvalidAuthorizationValue = "invalid_exact_evm_authorization_value";
var ErrAuthorizationValueMismatch = "invalid_exact_evm_payload_authorization_value_mismatch";
var ErrTransactionFailed = "invalid_exact_evm_transaction_failed";
var ErrTransferEventMismatch = "invalid_exact_evm_transfer_event_mismatch";
var ErrEip3009TokenNameMismatch = "invalid_exact_evm_token_name_mismatch";
var ErrEip3009TokenVersionMismatch = "invalid_exact_evm_token_version_mismatch";
var ErrEip3009NotSupported = "invalid_exact_evm_eip3009_not_supported";
var ErrEip3009NonceAlreadyUsed = "invalid_exact_evm_nonce_already_used";
var ErrEip3009InsufficientBalance = "invalid_exact_evm_insufficient_balance";
var ErrEip3009SimulationFailed = "invalid_exact_evm_transaction_simulation_failed";
var ErrPermit2InvalidSpender = "invalid_permit2_spender";
var ErrPermit2RecipientMismatch = "invalid_permit2_recipient_mismatch";
var ErrPermit2DeadlineExpired = "permit2_deadline_expired";
var ErrPermit2NotYetValid = "permit2_not_yet_valid";
var ErrPermit2AmountMismatch = "permit2_amount_mismatch";
var ErrPermit2TokenMismatch = "permit2_token_mismatch";
var ErrPermit2InvalidSignature = "invalid_permit2_signature";
var ErrPermit2AllowanceRequired = "permit2_allowance_required";
var ErrPermit2SimulationFailed = "permit2_simulation_failed";
var ErrPermit2InsufficientBalance = "permit2_insufficient_balance";
var ErrPermit2ProxyNotDeployed = "permit2_proxy_not_deployed";
var ErrPermit2InvalidAmount = "permit2_invalid_amount";
var ErrPermit2InvalidDestination = "permit2_invalid_destination";
var ErrPermit2InvalidOwner = "permit2_invalid_owner";
var ErrPermit2PaymentTooEarly = "permit2_payment_too_early";
var ErrPermit2InvalidNonce = "permit2_invalid_nonce";
var ErrPermit2612AmountMismatch = "permit2_2612_amount_mismatch";
var ErrErc20ApprovalInvalidFormat = "invalid_erc20_approval_extension_format";
var ErrErc20ApprovalFromMismatch = "erc20_approval_from_mismatch";
var ErrErc20ApprovalAssetMismatch = "erc20_approval_asset_mismatch";
var ErrErc20ApprovalSpenderNotPermit2 = "erc20_approval_spender_not_permit2";
var ErrErc20ApprovalTxWrongTarget = "erc20_approval_tx_wrong_target";
var ErrErc20ApprovalTxWrongSelector = "erc20_approval_tx_wrong_selector";
var ErrErc20ApprovalTxWrongSpender = "erc20_approval_tx_wrong_spender";
var ErrErc20ApprovalTxInvalidCalldata = "erc20_approval_tx_invalid_calldata";
var ErrErc20ApprovalTxSignerMismatch = "erc20_approval_tx_signer_mismatch";
var ErrErc20ApprovalTxInvalidSignature = "erc20_approval_tx_invalid_signature";
var ErrErc20ApprovalTxParseFailed = "erc20_approval_tx_parse_failed";
var ErrErc20ApprovalTxFailed = "erc20_approval_tx_failed";
var ErrErc20ApprovalBroadcastFailed = "erc20_approval_broadcast_failed";
var ErrInvalidEip2612ExtensionFormat = "invalid_eip2612_extension_format";
var ErrEip2612FromMismatch = "eip2612_from_mismatch";
var ErrEip2612AssetMismatch = "eip2612_asset_mismatch";
var ErrEip2612SpenderNotPermit2 = "eip2612_spender_not_permit2";
var ErrEip2612DeadlineExpired = "eip2612_deadline_expired";
var ErrFailedToParseSignature = "invalid_exact_evm_failed_to_parse_signature";
var ErrUnsupportedPayloadType = "unsupported_payload_type";
var ErrInvalidTransactionState = "invalid_transaction_state";
var ErrFactoryNotAllowed = "eip6492_factory_not_allowed";
var ErrSmartWalletDeploymentFailed = "smart_wallet_deployment_failed";
var ErrSettlementPending = "settlement_pending";

export {
  ErrAssetNotDeployedContract,
  ErrInvalidScheme,
  ErrNetworkMismatch,
  ErrMissingEip712Domain,
  ErrRecipientMismatch,
  ErrInvalidSignature,
  ErrValidBeforeExpired,
  ErrValidAfterInFuture,
  ErrInvalidAuthorizationValue,
  ErrAuthorizationValueMismatch,
  ErrTransactionFailed,
  ErrTransferEventMismatch,
  ErrEip3009TokenNameMismatch,
  ErrEip3009TokenVersionMismatch,
  ErrEip3009NotSupported,
  ErrEip3009NonceAlreadyUsed,
  ErrEip3009InsufficientBalance,
  ErrEip3009SimulationFailed,
  ErrPermit2InvalidSpender,
  ErrPermit2RecipientMismatch,
  ErrPermit2DeadlineExpired,
  ErrPermit2NotYetValid,
  ErrPermit2AmountMismatch,
  ErrPermit2TokenMismatch,
  ErrPermit2InvalidSignature,
  ErrPermit2AllowanceRequired,
  ErrPermit2SimulationFailed,
  ErrPermit2InsufficientBalance,
  ErrPermit2ProxyNotDeployed,
  ErrPermit2InvalidAmount,
  ErrPermit2InvalidDestination,
  ErrPermit2InvalidOwner,
  ErrPermit2PaymentTooEarly,
  ErrPermit2InvalidNonce,
  ErrPermit2612AmountMismatch,
  ErrErc20ApprovalInvalidFormat,
  ErrErc20ApprovalFromMismatch,
  ErrErc20ApprovalAssetMismatch,
  ErrErc20ApprovalSpenderNotPermit2,
  ErrErc20ApprovalTxWrongTarget,
  ErrErc20ApprovalTxWrongSelector,
  ErrErc20ApprovalTxWrongSpender,
  ErrErc20ApprovalTxInvalidCalldata,
  ErrErc20ApprovalTxSignerMismatch,
  ErrErc20ApprovalTxInvalidSignature,
  ErrErc20ApprovalTxParseFailed,
  ErrErc20ApprovalTxFailed,
  ErrErc20ApprovalBroadcastFailed,
  ErrInvalidEip2612ExtensionFormat,
  ErrEip2612FromMismatch,
  ErrEip2612AssetMismatch,
  ErrEip2612SpenderNotPermit2,
  ErrEip2612DeadlineExpired,
  ErrFailedToParseSignature,
  ErrUnsupportedPayloadType,
  ErrInvalidTransactionState,
  ErrFactoryNotAllowed,
  ErrSmartWalletDeploymentFailed,
  ErrSettlementPending
};
//# sourceMappingURL=chunk-VEDHRFNU.mjs.map