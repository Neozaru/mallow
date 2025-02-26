import { arbitrum, base, gnosis, mainnet, optimism, polygon, scroll, zksync } from 'viem/chains'

const mallowConfig = {
  chains: {
     [mainnet.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_MAINNET_URL,
     },
     [optimism.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_URL,
     },
     [arbitrum.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_URL,
     },
     [scroll.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_SCROLL_URL,
     },
     [zksync.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_ZKSYNC_URL,
     },
     [gnosis.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_GNOSIS_URL,
     },
     [base.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_BASE_URL,
     },
     [polygon.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_POLYGON_URL,
     },
  }
}

export default mallowConfig
