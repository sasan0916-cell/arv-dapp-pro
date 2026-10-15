import {
  createPermit2PayloadForProxy
} from "./chunk-XP6HEYCL.mjs";
import {
  PERMIT2_ADDRESS,
  erc20AllowanceAbi,
  erc20ApproveAbi,
  x402ExactPermit2ProxyAddress
} from "./chunk-GPMYUGHX.mjs";

// src/exact/client/permit2.ts
import { encodeFunctionData, getAddress } from "viem";
var MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
async function createPermit2Payload(signer, x402Version, paymentRequirements) {
  return createPermit2PayloadForProxy(
    x402ExactPermit2ProxyAddress,
    signer,
    x402Version,
    paymentRequirements
  );
}
function createPermit2ApprovalTx(tokenAddress) {
  const data = encodeFunctionData({
    abi: erc20ApproveAbi,
    functionName: "approve",
    args: [PERMIT2_ADDRESS, MAX_UINT256]
  });
  return {
    to: getAddress(tokenAddress),
    data
  };
}
function getPermit2AllowanceReadParams(params) {
  return {
    address: getAddress(params.tokenAddress),
    abi: erc20AllowanceAbi,
    functionName: "allowance",
    args: [getAddress(params.ownerAddress), PERMIT2_ADDRESS]
  };
}

export {
  createPermit2Payload,
  createPermit2ApprovalTx,
  getPermit2AllowanceReadParams
};
//# sourceMappingURL=chunk-OR6TZGCV.mjs.map