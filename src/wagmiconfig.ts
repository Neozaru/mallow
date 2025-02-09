"use client";

import { http, createConfig } from 'wagmi'
import { arbitrum, base, gnosis, mainnet, optimism, scroll, zksync, polygon } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const wagmiconfig = createConfig({
  ssr: true,
  chains: [mainnet, optimism, arbitrum, scroll, base, zksync, gnosis, polygon],
  connectors: [
    injected(),
    walletConnect({
      disableProviderPing: true,
      customStoragePrefix: 'wagmiWC',
      projectId: `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`,
      showQrModal: false,
      metadata: { 
        name: 'Mallow', 
        description: 'Do (s)more with your stablecoins', 
        url: 'https://mallow.money/',
        icons: ['https://mallow.money/mallowLogoRound.svg'],
      }, 
    }),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_MAINNET_URL),
    [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_URL),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_URL),
    [scroll.id]: http(process.env.NEXT_PUBLIC_SCROLL_URL),
    [zksync.id]: http(process.env.NEXT_PUBLIC_ZKSYNC_URL),
    [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_URL),
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_URL),
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_URL),
  },
})
