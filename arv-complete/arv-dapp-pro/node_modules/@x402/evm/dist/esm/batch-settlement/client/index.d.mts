import { B as BatchSettlementClientDeps } from '../../scheme-B3cx_Dr9.mjs';
export { b as BatchSettlementDepositPolicy, c as BatchSettlementDepositStrategy, d as BatchSettlementDepositStrategyContext, e as BatchSettlementDepositStrategyResult, a as BatchSettlementEvmScheme, f as BatchSettlementEvmSchemeOptions, C as ChannelSettleLocal, R as RefundOptions, k as ResolvedClientOptions, g as applyMaxDeposit, l as buildChannelConfig, h as depositAmountForRequest, n as getChannel, o as hasChannel, i as isBatchSettlementEvmSchemeOptions, m as maxDepositFromSpendCap, p as parseAnnouncedMinDeposit, q as processPaymentResponse, s as readChannelBalanceAndTotalClaimed, t as recoverChannel, r as refundChannel, j as resolveClientOptions, u as updateChannelAfterRefund, w as updateChannelFromSettle, v as validateDepositPolicy } from '../../scheme-B3cx_Dr9.mjs';
export { B as BatchSettlementClientContext, C as ClientChannelStorage, I as InMemoryClientChannelStorage } from '../../storage-BFpn16ZW.mjs';
import { PaymentRequirements, PaymentPayloadResult, SchemeClientHooks, PaymentRequired } from '@x402/core/types';
import { C as ClientEvmSigner } from '../../signer-CJuc15ii.mjs';
import { C as ChannelConfig, b as BatchSettlementVoucherFields, c as BatchSettlementChannelStateExtra, d as BatchSettlementVoucherStateExtra } from '../../types-B4ib_1f_.mjs';
import '../../rpc-BBJ9foT3.mjs';
import '../../defaultAssets-39aDn897.mjs';
import 'viem';

/**
 * Computes the chain-bound channel id from a {@link ChannelConfig} struct.
 *
 * @param config - The immutable channel configuration.
 * @param networkOrChainId - CAIP-2 network identifier or numeric EVM chain id.
 * @returns The `bytes32` channel id as a hex string.
 */
declare function computeChannelId(config: ChannelConfig, networkOrChainId: string | number): `0x${string}`;

/**
 * Creates a deposit payload that bundles an ERC-3009 `receiveWithAuthorization` approval
 * together with a cumulative voucher signature.
 *
 * When the facilitator submits this payload onchain, the contract atomically transfers
 * tokens from the payer into the channel and records the initial voucher.
 *
 * @param signer - Client wallet used to sign the ERC-3009 authorization (`from` = payer).
 * @param x402Version - Protocol version to embed in the payload envelope.
 * @param paymentRequirements - Server-provided payment requirements (asset, network, amount, etc.).
 * @param channelConfig - Immutable channel configuration (payer, receiver, token, …).
 * @param depositAmount - Number of tokens (decimal string) to deposit into the channel.
 * @param maxClaimableAmount - Cumulative ceiling for the accompanying voucher.
 * @param voucherSigner - Optional key that signs the voucher; defaults to `signer` (same as payer).
 * @returns A {@link PaymentPayloadResult} containing the signed deposit + voucher payload.
 */
declare function createBatchSettlementEIP3009DepositPayload(signer: ClientEvmSigner, x402Version: number, paymentRequirements: PaymentRequirements, channelConfig: ChannelConfig, depositAmount: string, maxClaimableAmount: string, voucherSigner?: ClientEvmSigner): Promise<PaymentPayloadResult>;

/**
 * Signs a cumulative voucher using the client's wallet.
 *
 * The voucher authorises the receiver to claim up to `maxClaimableAmount` from the
 * channel identified by `channelId`.  The signature covers the EIP-712 `Voucher` struct
 * under the batched domain.
 *
 * @param signer - Client wallet used to produce the EIP-712 signature.
 * @param channelId - Identifier of the payment channel. This is the EIP-712
 * hash of the `ChannelConfig` typed data for the batch settlement domain; see
 * `computeChannelId`.
 * @param maxClaimableAmount - Cumulative ceiling the receiver may claim (decimal string in token units).
 * @param network - CAIP-2 network identifier (e.g. `eip155:84532`).
 * @returns Signed voucher fields ready to be included in a payment payload.
 */
declare function signVoucher(signer: ClientEvmSigner, channelId: `0x${string}`, maxClaimableAmount: string, network: string): Promise<BatchSettlementVoucherFields>;

/**
 * Creates storage-aware client hooks for batch-settlement payment responses.
 *
 * @param deps - Client identity and storage inputs.
 * @returns Scheme hooks for response reconciliation and corrective recovery.
 */
declare function createBatchSettlementClientHooks(deps: BatchSettlementClientDeps): SchemeClientHooks;

/**
 * Handles a corrective 402 response from the server when the client's
 * cumulative base is out of sync.
 *
 * Validates the server-provided state (chargedCumulativeAmount,
 * signedMaxClaimable, signature) against onchain data and the client's own
 * signing key, then updates the local channel state if everything checks out.
 *
 * @param deps - Signer + storage + identity inputs.
 * @param paymentRequired - The decoded 402 response body.
 * @returns `true` if the channel state was successfully resynced and the request can be retried.
 */
declare function processCorrectivePaymentRequired(deps: BatchSettlementClientDeps, paymentRequired: PaymentRequired): Promise<boolean>;
/**
 * Recovers channel state from a corrective 402 that includes a server-provided
 * voucher signature. Verifies the signature matches the client's own signing
 * key before accepting.
 *
 * @param deps - Signer + storage + identity inputs.
 * @param accept - Batch settlement payment requirements from the corrective 402.
 * @param channelState - Server channel snapshot from `accept.extra.channelState`.
 * @param voucherState - Latest signed voucher proof from `accept.extra.voucherState`.
 * @returns `true` when local channel state was updated successfully.
 */
declare function recoverFromSignature(deps: BatchSettlementClientDeps, accept: PaymentRequirements, channelState: BatchSettlementChannelStateExtra, voucherState: BatchSettlementVoucherStateExtra): Promise<boolean>;
/**
 * Recovers channel state purely from onchain state when the server has no stored
 * voucher (e.g. after a cooperative refund deleted the channel record). The onchain
 * `totalClaimed` becomes the new baseline — no signature verification is
 * needed because the contract is the source of truth when no outstanding
 * voucher exists.
 *
 * @param deps - Signer + storage + identity inputs.
 * @param accept - Batch settlement payment requirements from the corrective 402.
 * @returns `true` when local channel state was updated from onchain data.
 */
declare function recoverFromOnChainState(deps: BatchSettlementClientDeps, accept: PaymentRequirements): Promise<boolean>;

export { BatchSettlementClientDeps, computeChannelId, createBatchSettlementClientHooks, createBatchSettlementEIP3009DepositPayload, processCorrectivePaymentRequired, recoverFromOnChainState, recoverFromSignature, signVoucher };
