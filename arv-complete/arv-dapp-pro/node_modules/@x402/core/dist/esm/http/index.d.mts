import { P as PaymentPayload, a as PaymentRequired, S as SettleResponse } from '../x402Client-C7_OogbK.mjs';
export { C as CompiledRoute, D as DynamicPayTo, j as DynamicPrice, E as FacilitatorCapabilityError, F as FacilitatorClient, z as FacilitatorConfig, A as FacilitatorResponseError, B as FacilitatorTimeoutError, H as HTTPAdapter, y as HTTPFacilitatorClient, e as HTTPProcessResult, b as HTTPRequestContext, s as HTTPResourceServerExtensionHooks, k as HTTPResponseBody, d as HTTPResponseInstructions, c as HTTPTransportContext, v as PAYMENT_REQUIRED_CACHE_CONTROL, h as PaymentOption, f as PaywallConfig, g as PaywallProvider, o as ProcessSettleFailureResponse, m as ProcessSettleResultResponse, n as ProcessSettleSuccessResponse, r as ProtectedRequestHook, t as ResourceServerTransportExtensionHooks, R as RouteConfig, q as RouteConfigurationError, p as RouteValidationError, i as RoutesConfig, u as SETTLEMENT_OVERRIDES_HEADER, l as SettlementFailedResponseBody, U as UnpaidResponseBody, G as getFacilitatorResponseError, w as withPrivateCacheControl, x as x402HTTPResourceServer } from '../x402Client-C7_OogbK.mjs';
export { a as attachBackgroundInitHandler, i as isFatalStartupInitError } from '../backgroundInit-CJlb-S48.mjs';
export { HTTPClientExtensionHooks, HTTPPaymentStatus, HTTPResourceResponse, PaymentRequiredContext, PaymentRequiredHook, x402HTTPClient } from '../client/index.mjs';

type QueryParamMethods = "GET" | "HEAD" | "DELETE";
type BodyMethods = "POST" | "PUT" | "PATCH";
/**
 * Encodes a payment payload as a base64 header value.
 *
 * @param paymentPayload - The payment payload to encode
 * @returns Base64 encoded string representation of the payment payload
 */
declare function encodePaymentSignatureHeader(paymentPayload: PaymentPayload): string;
/**
 * Decodes a base64 payment signature header into a payment payload.
 *
 * @param paymentSignatureHeader - The base64 encoded payment signature header
 * @returns The decoded payment payload
 */
declare function decodePaymentSignatureHeader(paymentSignatureHeader: string): PaymentPayload;
/**
 * Encodes a payment required object as a base64 header value.
 *
 * @param paymentRequired - The payment required object to encode
 * @returns Base64 encoded string representation of the payment required object
 */
declare function encodePaymentRequiredHeader(paymentRequired: PaymentRequired): string;
/**
 * Decodes a base64 payment required header into a payment required object.
 *
 * @param paymentRequiredHeader - The base64 encoded payment required header
 * @returns The decoded payment required object
 */
declare function decodePaymentRequiredHeader(paymentRequiredHeader: string): PaymentRequired;
/**
 * Encodes a payment response as a base64 header value.
 *
 * @param paymentResponse - The payment response to encode
 * @returns Base64 encoded string representation of the payment response
 */
declare function encodePaymentResponseHeader(paymentResponse: SettleResponse): string;
/**
 * Decodes a base64 payment response header into a settle response.
 *
 * @param paymentResponseHeader - The base64 encoded payment response header
 * @returns The decoded settle response
 */
declare function decodePaymentResponseHeader(paymentResponseHeader: string): SettleResponse;

export { type BodyMethods, type QueryParamMethods, decodePaymentRequiredHeader, decodePaymentResponseHeader, decodePaymentSignatureHeader, encodePaymentRequiredHeader, encodePaymentResponseHeader, encodePaymentSignatureHeader };
