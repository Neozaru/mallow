const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "registryAddress",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "fromPool",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "toPool",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Migrated",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "baseAssetAddress",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "fromProtocol",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "toProtocol",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "fromPool",
        type: "address"
      },
      {
        internalType: "address",
        name: "toPool",
        type: "address"
      },
      {
        internalType: "address",
        name: "fromLpTokenAddress",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "fromLpTokenAmount",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "toLpTokenAddress",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "minToLpTokenAmount",
        type: "uint256"
      }
    ],
    name: "executeOperation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "baseAssetAddress",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "fromProtocol",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "toProtocol",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "fromPool",
        type: "address"
      },
      {
        internalType: "address",
        name: "toPool",
        type: "address"
      },
      {
        internalType: "address",
        name: "fromLpTokenAddress",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "fromLpTokenAmount",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "toLpTokenAddress",
        type: "address"
      }
    ],
    name: "previewExecuteOperation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "toLpTokenAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "baseAssetAmount",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const

export default abi
