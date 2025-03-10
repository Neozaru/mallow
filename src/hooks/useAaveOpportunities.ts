import stablecoins from '@/constants/stablecoins'
import createOpportunity from '@/lib/createOpportunity'
import getAaveReserves from '@/lib/getAaveReserves'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { arbitrum, avalanche, base, bsc, gnosis, mainnet, optimism, polygon, scroll, zksync } from 'viem/chains'

function convertAprToApy(apr: number): number {
  const SECONDS_PER_YEAR = 31_536_000; // 60 * 60 * 24 * 365
  return Math.pow(1 + apr / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
}

type AaveReserveData = {
  id: string;
  symbol: string;
  interestRateStrategyAddress: Address;
  underlyingAsset: Address;
  variableBorrowRate: string;
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
  [avalanche.id]: 'avalanche',
  [bsc.id]: 'bnb',
}

const supportedChainIds = getSupportedChainIds()
const stablecoinsAaveSymbols = stablecoins.flatMap(symbol => [symbol, `${symbol}.E`, `A${symbol}`])

export function useAaveOpportunities({ enabled } = { enabled: true }) {
  const { isLoading, data: aaveStablecoinData } = useQuery<AaveReserveData[]>({
    queryKey: ['aavedata'],
    queryFn: async () => {
      return getAaveReserves({ chainIds: supportedChainIds, symbols: stablecoinsAaveSymbols })
    },
    staleTime: 600000,
    enabled
  })

  const aaveOpportunities: YieldOpportunityOnChain[] = useMemo(() => {
    if (isLoading || !aaveStablecoinData) {
      return []
    }
    return aaveStablecoinData.map(({ id, symbol, interestRateStrategyAddress, variableBorrowRate, underlyingAsset }) => {
      const isNewAToken = symbol.startsWith('A')
      const spotTokenSymbol = isNewAToken ? symbol.slice(1) : symbol
      const chainId = Number(id.split('-')[0])
      // Hack to take USDS in account approx. Couldn't get anything useful from the API
      const apy = convertAprToApy(Number(variableBorrowRate) / 1000000000000000000000000000) + (spotTokenSymbol === 'USDS' ? 0.08 : 0) 
      return createOpportunity({
        id,
        symbol: spotTokenSymbol,
        poolTokenAddress: interestRateStrategyAddress,
        platform: 'aave' as const,
        poolName: `Aave ${spotTokenSymbol}`,
        chainId,
        apy,
        type: 'onchain' as const,
        metadata: {
          link: `https://app.aave.com/reserve-overview/?underlyingAsset=${underlyingAsset}&marketName=proto_${aaveChainNames[chainId] || 'mainnet'}_v3`
        }
      })
    })
  }, [aaveStablecoinData, isLoading])
  return { data: aaveOpportunities, isLoading: enabled && isLoading }
}
