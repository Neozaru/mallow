import { useMemo } from 'react'
import { useSDaiData } from './useDsrData'
import { gnosis } from 'viem/chains'

const useSexyDaiOpportunities = () => {
  const { apy } = useSDaiData()
  return useMemo(() => {
    if (!apy) {
      return { data: [], isLoading: true }
    }
    const opportunities: YieldOpportunity[] = [{
      id: `sexy-dai`,
      symbol: 'DAI',
      protocol: 'dsr',
      poolName: 'DSR Gnosis',
      poolTokenAddress: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
      chainId: gnosis.id,
      apy,
      type: 'dapp'
    }]
    return { data: opportunities, isLoading: false }
  }, [apy])
}

export default useSexyDaiOpportunities
