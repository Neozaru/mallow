import { mainnet } from 'viem/chains'
import { useReadContracts } from 'wagmi'

import aaveDataAggregationHelperAbi from '@/abis/aaveDataAggregationHelper.abi'
import { useMemo } from 'react'
import createOpportunity from '@/lib/createOpportunity'
import { identity } from 'lodash'
import { aaveChainNames } from '@/utils/aaveChainNames'
import { useAaveOpportunities } from './useAaveOpportunities'
import { isStablecoin } from '@/lib/isStablecoin'


export function useAaveStakingOpportunities({ enabled } = { enabled: true }) {
  const readContractsParams = useMemo(() => ({
    contracts: [
      {
        address: '0xcc8fd820b1b9c5ebaca8615927f2ffc1f74b9db3',
        abi: aaveDataAggregationHelperAbi,
        functionName: 'getTokensAggregatedData',
        args: ['0xD400fc38ED4732893174325693a63C30ee3881a8', '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9'],
        chainId: mainnet.id,
      },
    ],
    enabled,
  }), [enabled])

  const { data: aaveOpportunities, isLoading: isAaveOpportunitiesLoading } = useAaveOpportunities({ enabled })

  const { data: readContractsData, error, isLoading } = useReadContracts<ContractCallBigIntResult>(readContractsParams)
  return useMemo(() => {
    if (isLoading || isAaveOpportunitiesLoading) {
      return { isLoading: true, error }
    }
    if (error) {
      console.error('Aave staking opportunities error', error)
      return { error, isLoading: false }
    }
    const typedReadContractsData = readContractsData as ContractCallBigIntResult[]
    const data = typedReadContractsData[0].result || []

    const opportunities = data.map(({ isStakeConfigured, rewardsTokenData, stakeTokenData, targetLiquidity, totalAssets }) => {
      if (!isStakeConfigured) {
        return null
      }
      const chainId = mainnet.id // TODO change when Umbrella ships to multiple chains
      const stakingApy = (parseInt(rewardsTokenData[0].maxEmissionPerSecond) * 31_536_000) / Math.max(parseInt(targetLiquidity), parseInt(totalAssets))
      const aaveOpportunity = aaveOpportunities.find(o =>
        o.chainId === chainId &&
        o.poolTokenAddress.toLocaleLowerCase() === rewardsTokenData[0].rewardTokenData.token.toLocaleLowerCase()
      )
      const symbol = aaveOpportunity?.symbol || rewardsTokenData[0].rewardTokenData.symbol
      if (!isStablecoin(symbol)) {
        return null
      }

      const supplyApy = aaveOpportunity?.apy || 0
      const apy = (supplyApy + stakingApy)
      const { token: poolAddress } = stakeTokenData
      const rateToPrincipal = stakeTokenData.price ? parseInt(stakeTokenData.price) / Math.pow(10, 8) : 1
      return createOpportunity({
        id: `aave-staked-${symbol.toLowerCase()}`,
        symbol: `stka${symbol}`,
        poolTokenAddress: poolAddress,
        poolAddress,
        platform: 'aave' as const,
        poolName: `Aave Staked ${symbol}`,
        chainId,
        apy,
        rateToPrincipal,
        type: 'onchain' as const,
        metadata: {
          link: `https://app.aave.com/staking/?marketName=proto_${aaveChainNames[chainId] || 'mainnet'}_v3`
        }
      })
    }) || []
    return { data: opportunities.filter(identity), isLoading: false }
  }, [readContractsData, isAaveOpportunitiesLoading, aaveOpportunities, isLoading, error])
}
