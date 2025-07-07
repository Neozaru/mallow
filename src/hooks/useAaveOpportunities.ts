import stablecoins from '@/constants/stablecoins'
import createOpportunity from '@/lib/createOpportunity'
import getAaveReserves from '@/lib/getAaveReserves'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useSSRData } from './useSSRData'
import { useReadContracts } from 'wagmi'

import aaveATokenAbi from '@/abis/aaveAToken.abi'
import { aaveChainNames } from '@/utils/aaveChainNames'

function convertAprToApy(apr: number): number {
  const SECONDS_PER_YEAR = 31_536_000; // 60 * 60 * 24 * 365
  return Math.pow(1 + apr / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
}

type AaveReserveData = {
  id: string;
  symbol: string;
  interestRateStrategyAddress: Address;
  aTokenAddress: Address;
  underlyingAsset: Address;
  variableBorrowRate: string;
}

const supportedChainIds = getSupportedChainIds()
const stablecoinsAaveSymbols = stablecoins.flatMap(symbol => [symbol, `${symbol}.E`, `A${symbol}`])

const poolIdToChainId = poolId => Number(poolId.split('-')[0])

export function useAaveOpportunities({ enabled } = { enabled: true }) {
  const { isLoading: isAaveDataLoading, data: aaveStablecoinData } = useQuery<AaveReserveData[]>({
    queryKey: ['aavedata'],
    queryFn: async () => {
      return getAaveReserves({ chainIds: supportedChainIds, symbols: stablecoinsAaveSymbols })
    },
    staleTime: 600000,
    refetchOnWindowFocus: false,
    enabled
  })

  const aavePoolReadContractParams = useMemo(() => {
    if (isAaveDataLoading || !aaveStablecoinData) {
      return { contracts: [] }
    }
    const contracts = aaveStablecoinData?.map(({ id, interestRateStrategyAddress }) => {
      const chainId = poolIdToChainId(id)
      return {
        abi: aaveATokenAbi,
        address: interestRateStrategyAddress,
        chainId,
        functionName: 'POOL',
        args: [],
      }
    })
    return { contracts }
  }, [isAaveDataLoading, aaveStablecoinData])
  const { data: aavePoolsData, isLoading: isPoolsDataLoading } = useReadContracts(aavePoolReadContractParams)
  // For sUSDS rate (will use it as proxy for Aave USDS rate)
  const { data: ssrDatauseSSRData, isLoading: isSSRDataLoading } = useSSRData() 

  const aaveOpportunities: YieldOpportunityOnChain[] = useMemo(() => {
    if (isAaveDataLoading || isPoolsDataLoading || isSSRDataLoading || !aaveStablecoinData) {
      return []
    }
    return aaveStablecoinData.map(({ id, symbol, aTokenAddress, variableBorrowRate, underlyingAsset }, i) => {
      const isNewAToken = symbol.startsWith('A')
      const spotTokenSymbol = isNewAToken ? symbol.slice(1) : symbol
      const chainId = poolIdToChainId(id)
      const poolAddress = aavePoolsData?.[i]?.result
      // Hack to take USDS in account approx. Couldn't get anything useful from the API
      const usdsAPY = ssrDatauseSSRData?.apy || 0.065
      const apy = convertAprToApy(Number(variableBorrowRate) / 1000000000000000000000000000) + (spotTokenSymbol === 'USDS' ? usdsAPY : 0) 
      return createOpportunity({
        id,
        symbol: spotTokenSymbol,
        poolTokenAddress: aTokenAddress,
        poolAddress,
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
  }, [aaveStablecoinData, isAaveDataLoading, isPoolsDataLoading, isSSRDataLoading, ssrDatauseSSRData, aavePoolsData])
  return { data: aaveOpportunities, isLoading: enabled && (isPoolsDataLoading || isSSRDataLoading || isAaveDataLoading) }
}
