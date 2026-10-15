/**
 * Whether a resource-server initialize() failure is a permanent misconfiguration.
 *
 * Transient facilitator timeouts stay retryable on the next protected request.
 * Capability and route mismatches will not become valid later and must not
 * leave the process listening.
 *
 * @param error - The initialize() rejection reason
 * @returns True when the process should exit rather than retry
 */
declare function isFatalStartupInitError(error: unknown): boolean;
/**
 * Attaches a handler to the eager initialize() promise started by HTTP adapters.
 *
 * Retryable failures are swallowed so they are not unhandled rejections; the
 * original promise is still awaited on the first protected request. Fatal
 * configuration errors exit the process immediately.
 *
 * @param initPromise - The in-flight initialize() promise, or null when unused
 */
declare function attachBackgroundInitHandler(initPromise: Promise<void> | null): void;

export { attachBackgroundInitHandler as a, isFatalStartupInitError as i };
