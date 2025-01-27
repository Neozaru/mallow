const stablecoinAddresses = [
  {
    symbol: 'USDC',
    addresses: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',    // Ethereum Mainnet
      10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',   // Optimism
      42161: '0xFF970A61A04b1ca14834A43f5de4533ebDdb5CC8', // Arbitrum
      534352: '0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4', // Scroll (Address not yet live)
      324: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',   // zkSync
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',   // Gnosis
      8453: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',   // Base,
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' // Polygon
    }
  },
  {
    symbol: 'USDT',
    addresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',    // Ethereum Mainnet
      10: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',   // Optimism (uses bridged USDC)
      42161: '0xFD086bB5286E58aD85A6F309f083c14d2D0A17ab', // Arbitrum
      534352: '0xf55bec9cafdbe8730f096aa55dad6d22d44099df', // Scroll (Address not yet live)
      324: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C', // zkSync (USDT address currently unavailable)
      100: '0x4ecaba5870353805a9f068101a40e0f32ed605c6', // Gnosis (USDT address unavailable)
      8453: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', // Base (USDT address unavailable)
      137: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' // Polygon
    }
  },
  {
    symbol: 'DAI',
    addresses: {
      1: '0x6B175474E89094C44Da98b954EedeAC495271d0F',    // Ethereum Mainnet
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',   // Optimism
      42161: '0xDA10009cBD5D07Dd0CeCc66161FC93D7c9000da1', // Arbitrum
      534352: '0xca77eb3fefe3725dc33bccb54edefc3d9f764f97', // Scroll (Address not yet live)
      324: '0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656', // zkSync (DAI address currently unavailable)
      100: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',   // Gnosis
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
  }
]


export default stablecoinAddresses