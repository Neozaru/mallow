import stablecoins from '@/constants/stablecoins'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import { useMemo } from 'react'
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

const supportedChainIds = getSupportedChainIds()
const stablecoinsAaveSymbols = stablecoins.flatMap(symbol => [symbol, `${symbol}.E`, `A${symbol}`])

export function useAaveOpportunities() {
  const { isLoading, data: aaveStablecoinData } = useQuery<AavePoolData[]>({
    queryKey: ['aavedata'],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/defi/aave/poolsdata?symbols=${stablecoinsAaveSymbols}&chainIds=${supportedChainIds}`
      )
      return data.filter(({ apy }) => apy > 0)
    },
    retry: (failureCount, error) => {
      // API usage limit
      if (isAxiosError(error) && error.status === 429 && failureCount < 5) {
        console.warn(`Rate limit reached for Aave API. Retrying (retry ${failureCount + 1}/5)`)
        return true
      }
      return false
    },
    retryDelay: attemptIndex => Math.min(2000 * 2 ** attemptIndex, 30000),
    staleTime: 600000
  })

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
