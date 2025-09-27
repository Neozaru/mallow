import { arbitrum, avalanche, base, bsc, gnosis, mainnet, optimism, plasma, polygon, scroll, zksync } from 'viem/chains';

export const aaveChainNames = {
  [mainnet.id]: 'mainnet',
  [optimism.id]: 'optimism',
  [arbitrum.id]: 'arbitrum',
  [zksync.id]: 'zksync',
  [base.id]: 'base',
  [polygon.id]: 'polygon',
  [gnosis.id]: 'gnosis',
  [scroll.id]: 'scroll',
  [avalanche.id]: 'avalanche',
  [bsc.id]: 'bnb',
  [plasma.id]: 'plasma',
}
