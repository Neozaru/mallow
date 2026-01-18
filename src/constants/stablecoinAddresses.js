import { arbitrum, avalanche, base, gnosis, linea, mainnet, polygon } from 'viem/chains'

// TODO: Use <chain>.id everywhere for consistency
const stablecoinAddresses = [
  {
    symbol: 'USDC',
    addresses: {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',    // Ethereum Mainnet
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',   // Optimism
      42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum
      534352: '0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4', // Scroll (Address not yet live)
      324: '0x1d17cbcf0d6d143135ae902365d2e5e2a16538d4',   // zkSync
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',   // Gnosis
      8453: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',   // Base
      137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Polygon
      [linea.id]: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    }
  },
  {
    symbol: 'USDT',
    addresses: {
      1: '0xdac17f958d2ee523a2206206994597c13d831ec7',    // Ethereum Mainnet
      10: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',   // Optimism (uses bridged USDC)
      42161: '0xfd086bb5286e58ad85a6f309f083c14d2d0a17ab', // Arbitrum
      534352: '0xf55bec9cafdbe8730f096aa55dad6d22d44099df', // Scroll (Address not yet live)
      324: '0x493257fd37edb34451f62edf8d2a0c418852ba4c', // zkSync (USDT address currently unavailable)
      100: '0x4ecaba5870353805a9f068101a40e0f32ed605c6', // Gnosis (USDT address unavailable)
      8453: '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2', // Base (USDT address unavailable)
      137: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // Polygon
      [linea.id]: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
    }
  },
  {
    symbol: 'DAI',
    addresses: {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f',    // Ethereum Mainnet
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',   // Optimism
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // Arbitrum
      534352: '0xca77eb3fefe3725dc33bccb54edefc3d9f764f97', // Scroll (Address not yet live)
      324: '0x4b9eb6c0b6ea15176bbf62841c6b2a8a398cb656', // zkSync (DAI address currently unavailable)
      100: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',   // Gnosis
      8453: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',  // Base (DAI address unavailable)
      137: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // Polygon
    }
  },
  {
    symbol: 'USDS',
    addresses: {
      1: '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
      8453: '0x820c137fa70c8691f0e44dc420a5e53c168921dc'
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
  }
]

export default stablecoinAddresses
