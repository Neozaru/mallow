import { arbitrum, avalanche, base, linea, mainnet, optimism, polygon, scroll, sonic, zksync } from 'viem/chains'

const beefyNameToChainId = {
  'ethereum': [mainnet.id],
  'arbitrum': [arbitrum.id],
  'optimism': [optimism.id],
  'base': [base.id],
  'zksync': [zksync.id],
  'scroll': [scroll.id],
  'polygon': [polygon.id],
  'sonic': [sonic.id],
  'linea': [linea.id],
  'avalanche': [avalanche.id]
} 

const getChainIdFromBeefyName = beefyChainName => {
  return beefyNameToChainId[beefyChainName]
}

export default getChainIdFromBeefyName
