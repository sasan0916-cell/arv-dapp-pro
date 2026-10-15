import { e as erc20AllowanceAbi } from './constants-eqyrCOlK.mjs';

/**
 * Creates transaction data to approve Permit2 to spend tokens.
 * The user sends this transaction (paying gas) before using Permit2 flow.
 *
 * @param tokenAddress - The ERC20 token contract address
 * @returns Transaction data to send for approval
 *
 * @example
 * ```typescript
 * const tx = createPermit2ApprovalTx("0x...");
 * await walletClient.sendTransaction({
 *   to: tx.to,
 *   data: tx.data,
 * });
 * ```
 */
declare function createPermit2ApprovalTx(tokenAddress: `0x${string}`): {
    to: `0x${string}`;
    data: `0x${string}`;
};
/**
 * Parameters for checking Permit2 allowance.
 * Application provides these to check if approval is needed.
 */
interface Permit2AllowanceParams {
    tokenAddress: `0x${string}`;
    ownerAddress: `0x${string}`;
}
/**
 * Returns contract read parameters for checking Permit2 allowance.
 * Use with a public client to check if the user has approved Permit2.
 *
 * @param params - The allowance check parameters
 * @returns Contract read parameters for checking allowance
 *
 * @example
 * ```typescript
 * const readParams = getPermit2AllowanceReadParams({
 *   tokenAddress: "0x...",
 *   ownerAddress: "0x...",
 * });
 *
 * const allowance = await publicClient.readContract(readParams);
 * const needsApproval = allowance < requiredAmount;
 * ```
 */
declare function getPermit2AllowanceReadParams(params: Permit2AllowanceParams): {
    address: `0x${string}`;
    abi: typeof erc20AllowanceAbi;
    functionName: "allowance";
    args: [`0x${string}`, `0x${string}`];
};

export { type Permit2AllowanceParams as P, createPermit2ApprovalTx as c, getPermit2AllowanceReadParams as g };
