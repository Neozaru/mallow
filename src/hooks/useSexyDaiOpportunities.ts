import { useMemo } from 'react'
import { useSDaiData } from './useDsrData'
import { gnosis } from 'viem/chains'
import createOpportunity from '@/lib/createOpportunity'

const useSexyDaiOpportunities = () => {
  const { data: sDaiData, isLoading } = useSDaiData()
  return useMemo(() => {
    if (isLoading) {
      return { data: [], isLoading: true }
    }
    const apy = sDaiData?.apy || 0
    const opportunities: YieldOpportunityOnChain[] = [createOpportunity({
      id: `sexy-dai`,
      symbol: 'DAI',
      platform: 'dsr' as const,
      poolName: 'DAI DAI Savings',
      poolTokenAddress: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
      chainId: gnosis.id,
      apy,
      rateToPrincipal: 1,
      type: 'onchain' as const
    })]
    return { data: opportunities, isLoading: false }
  }, [sDaiData, isLoading])
}

export default useSexyDaiOpportunities
