const chainIdToName = {
  1: 'Ethereum',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  56: 'BNB Chain',
  137: 'Polygon PoS',
  250: 'Fantom Opera',
  43114: 'Avalanche',
  42220: 'Celo',
  128: 'HECO',
  1287: 'Moonbeam',
  42161: 'Arbitrum One',
  10: 'Optimism',
  25: 'Cronos',
  40: 'Klaytn',
  2222: 'Aurora',
  97: 'BNB Chain Testnet',
  80001: 'Polygon Mumbai Testnet',
  421613: 'Arbitrum Rinkeby Testnet',
  1313161554: 'Optimism Goerli Testnet',
  122: 'Fantom Testnet',
  534352: 'Scroll',
  8453: 'Base',
  100: 'Gnosis',
  324: 'ZkSync'
  // Add more chains as needed
}

const getChainName = chainId => {
  return chainId
  ? chainIdToName[chainId] || `Chain ${chainId}`
  : ''
}

export default getChainName
