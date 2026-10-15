import { TypedData } from 'viem';

interface AuthorizerSigner {
    address: `0x${string}`;
    signTypedData(params: {
        domain: Record<string, unknown>;
        types: TypedData;
        primaryType: string;
        message: Record<string, unknown>;
    }): Promise<`0x${string}`>;
}
type ChannelState = {
    balance: bigint;
    totalClaimed: bigint;
    withdrawRequestedAt: number;
    refundNonce: bigint;
};
type ChannelConfig = {
    payer: `0x${string}`;
    payerAuthorizer: `0x${string}`;
    receiver: `0x${string}`;
    receiverAuthorizer: `0x${string}`;
    token: `0x${string}`;
    withdrawDelay: number;
    salt: `0x${string}`;
};
type BatchSettlementErc3009Authorization = {
    validAfter: string;
    validBefore: string;
    salt: `0x${string}`;
    signature: `0x${string}`;
};
type BatchSettlementPermit2Authorization = {
    from: `0x${string}`;
    permitted: {
        token: `0x${string}`;
        amount: string;
    };
    spender: `0x${string}`;
    nonce: string;
    deadline: string;
    witness: {
        channelId: `0x${string}`;
    };
    signature: `0x${string}`;
};
type BatchSettlementAssetTransferMethod = "eip3009" | "permit2";
type BatchSettlementDepositAuthorization = {
    erc3009Authorization: BatchSettlementErc3009Authorization;
    permit2Authorization?: never;
} | {
    erc3009Authorization?: never;
    permit2Authorization: BatchSettlementPermit2Authorization;
};
type BatchSettlementDepositPayload = {
    type: "deposit";
    channelConfig: ChannelConfig;
    voucher: BatchSettlementVoucherFields;
    deposit: {
        amount: string;
        authorization: BatchSettlementDepositAuthorization;
    };
};
type BatchSettlementVoucherPayload = {
    type: "voucher";
    channelConfig: ChannelConfig;
    voucher: BatchSettlementVoucherFields;
};
type BatchSettlementRefundPayload = {
    type: "refund";
    channelConfig: ChannelConfig;
    voucher: BatchSettlementVoucherFields;
    amount?: string;
};
type BatchSettlementVoucherFields = {
    channelId: `0x${string}`;
    maxClaimableAmount: string;
    signature: `0x${string}`;
};
type BatchSettlementVoucherClaim = {
    voucher: {
        channel: ChannelConfig;
        maxClaimableAmount: string;
    };
    signature: `0x${string}`;
    totalClaimed: string;
};
type BatchSettlementChannelStateExtra = {
    channelId: `0x${string}`;
    balance: string;
    totalClaimed: string;
    withdrawRequestedAt: number;
    refundNonce: string;
    chargedCumulativeAmount?: string;
};
type BatchSettlementVoucherStateExtra = {
    signedMaxClaimable?: string;
    signature?: `0x${string}`;
};
type BatchSettlementPaymentRequirementsExtra = {
    receiverAuthorizer: `0x${string}`;
    withdrawDelay: number;
    name: string;
    version: string;
    assetTransferMethod?: BatchSettlementAssetTransferMethod;
    channelState?: BatchSettlementChannelStateExtra;
    voucherState?: BatchSettlementVoucherStateExtra;
};
type FileChannelStorageOptions = {
    /** Root directory; channels are stored under `{directory}/{client|server}/{channelId}.json`. */
    directory: string;
};
type BatchSettlementPaymentResponseExtra = {
    chargedAmount?: string;
    channelState?: BatchSettlementChannelStateExtra;
    voucherState?: BatchSettlementVoucherStateExtra;
};
type BatchSettlementClaimPayload = {
    type: "claim";
    claims: BatchSettlementVoucherClaim[];
    claimAuthorizerSignature?: `0x${string}`;
};
type BatchSettlementSettlePayload = {
    type: "settle";
    receiver: `0x${string}`;
    token: `0x${string}`;
};
type BatchSettlementEnrichedRefundPayload = BatchSettlementRefundPayload & {
    amount: string;
    refundNonce: string;
    claims: BatchSettlementVoucherClaim[];
    refundAuthorizerSignature?: `0x${string}`;
    claimAuthorizerSignature?: `0x${string}`;
};
type BatchSettlementPayload = BatchSettlementDepositPayload | BatchSettlementVoucherPayload | BatchSettlementRefundPayload;
type BatchSettlementFacilitatorSettlePayload = BatchSettlementDepositPayload | BatchSettlementClaimPayload | BatchSettlementSettlePayload | BatchSettlementEnrichedRefundPayload;
/**
 * Type guard for {@link BatchSettlementDepositPayload}.
 *
 * @param payload - Unknown payload to check.
 * @returns True if `payload` is a deposit payload (carries `deposit` and `voucher`).
 */
declare function isBatchSettlementDepositPayload(payload: unknown): payload is BatchSettlementDepositPayload;
/**
 * Type guard for {@link BatchSettlementVoucherPayload}.
 *
 * @param payload - Unknown payload to check.
 * @returns True if `payload` is a voucher payload with channel and signature fields.
 */
declare function isBatchSettlementVoucherPayload(payload: unknown): payload is BatchSettlementVoucherPayload;
/**
 * Type guard for {@link BatchSettlementRefundPayload}.
 *
 * @param payload - Unknown payload to check.
 * @returns True if `payload` is a refund payload with channel config and voucher fields.
 */
declare function isBatchSettlementRefundPayload(payload: unknown): payload is BatchSettlementRefundPayload;
/**
 * Type guard for {@link BatchSettlementClaimPayload}.
 *
 * @param payload - Unknown payload to check.
 * @returns True if `payload` is a settle-action `claimWithSignature` payload.
 */
declare function isBatchSettlementClaimPayload(payload: unknown): payload is BatchSettlementClaimPayload;
/**
 * Type guard for {@link BatchSettlementSettlePayload}.
 *
 * @param payload - Unknown payload to check.
 * @returns True if `payload` is a settle-action `settle` payload.
 */
declare function isBatchSettlementSettlePayload(payload: unknown): payload is BatchSettlementSettlePayload;
/**
 * Type guard for {@link BatchSettlementEnrichedRefundPayload}.
 *
 * @param payload - Unknown payload to check.
 * @returns True if `payload` is a settle-action `refundWithSignature` payload.
 */
declare function isBatchSettlementEnrichedRefundPayload(payload: unknown): payload is BatchSettlementEnrichedRefundPayload;

export { type AuthorizerSigner as A, type BatchSettlementVoucherClaim as B, type ChannelConfig as C, type FileChannelStorageOptions as F, type BatchSettlementAssetTransferMethod as a, type BatchSettlementVoucherFields as b, type BatchSettlementChannelStateExtra as c, type BatchSettlementVoucherStateExtra as d, type ChannelState as e, type BatchSettlementDepositPayload as f, type BatchSettlementVoucherPayload as g, type BatchSettlementRefundPayload as h, type BatchSettlementErc3009Authorization as i, type BatchSettlementClaimPayload as j, type BatchSettlementEnrichedRefundPayload as k, type BatchSettlementPayload as l, type BatchSettlementSettlePayload as m, type BatchSettlementFacilitatorSettlePayload as n, type BatchSettlementPaymentRequirementsExtra as o, type BatchSettlementPaymentResponseExtra as p, isBatchSettlementDepositPayload as q, isBatchSettlementVoucherPayload as r, isBatchSettlementRefundPayload as s, isBatchSettlementClaimPayload as t, isBatchSettlementSettlePayload as u, isBatchSettlementEnrichedRefundPayload as v };
