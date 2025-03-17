import stablecoins from '@/constants/stablecoins'
import createOpportunity from '@/lib/createOpportunity'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useMemo } from 'react'
import { arbitrum, base, gnosis, mainnet, optimism, polygon, scroll, zksync } from 'viem/chains'

const supportedChainIds = getSupportedChainIds()

const pendleChainNames = {
  [mainnet.id]: 'ethereum',
  [optimism.id]: 'optimism',
  [arbitrum.id]: 'arbitrum',
  [zksync.id]: 'zksync',
  [base.id]: 'base',
  [polygon.id]: 'polygon',
  [gnosis.id]: 'gnosis',
  [scroll.id]: 'scroll',
}

const getTokenSymbolFromName = pendleSymbolName => {
  const pendleSymbolTrimmed = pendleSymbolName.split(' ')[0]
  return pendleSymbolTrimmed
}

export function usePendleOpportunities({ enabled } = { enabled: true }) {
  const { isLoading, data: pendleStablecoinData } = useQuery({
    queryKey: ['pendledata'],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/defi/pendle/assets?symbols=${stablecoins}&chainIds=${supportedChainIds}`
      )
      return data
    },
    staleTime: 30 * 1000,
    enabled
  })

  const pendleOpportunities: YieldOpportunityOnChain[] = useMemo(() => {
    if (isLoading || !pendleStablecoinData) {
      return []
    }
    return pendleStablecoinData.map(({ info, rates, chainId }) => {
      const id = `pendle-${chainId}-${info.address}`
      const symbol = getTokenSymbolFromName(info.name)
      // const symbol = info.name
      const apy = rates.impliedApy
      const rateToPrincipal = rates.ptToUnderlyingTokenRate
      return createOpportunity({
        id,
        symbol,
        poolTokenAddress: info.pt.split('-')[1],
        platform: 'pendle' as const,
        poolName: info.name,
        chainId,
        apy,
        type: 'onchain' as const,
        rateToPrincipal,
        metadata: {
          link: `https://app.pendle.finance/trade/markets/${info.address}?view=pt&chain=${pendleChainNames[chainId]}`
        }
      })
    })
  }, [pendleStablecoinData, isLoading])
  return { data: pendleOpportunities, isLoading }
}
