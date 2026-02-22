import { arbitrum, avalanche, base, gnosis, linea, mainnet, optimism, polygon, zksync } from 'viem/chains'

const stablecoinAddresses = [
  {
    symbol: 'USDC',
    addresses: {
      [mainnet.id]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [optimism.id]: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      [arbitrum.id]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      [zksync.id]: '0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4',
      [gnosis.id]: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      [base.id]: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      [polygon.id]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      [linea.id]: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    }
  },
  {
    symbol: 'USDT',
    addresses: {
      [mainnet.id]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [linea.id]: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
    }
  },
  {
    symbol: 'USDT0',
    addresses: {
      // [polygon.id ]:'0xc2132D05D31c914A87C6611C10748AEb04B58e8F', // For some reason crashes the multicall.
    }
  },
  {
    symbol: 'USD₮0',
    addresses: {
      [arbitrum.id]:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      [optimism.id]:'0x01bFF41798a0BcF287b996046Ca68b395DbC1071',
    }
  },
  {
    symbol: 'DAI',
    addresses: {
      [mainnet.id]: '0x6b175474e89094c44da98b954eedeac495271d0f',
      [gnosis.id]: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    }
  },
  {
    symbol: 'USDS',
    addresses: {
      [mainnet.id]: '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
      [base.id]: '0x820c137fa70c8691f0e44dc420a5e53c168921dc'
    }
  },
  {
    symbol: 'EURe',
    addresses: {
      [mainnet.id]: '0x39b8b6385416f4ca36a20319f70d28621895279d',
      [gnosis.id]: '0xcb444e90d8198415266c6a2724b7900fb12fc56e',
      [polygon.id]: '0xe0aea583266584dafbb3f9c3211d5588c73fea8d',
      [arbitrum.id]: '0x0c06ccf38114ddfc35e07427b9424adcca9f44f8'
    }
  },
  {
    symbol: 'EURC',
    addresses: {
      [mainnet.id]: '0x1abaea1f7c830bd89acc67ec4af516284b1bc33c',
      [base.id]: '0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42',
      [avalanche.id]: '0xc891eb4cbdeff6e073e859e987815ed1505c2acd',
    }
  },
  {
    symbol: 'JPYC',
    addresses: {
      [mainnet.id]: '0xE7C3D8C9a439feDe00D2600032D5dB0Be71C3c29',
      [polygon.id]: '0xE7C3D8C9a439feDe00D2600032D5dB0Be71C3c29',
      [avalanche.id]: '0xE7C3D8C9a439feDe00D2600032D5dB0Be71C3c29',
    }
  },
]

export default stablecoinAddresses
