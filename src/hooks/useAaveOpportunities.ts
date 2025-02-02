import stablecoins from '@/constants/stablecoins'
import { axiosGetCached } from '@/lib/axiosGetCached'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useEffect, useMemo, useState } from 'react'

type AavePoolData = {
  id: string;
  symbol: string;
  apy: number;
  chainId: number;
  aTokenAddress: string;
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

  const aaveOpportunities: YieldOpportunity[] = useMemo(() => {
    if (isLoading || !aaveStablecoinData) {
      return []
    }
    return aaveStablecoinData.map(({ id, symbol, apy, aTokenAddress, chainId } : AavePoolData) => {
      const isNewAToken = symbol.startsWith('A')
      const spotTokenSymbol = isNewAToken ? symbol.slice(1) : symbol
      return {
        id,
        symbol: spotTokenSymbol,
        poolTokenAddress: aTokenAddress,
        protocol: 'aave',
        poolName: `Aave ${spotTokenSymbol}`,
        chainId,
        apy,
        type: 'dapp'
      }
    })
  }, [aaveStablecoinData, isLoading])
  return { data: aaveOpportunities, isLoading }
}
