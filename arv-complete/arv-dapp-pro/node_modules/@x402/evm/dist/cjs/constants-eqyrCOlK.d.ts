/** V1 legacy network name → EVM chain ID. */
declare const EVM_NETWORK_CHAIN_ID_MAP: {
    readonly ethereum: 1;
    readonly sepolia: 11155111;
    readonly abstract: 2741;
    readonly "abstract-testnet": 11124;
    readonly "base-sepolia": 84532;
    readonly base: 8453;
    readonly "avalanche-fuji": 43113;
    readonly avalanche: 43114;
    readonly iotex: 4689;
    readonly sei: 1329;
    readonly "sei-testnet": 1328;
    readonly polygon: 137;
    readonly "polygon-amoy": 80002;
    readonly peaq: 3338;
    readonly story: 1514;
    readonly educhain: 41923;
    readonly "skale-base-sepolia": 324705682;
    readonly megaeth: 4326;
    readonly monad: 143;
    readonly "monad-testnet": 10143;
    readonly stable: 988;
    readonly "stable-testnet": 2201;
    readonly celo: 42220;
    readonly flare: 14;
};
type EvmNetworkV1 = keyof typeof EVM_NETWORK_CHAIN_ID_MAP;
declare const NETWORKS: string[];
/**
 * Extract chain ID from a v1 legacy network name.
 *
 * @param network - The v1 network name (e.g., "base-sepolia", "polygon")
 * @returns The numeric chain ID
 * @throws Error if the network name is not a known v1 network
 */
declare function getEvmChainIdV1(network: string): number;
declare const authorizationTypes: {
    readonly TransferWithAuthorization: readonly [{
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "value";
        readonly type: "uint256";
    }, {
        readonly name: "validAfter";
        readonly type: "uint256";
    }, {
        readonly name: "validBefore";
        readonly type: "uint256";
    }, {
        readonly name: "nonce";
        readonly type: "bytes32";
    }];
};
/**
 * Permit2 EIP-712 types for signing PermitWitnessTransferFrom (exact scheme).
 * Must match the exact format expected by the Permit2 contract.
 * Note: Types must be in ALPHABETICAL order after the primary type (TokenPermissions < Witness).
 */
declare const permit2WitnessTypes: {
    readonly PermitWitnessTransferFrom: readonly [{
        readonly name: "permitted";
        readonly type: "TokenPermissions";
    }, {
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly name: "nonce";
        readonly type: "uint256";
    }, {
        readonly name: "deadline";
        readonly type: "uint256";
    }, {
        readonly name: "witness";
        readonly type: "Witness";
    }];
    readonly TokenPermissions: readonly [{
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly Witness: readonly [{
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "validAfter";
        readonly type: "uint256";
    }];
};
/**
 * Permit2 EIP-712 types for signing PermitWitnessTransferFrom (upto scheme).
 * The upto witness includes a `facilitator` field that the exact witness does not.
 * This ensures only the authorized facilitator can settle the payment.
 * Must match: Witness(address to,address facilitator,uint256 validAfter)
 */
declare const uptoPermit2WitnessTypes: {
    readonly PermitWitnessTransferFrom: readonly [{
        readonly name: "permitted";
        readonly type: "TokenPermissions";
    }, {
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly name: "nonce";
        readonly type: "uint256";
    }, {
        readonly name: "deadline";
        readonly type: "uint256";
    }, {
        readonly name: "witness";
        readonly type: "Witness";
    }];
    readonly TokenPermissions: readonly [{
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly Witness: readonly [{
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "facilitator";
        readonly type: "address";
    }, {
        readonly name: "validAfter";
        readonly type: "uint256";
    }];
};
declare const eip3009ABI: readonly [{
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "value";
        readonly type: "uint256";
    }, {
        readonly name: "validAfter";
        readonly type: "uint256";
    }, {
        readonly name: "validBefore";
        readonly type: "uint256";
    }, {
        readonly name: "nonce";
        readonly type: "bytes32";
    }, {
        readonly name: "v";
        readonly type: "uint8";
    }, {
        readonly name: "r";
        readonly type: "bytes32";
    }, {
        readonly name: "s";
        readonly type: "bytes32";
    }];
    readonly name: "transferWithAuthorization";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "value";
        readonly type: "uint256";
    }, {
        readonly name: "validAfter";
        readonly type: "uint256";
    }, {
        readonly name: "validBefore";
        readonly type: "uint256";
    }, {
        readonly name: "nonce";
        readonly type: "bytes32";
    }, {
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly name: "transferWithAuthorization";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "version";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "name";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "authorizer";
        readonly type: "address";
    }, {
        readonly name: "nonce";
        readonly type: "bytes32";
    }];
    readonly name: "authorizationState";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
/** ERC-20 allowance(address,address) ABI for checking spender approval. */
declare const erc20AllowanceAbi: readonly [{
    readonly type: "function";
    readonly name: "allowance";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "spender";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}];
/**
 * Canonical Permit2 contract address.
 * Same address on all EVM chains via CREATE2 deployment.
 *
 * @see https://github.com/Uniswap/permit2
 */
declare const PERMIT2_ADDRESS: "0x000000000022D473030F116dDEE9F6B43aC78BA3";
/**
 * x402ExactPermit2Proxy contract address.
 * Vanity address: 0x4020...0001 for easy recognition.
 * This address is deterministic based on:
 * - Arachnid's deterministic deployer (0x4e59b44847b379578588920cA78FbF26c0B4956C)
 * - Vanity-mined salt for prefix 0x4020 and suffix 0001
 * - Contract bytecode + constructor args (PERMIT2_ADDRESS)
 */
declare const x402ExactPermit2ProxyAddress: "0x402085c248EeA27D92E8b30b2C58ed07f9E20001";
/**
 * x402UptoPermit2Proxy contract address.
 * Vanity address: 0x4020...0002 for easy recognition.
 * This address is deterministic based on:
 * - Arachnid's deterministic deployer (0x4e59b44847b379578588920cA78FbF26c0B4956C)
 * - Vanity-mined salt for prefix 0x4020 and suffix 0002
 * - Contract bytecode + constructor args (PERMIT2_ADDRESS)
 */
declare const x402UptoPermit2ProxyAddress: "0x4020A4f3b7b90ccA423B9fabCc0CE57C6C240002";
/**
 * x402UptoPermit2Proxy ABI — settle/settleWithPermit for the upto payment scheme.
 * Key differences from exact: settle() takes a `uint256 amount` parameter, and the
 * Witness struct includes an `address facilitator` field.
 */
declare const x402UptoPermit2ProxyABI: readonly [{
    readonly type: "function";
    readonly name: "PERMIT2";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ISignatureTransfer";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITNESS_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITNESS_TYPE_STRING";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "settle";
    readonly inputs: readonly [{
        readonly name: "permit";
        readonly type: "tuple";
        readonly internalType: "struct ISignatureTransfer.PermitTransferFrom";
        readonly components: readonly [{
            readonly name: "permitted";
            readonly type: "tuple";
            readonly internalType: "struct ISignatureTransfer.TokenPermissions";
            readonly components: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "witness";
        readonly type: "tuple";
        readonly internalType: "struct x402UptoPermit2Proxy.Witness";
        readonly components: readonly [{
            readonly name: "to";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "facilitator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "validAfter";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "settleWithPermit";
    readonly inputs: readonly [{
        readonly name: "permit2612";
        readonly type: "tuple";
        readonly internalType: "struct x402UptoPermit2Proxy.EIP2612Permit";
        readonly components: readonly [{
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "r";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "s";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "v";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }];
    }, {
        readonly name: "permit";
        readonly type: "tuple";
        readonly internalType: "struct ISignatureTransfer.PermitTransferFrom";
        readonly components: readonly [{
            readonly name: "permitted";
            readonly type: "tuple";
            readonly internalType: "struct ISignatureTransfer.TokenPermissions";
            readonly components: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "witness";
        readonly type: "tuple";
        readonly internalType: "struct x402UptoPermit2Proxy.Witness";
        readonly components: readonly [{
            readonly name: "to";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "facilitator";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "validAfter";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "Settled";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SettledWithPermit";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AmountExceedsPermitted";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidDestination";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidOwner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidPermit2Address";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PaymentTooEarly";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "Permit2612AmountMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ReentrancyGuardReentrantCall";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "UnauthorizedFacilitator";
    readonly inputs: readonly [];
}];
/**
 * x402ExactPermit2Proxy ABI - settle function for exact payment scheme.
 */
declare const x402ExactPermit2ProxyABI: readonly [{
    readonly type: "function";
    readonly name: "PERMIT2";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract ISignatureTransfer";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITNESS_TYPEHASH";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITNESS_TYPE_STRING";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "settle";
    readonly inputs: readonly [{
        readonly name: "permit";
        readonly type: "tuple";
        readonly internalType: "struct ISignatureTransfer.PermitTransferFrom";
        readonly components: readonly [{
            readonly name: "permitted";
            readonly type: "tuple";
            readonly internalType: "struct ISignatureTransfer.TokenPermissions";
            readonly components: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "witness";
        readonly type: "tuple";
        readonly internalType: "struct x402ExactPermit2Proxy.Witness";
        readonly components: readonly [{
            readonly name: "to";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "validAfter";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "settleWithPermit";
    readonly inputs: readonly [{
        readonly name: "permit2612";
        readonly type: "tuple";
        readonly internalType: "struct x402ExactPermit2Proxy.EIP2612Permit";
        readonly components: readonly [{
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "r";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "s";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "v";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }];
    }, {
        readonly name: "permit";
        readonly type: "tuple";
        readonly internalType: "struct ISignatureTransfer.PermitTransferFrom";
        readonly components: readonly [{
            readonly name: "permitted";
            readonly type: "tuple";
            readonly internalType: "struct ISignatureTransfer.TokenPermissions";
            readonly components: readonly [{
                readonly name: "token";
                readonly type: "address";
                readonly internalType: "address";
            }, {
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            }];
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "witness";
        readonly type: "tuple";
        readonly internalType: "struct x402ExactPermit2Proxy.Witness";
        readonly components: readonly [{
            readonly name: "to";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "validAfter";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }];
    }, {
        readonly name: "signature";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "Settled";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SettledWithPermit";
    readonly inputs: readonly [];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "InvalidAmount";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidDestination";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidOwner";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidPermit2Address";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PaymentTooEarly";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "Permit2612AmountMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ReentrancyGuardReentrantCall";
    readonly inputs: readonly [];
}];

export { EVM_NETWORK_CHAIN_ID_MAP as E, NETWORKS as N, PERMIT2_ADDRESS as P, type EvmNetworkV1 as a, x402UptoPermit2ProxyAddress as b, authorizationTypes as c, eip3009ABI as d, erc20AllowanceAbi as e, x402ExactPermit2ProxyABI as f, getEvmChainIdV1 as g, x402UptoPermit2ProxyABI as h, permit2WitnessTypes as p, uptoPermit2WitnessTypes as u, x402ExactPermit2ProxyAddress as x };
