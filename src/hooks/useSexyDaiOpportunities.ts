import { useMemo } from 'react'
import { gnosis } from 'viem/chains'
import createOpportunity from '@/lib/createOpportunity'
import { useSSRData } from './useSSRData'

const useSexyDaiOpportunities = () => {
  const { data: ssrData, isLoading: isSsrDataLoading } = useSSRData()
  return useMemo(() => {
    if (isSsrDataLoading) {
      return { data: [], isLoading: true }
    }
    const apy = ssrData?.apy
    const opportunities: YieldOpportunityOnChain[] = [createOpportunity({
      id: `sexy-dai`,
      symbol: 'DAI',
      platform: 'dsr' as const,
      poolName: 'DAI Savings',
      poolAddress: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
      poolTokenAddress: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
      chainId: gnosis.id,
      apy,
      rateToPrincipal: 1,
      type: 'onchain' as const,
      metadata: {
        link: 'https://agavefinance.eth.limo/sdai/'
      }
    })]
    return { data: opportunities, isLoading: false }
  }, [ssrData, isSsrDataLoading])
}

export default useSexyDaiOpportunities
