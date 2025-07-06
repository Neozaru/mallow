const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_acrossSpokePoolAddress",
        type: "address"
      },
      {
        internalType: "address",
        name: "_mallowManagerAddress",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "currentAllowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "requestedDecrease",
        type: "uint256"
      }
    ],
    name: "SafeERC20FailedDecreaseAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error"
  },
  {
    inputs: [],
    name: "acrossSpokePoolAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenSent",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "message",
        type: "bytes"
      }
    ],
    name: "handleV3AcrossMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "mallowManagerAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
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
            name: "fromPoolAddress",
            type: "address"
          },
          {
            internalType: "address",
            name: "toPoolAddress",
            type: "address"
          },
          {
            internalType: "address",
            name: "fromLpTokenAddress",
            type: "address"
          },
          {
            internalType: "address",
            name: "toLpTokenAddress",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "fromLpTokenAmount",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "toMinLpTokenAmount",
            type: "uint256"
          }
        ],
        internalType: "struct MallowTypes.ZapOperationBaseParams",
        name: "mallowParams",
        type: "tuple"
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "toChainId",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "toHandlerAddress",
            type: "address"
          },
          {
            internalType: "uint32",
            name: "quoteTimestamp",
            type: "uint32"
          },
          {
            internalType: "uint32",
            name: "fillDeadline",
            type: "uint32"
          },
          {
            internalType: "uint256",
            name: "totalAcrossFees",
            type: "uint256"
          }
        ],
        internalType: "struct MallowAcrossHandler.BridgeParams",
        name: "bridgeParams",
        type: "tuple"
      },
      {
        internalType: "address",
        name: "finalRecipient",
        type: "address"
      }
    ],
    name: "withdrawAndDepositV3",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

export default abi
