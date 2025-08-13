import stablecoins from '@/constants/stablecoins'
import createOpportunity from '@/lib/createOpportunity'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useMemo } from 'react'
import { arbitrum, base, gnosis, mainnet, optimism, polygon, scroll, sonic, zksync } from 'viem/chains'
import { useAaveStakingOpportunities } from './useAaveStakingOpportunities'

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
  [sonic.id]: 'sonic',
}

const getTokenSymbolFromName = pendleSymbolName => {
  const pendleSymbolTrimmed = pendleSymbolName.split(' ')[0]
  return `pt${pendleSymbolTrimmed}`
}

export function usePendleOpportunities({ enabled } = { enabled: true }) {
  const { isLoading, data: pendleStablecoinData } = useQuery({
    queryKey: ['pendledata'],
    queryFn: async () => {
      const symbolsFilter = [...stablecoins, ...stablecoins.map(s => `stka${s}`)]
      const url = `/api/defi/pendle/assets?symbols=${symbolsFilter}&chainIds=${supportedChainIds}`
      const { data } = await axios.get(url)
      return data
    },
    staleTime: 30 * 1000,
    enabled
  })

  const { data: aaveStakingOpportunities, isLoading: isLoadingAaveStakingOpportunities } = useAaveStakingOpportunities()

  const pendleOpportunities: YieldOpportunityOnChain[] = useMemo(() => {
    if (isLoading || isLoadingAaveStakingOpportunities || !pendleStablecoinData || !aaveStakingOpportunities) {
      return []
    }
    return pendleStablecoinData.map(({ info, rates, chainId }) => {
      const id = `pendle-${chainId}-${info.address}`
      const symbol = getTokenSymbolFromName(info.name)
      const apy = rates.impliedApy
      const rateToUnderlying = rates.ptToUnderlyingTokenRate
      
      const matchingAaveUmbrellaOpportunity = aaveStakingOpportunities.find(op =>
        op.poolAddress.toLocaleLowerCase() === info.underlyingAsset.split('-')[1].toLocaleLowerCase() &&
        op.chainId === chainId
      )
      const rateFromUnderlyingToPrincipal = matchingAaveUmbrellaOpportunity
        ? matchingAaveUmbrellaOpportunity.rateToPrincipal
        : 1

      const rateToPrincipal = rateToUnderlying * rateFromUnderlyingToPrincipal
      return createOpportunity({
        id,
        symbol,
        poolTokenAddress: info.pt.split('-')[1],
        platform: 'pendle' as const,
        poolName: info.name,
        chainId,
        apy,
        expiry: new Date(info.expiry),
        type: 'onchain' as const,
        rateToPrincipal,
        metadata: {
          link: `https://app.pendle.finance/trade/markets/${info.address}?view=pt&chain=${pendleChainNames[chainId]}`
        }
      })
    })
  }, [pendleStablecoinData, isLoading, isLoadingAaveStakingOpportunities, aaveStakingOpportunities])
  return { data: pendleOpportunities, isLoading }
}
