import { useMemo } from 'react'
import { useSDaiData } from './useDsrData'
import { gnosis } from 'viem/chains'
import { Address } from 'viem'

const useSexyDaiOpportunities = () => {
  const { apy } = useSDaiData()
  return useMemo(() => {
    if (!apy) {
      return { data: [], isLoading: true }
    }
    const opportunities: YieldOpportunityOnChain[] = [{
      id: `sexy-dai`,
      symbol: 'DAI',
      protocol: 'dsr' as const,
      poolName: 'DSR Gnosis',
      poolTokenAddress: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
      chainId: gnosis.id,
      apy,
      type: 'dapp' as const
    }]
    return { data: opportunities, isLoading: false }
  }, [apy])
}

export default useSexyDaiOpportunities
