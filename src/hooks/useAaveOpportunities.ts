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

// Some tokens wrongly show as Ethereum token even though they come from Avalanche. Weird bug.
const aTokenBlacklist = [
  '0x47afa96cdc9fab46904a55a6ad4bf6660b53c38a',
  '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
  '0x532e6537fea298397212f09a61e03311686f548e',
  '0x46a51127c3ce23fb7ab1de06226147f446e4a857'
]

const supportedChainIds = getSupportedChainIds()
const stablecoinsAaveSymbols = stablecoins.flatMap(symbol => [symbol, `${symbol}.E`, `A${symbol}`])

export function useAaveOpportunities({ enabled } = { enabled: true }) {
  const { isLoading, data: aaveStablecoinData } = useQuery<AavePoolData[]>({
    queryKey: ['aavedata'],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/defi/aave/poolsdata?symbols=${stablecoinsAaveSymbols}&chainIds=${supportedChainIds}`
      )
      return data
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
    staleTime: 600000,
    enabled
  })

  const aaveOpportunities: YieldOpportunityOnChain[] = useMemo(() => {
    if (isLoading || !aaveStablecoinData) {
      return []
    }
    return aaveStablecoinData
      .filter(({ aTokenAddress }) => !aTokenBlacklist.includes(aTokenAddress.toLowerCase()))
      .map(({ id, symbol, apy, aTokenAddress, underlyingAsset, chainId } : AavePoolData) => {
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
  return { data: aaveOpportunities, isLoading: enabled && isLoading }
}
