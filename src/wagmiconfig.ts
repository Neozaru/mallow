"use client";

import { http, createConfig } from 'wagmi'
import { arbitrum, base, gnosis, mainnet, optimism, scroll, zksync } from 'wagmi/chains'

export const wagmiconfig = createConfig({
  chains: [mainnet, optimism, arbitrum, scroll, base, zksync, gnosis],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_MAINNET_URL),
    [optimism.id]: http(process.env.NEXT_PUBLIC_OPTIMISM_URL),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_URL),
    [scroll.id]: http(process.env.NEXT_PUBLIC_SCROLL_URL),
    [zksync.id]: http(process.env.NEXT_PUBLIC_ZKSYNC_URL),
    [gnosis.id]: http(process.env.NEXT_PUBLIC_GNOSIS_URL),
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_URL),
  },
})
