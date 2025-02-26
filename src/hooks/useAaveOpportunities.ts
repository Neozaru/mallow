import stablecoins from '@/constants/stablecoins'
import getAaveReserves from '@/lib/getAaveReserves'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { arbitrum, base, gnosis, mainnet, optimism, polygon, scroll, zksync } from 'viem/chains'

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
      const apy = Number(variableBorrowRate) / 1000000000000000000000000000
      return {
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
      }
    })
  }, [aaveStablecoinData, isLoading])
  return { data: aaveOpportunities, isLoading: enabled && isLoading }
}
