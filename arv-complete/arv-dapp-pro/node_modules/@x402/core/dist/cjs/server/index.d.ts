import { L as PaymentFlowName, O as PaymentFlowPhases, Q as SchemeNetworkServer, T as DeepReadonly, I as PaymentRequirements, S as SettleResponse, P as PaymentPayload } from '../x402Client-C7_OogbK.js';
export { ah as AfterSettleHook, ae as AfterVerifyHook, ag as BeforeSettleHook, ad as BeforeVerifyHook, C as CompiledRoute, a8 as CompletedSettlement, aa as ExtensionValidationResult, E as FacilitatorCapabilityError, F as FacilitatorClient, z as FacilitatorConfig, A as FacilitatorResponseError, B as FacilitatorTimeoutError, H as HTTPAdapter, y as HTTPFacilitatorClient, e as HTTPProcessResult, b as HTTPRequestContext, k as HTTPResponseBody, d as HTTPResponseInstructions, c as HTTPTransportContext, ai as OnSettleFailureHook, aj as OnVerifiedPaymentCanceledHook, af as OnVerifyFailureHook, v as PAYMENT_REQUIRED_CACHE_CONTROL, a7 as PaymentCancellationDispatcher, ao as PaymentFlowConfig, Y as PaymentRequiredContext, f as PaywallConfig, g as PaywallProvider, o as ProcessSettleFailureResponse, m as ProcessSettleResultResponse, n as ProcessSettleSuccessResponse, r as ProtectedRequestHook, X as ResourceConfig, ac as ResourceVerifyRespone, R as RouteConfig, q as RouteConfigurationError, p as RouteValidationError, i as RoutesConfig, u as SETTLEMENT_OVERRIDES_HEADER, ak as SchemeEnrichPaymentRequiredResponseHook, am as SchemeEnrichSettlementPayloadHook, an as SchemeEnrichSettlementResponseHook, al as SchemePaymentRequiredContext, a0 as SettleContext, a2 as SettleFailureContext, a3 as SettlePhase, a1 as SettleResultContext, l as SettlementFailedResponseBody, a9 as SettlementOverrides, ab as SkipHandlerDirective, U as UnpaidResponseBody, a6 as VerifiedPaymentCancelOptions, a4 as VerifiedPaymentCanceledContext, a5 as VerifiedPaymentCancellationReason, Z as VerifyContext, $ as VerifyFailureContext, _ as VerifyResultContext, ap as checkIfBazaarNeeded, G as getFacilitatorResponseError, w as withPrivateCacheControl, x as x402HTTPResourceServer, W as x402ResourceServer } from '../x402Client-C7_OogbK.js';
export { a as attachBackgroundInitHandler, i as isFatalStartupInitError } from '../backgroundInit-CJlb-S48.js';

/**
 * SDK-only ATM key for schemes with no on-wire assetTransferMethod.
 * Never emit `assetTransferMethod: "default"` on the 402 wire.
 */
declare const SDK_DEFAULT_ASSET_TRANSFER_METHOD = "default";
/**
 * Closed set of payment-flow phase tables.
 *
 * Multi-settle flows (`escrow`) invoke settle lifecycle hooks once per settle.
 * Authors of side-effecting `beforeSettle` / `afterSettle` hooks should branch on
 * {@link SettleContext.phase} when used with those flows.
 */
declare const PAYMENT_FLOWS: Record<PaymentFlowName, PaymentFlowPhases>;
/**
 * Resolve assetTransferMethod and paymentFlow from a scheme table and requirements.
 *
 * Omit ATM → `scheme.defaultAssetTransferMethod`. Omit paymentFlow → that ATM's table default.
 * Unsupported ATM or flow throws.
 *
 * @param scheme - Scheme declaring default ATM and per-ATM paymentFlows
 * @param requirements - Payment requirements (possibly omitting ATM / paymentFlow)
 * @returns Resolved ATM and payment flow
 */
declare function resolvePaymentFlow(scheme: Pick<SchemeNetworkServer, "defaultAssetTransferMethod" | "paymentFlows" | "scheme">, requirements: DeepReadonly<PaymentRequirements>): {
    assetTransferMethod: string;
    paymentFlow: PaymentFlowName;
};
/**
 * Apply resolved payment-flow rules to 402 `extra`:
 * - Strip the SDK ATM sentinel `"default"` (never on the wire).
 * - When resolved flow is not `authorization`, set `extra.paymentFlow` so clients
 *   can distinguish trust models without scheme-specific knowledge.
 *
 * @param extra - Current requirements extra
 * @param resolved - Result of {@link resolvePaymentFlow}
 * @param resolved.assetTransferMethod - Resolved asset transfer method
 * @param resolved.paymentFlow - Resolved payment flow name
 * @returns New extra object with wire rules applied
 */
declare function applyPaymentFlowWireExtra(extra: Record<string, unknown>, resolved: {
    assetTransferMethod: string;
    paymentFlow: PaymentFlowName;
}): Record<string, unknown>;
/**
 * Resolve the phase table for a payment flow name.
 *
 * @param flow - Declared or default payment flow name
 * @returns Phase flags for verify/settle orchestration
 * @throws Error when `flow` is not one of the defined payment flows
 */
declare function resolvePaymentFlowPhases(flow: PaymentFlowName): PaymentFlowPhases;
/**
 * Resolve the settlement receipt to surface when a resource handler fails
 * after payment was already verified (and possibly settled before the handler).
 *
 * Prefers cancel/refund settle when present; on failed cancel, attaches deposit
 * recovery facts in `extra`. Otherwise echoes the before-handler deposit receipt.
 *
 * @param cancelSettlement - Result from {@link PaymentCancellationDispatcher.cancel}, if any
 * @param beforeHandlerSettlement - Completed before-handler settle, when present
 * @param beforeHandlerSettlement.result - Settle response from the before-handler deposit
 * @param paymentPayload - Client payment payload (for escrow deposit recovery fields)
 * @returns Settle response for PAYMENT-RESPONSE / MCP payment-response meta, or undefined
 */
declare function resolveFailurePathSettlement(cancelSettlement: SettleResponse | void | undefined, beforeHandlerSettlement?: {
    result: SettleResponse;
}, paymentPayload?: PaymentPayload): SettleResponse | undefined;

/**
 * True when a string field is treated as unset and may be filled by `enrichPaymentRequiredResponse`.
 *
 * @param value - Candidate string from `PaymentRequirements` (e.g. `payTo`, `amount`, `asset`)
 * @returns Whether the field counts as vacant (empty or whitespace-only)
 */
declare function isVacantStringField(value: string): boolean;
/**
 * Deep snapshot of `accepts` entries before any `enrichPaymentRequiredResponse` runs.
 *
 * @param requirements - Payment requirement rows to clone
 * @returns Cloned requirements suitable as an immutable baseline for policy checks
 */
declare function snapshotPaymentRequirementsList(requirements: PaymentRequirements[]): PaymentRequirements[];
/**
 * After extension enrichment, each `accepts[i]` must still match the baseline except that
 * **`payTo`**, **`amount`**, and **`asset`** may change only when the baseline value is vacant
 * (whitespace-only string). **`scheme`**, **`network`**, and **`maxTimeoutSeconds`** are never
 * writable by extensions. **`extra`** may gain new keys; values for keys present in the baseline
 * must be unchanged (deep-equal). **`extra.paymentFlow`** and **`extra.assetTransferMethod`**
 * are protocol-reserved: their presence and values must match the baseline (enrichment must
 * not add or rewrite them).
 *
 * @param baseline - Snapshot taken before any enrich hooks for this response
 * @param current - Live `accepts` entries after an extension enrich step
 * @param extensionKey - Registered extension key (for error messages)
 * @returns Nothing; throws if the policy is violated
 */
declare function assertAcceptsAllowlistedAfterExtensionEnrich(baseline: PaymentRequirements[], current: PaymentRequirements[], extensionKey: string): void;
/**
 * Ensures scheme 402 enrichment only adds `extra` keys to matching accepts.
 * **`extra.paymentFlow`** and **`extra.assetTransferMethod`** are protocol-reserved on every
 * accept: their presence and values must match the baseline (enrichment must not add or
 * rewrite them).
 *
 * @param baseline - Snapshot before the scheme enrich step
 * @param current - Live `accepts` entries after scheme enrichment
 * @param scheme - Scheme whose hook was invoked
 * @param network - Network whose hook was invoked
 */
declare function assertAcceptsAdditiveExtraAfterSchemeEnrich(baseline: PaymentRequirements[], current: PaymentRequirements[], scheme: string, network: string): void;
/**
 * Immutable subset of {@link SettleResponse} compared across settlement extension enrich.
 */
type SettleResponseCoreSnapshot = Pick<SettleResponse, "success" | "transaction" | "network" | "amount" | "payer" | "errorReason" | "errorMessage">;
/**
 * Captures facilitator-settled fields that extensions must not rewrite.
 *
 * @param result - Settlement response from the facilitator
 * @returns Plain snapshot of core fields for later comparison
 */
declare function snapshotSettleResponseCore(result: SettleResponse): SettleResponseCoreSnapshot;
/**
 * Ensures `enrichSettlementResponse` did not rewrite facilitator outcome fields; only
 * `extensions` may be populated via the merger (in addition to in-place adds on `extensions`).
 *
 * @param before - Snapshot taken before extension settlement enrich
 * @param after - Live settlement result after an extension enrich step
 * @param extensionKey - Registered extension key (for error messages)
 * @returns Nothing; throws if a core field changed
 */
declare function assertSettleResponseCoreUnchanged(before: SettleResponseCoreSnapshot, after: SettleResponse, extensionKey: string): void;
/**
 * Ensures scheme settlement-payload enrichment only adds server-owned fields.
 *
 * @param payload - Existing scheme payload before enrichment
 * @param enrichment - Fields returned by the scheme enrichment hook
 * @param callerLabel - Hook source label used in policy error messages
 */
declare function assertAdditivePayloadEnrichment(payload: Record<string, unknown>, enrichment: Record<string, unknown>, callerLabel: string): void;
/**
 * Ensures scheme response enrichment only adds new `extra` fields, including nested fields
 * below existing objects.
 *
 * @param extra - Existing settlement extra fields
 * @param enrichment - Fields returned by the scheme response enrichment hook
 * @param callerLabel - Hook label used in policy error messages
 */
declare function assertAdditiveSettlementExtra(extra: Record<string, unknown>, enrichment: Record<string, unknown>, callerLabel: string): void;

export { PAYMENT_FLOWS, PaymentFlowName, PaymentFlowPhases, SDK_DEFAULT_ASSET_TRANSFER_METHOD, type SettleResponseCoreSnapshot, applyPaymentFlowWireExtra, assertAcceptsAdditiveExtraAfterSchemeEnrich, assertAcceptsAllowlistedAfterExtensionEnrich, assertAdditivePayloadEnrichment, assertAdditiveSettlementExtra, assertSettleResponseCoreUnchanged, isVacantStringField, resolveFailurePathSettlement, resolvePaymentFlow, resolvePaymentFlowPhases, snapshotPaymentRequirementsList, snapshotSettleResponseCore };
