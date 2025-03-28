import { arbitrum, avalanche, base, berachain, bsc, celo, fraxtal, linea, mainnet, metis, optimism, polygon, scroll, sei, sonic, zksync } from 'viem/chains'
import isChainEnabled from './isChainEnabled'

const beefyNameToChainId = {
  'ethereum': mainnet.id,
  'arbitrum': arbitrum.id,
  'optimism': optimism.id,
  'base': base.id,
  'zksync': zksync.id,
  'scroll': scroll.id,
  'polygon': polygon.id,
  'sonic': sonic.id,
  'linea': linea.id,
  'avalanche': avalanche.id,
  'bsc': bsc.id,
  'berachain': berachain.id,
  'celo': celo.id,
  'fraxtal': fraxtal.id,
  'metis': metis.id,
  'sei': sei.id
} 

const getChainIdFromBeefyName = beefyChainName => {
  const chainId = beefyNameToChainId[beefyChainName]
  if (chainId && isChainEnabled(chainId)) {
    return chainId
  }
}

export default getChainIdFromBeefyName
