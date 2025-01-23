
const beefyNameToChainId = {
  'arbitrum': 42161,
  'ethereum': 1,
  'optimism': 10
} 

const getChainIdFromBeefyName = beefyChainName => {
  return beefyNameToChainId[beefyChainName]
}

export default getChainIdFromBeefyName
