// src/multicall.ts
import { encodeFunctionData, decodeFunctionResult } from "viem";
var MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";
var multicall3ABI = [
  {
    inputs: [
      { name: "requireSuccess", type: "bool" },
      {
        name: "calls",
        type: "tuple[]",
        components: [
          { name: "target", type: "address" },
          { name: "callData", type: "bytes" }
        ]
      }
    ],
    name: "tryAggregate",
    outputs: [
      {
        name: "returnData",
        type: "tuple[]",
        components: [
          { name: "success", type: "bool" },
          { name: "returnData", type: "bytes" }
        ]
      }
    ],
    stateMutability: "payable",
    type: "function"
  }
];
async function multicall(readContract, calls) {
  const aggregateCalls = calls.map((call) => {
    if ("callData" in call) {
      return { target: call.address, callData: call.callData };
    }
    const callData = encodeFunctionData({
      abi: call.abi,
      functionName: call.functionName,
      args: call.args
    });
    return { target: call.address, callData };
  });
  const rawResults = await readContract({
    address: MULTICALL3_ADDRESS,
    abi: multicall3ABI,
    functionName: "tryAggregate",
    args: [false, aggregateCalls]
  });
  return rawResults.map((raw, i) => {
    if (!raw.success) {
      return {
        status: "failure",
        error: new Error(`multicall: call reverted (returnData: ${raw.returnData})`)
      };
    }
    const call = calls[i];
    if ("callData" in call) {
      return { status: "success", result: void 0 };
    }
    try {
      const decoded = decodeFunctionResult({
        abi: call.abi,
        functionName: call.functionName,
        data: raw.returnData
      });
      return { status: "success", result: decoded };
    } catch (err) {
      return {
        status: "failure",
        error: err instanceof Error ? err : new Error(String(err))
      };
    }
  });
}

export {
  multicall
};
//# sourceMappingURL=chunk-VS3RYAYE.mjs.map