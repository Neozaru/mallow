import stablecoins from '@/constants/stablecoins'
import { axiosGetCached } from '@/lib/axiosGetCached'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
import { arbitrum, base, gnosis, mainnet, optimism, polygon, scroll, zksync } from 'viem/chains'

type AavePoolData = {
  id: string;
  symbol: string;
  apy: number;
  chainId: number;
  aTokenAddress: Address;
  underlyingAsset: string;
}

const aaveChainNames = {
  [mainnet.id]: 'mainnet',
  [optimism.id]: 'optimism',
  [arbitrum.id]: 'arbitrum',
  [zksync.id]: 'zksync',
  [base.id]: 'base',
  [polygon.id]: 'polygon',
  [gnosis.id]: 'gnosis',
  [scroll.id]: 'scroll',
}

export function useAaveOpportunities() {
  const [isLoading, setIsLoading] = useState(true)
  const [aaveStablecoinData, setAaveStablecoinData] = useState<AavePoolData[]>([])
  useEffect(() => {
    async function fetchData() {
      const supportedChainIds = getSupportedChainIds()
      const stablecoinsAaveSymbols = stablecoins.flatMap(symbol => [symbol, `${symbol}.E`, `A${symbol}`])
      const { data } = await axiosGetCached(
        `/api/defi/aave/poolsdata?symbols=${stablecoinsAaveSymbols}&chainIds=${supportedChainIds}`,
        600000
      ) as { data: AavePoolData[] }
      setAaveStablecoinData(data.filter(({ apy }) => apy > 0)) // Filters legacy pools
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchData()
  }, [])

  const aaveOpportunities: YieldOpportunityOnChain[] = useMemo(() => {
    if (isLoading || !aaveStablecoinData) {
      return []
    }
    return aaveStablecoinData.map(({ id, symbol, apy, aTokenAddress, underlyingAsset, chainId } : AavePoolData) => {
      const isNewAToken = symbol.startsWith('A')
      const spotTokenSymbol = isNewAToken ? symbol.slice(1) : symbol
      return {
        id,
        symbol: spotTokenSymbol,
        poolTokenAddress: aTokenAddress,
        platform: 'aave' as const,
        poolName: `Aave ${spotTokenSymbol}`,
        chainId,
        apy,
        type: 'onchain' as const,
        metadata: {
          link: `https://app.aave.com/reserve-overview/?underlyingAsset=${underlyingAsset}&marketName=proto_${aaveChainNames[chainId] || 'mainnet'}_v3`
        }
      }
    })
  }, [aaveStablecoinData, isLoading])
  return { data: aaveOpportunities, isLoading }
}
