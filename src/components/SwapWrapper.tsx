import { useOpportunities } from '@/hooks/useOpportunities';
import SwapComponent from './SwapComponent';
import { base } from 'viem/chains';
import { useMemo } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useSearchParams } from 'next/navigation';

const SwapWrapper = () => {
  const searchParams = useSearchParams()

  const fromOpportunityId = searchParams?.get('from') || null
  const toOpportunityId = searchParams?.get('to') || null

  const { data: opportunities, isLoading: isOpportunitiesLoading } = useOpportunities()
  // First version only supports Base and USDC
  const filteredOpportunities = useMemo(() => {
    if (!opportunities) {
      return []
    }
    return [
        {
          id: 'spot-usdc-8453',
          symbol: 'USDC',
          platform: 'spot' as const,
          poolName: 'Spot',
          chainId: base.id,
          poolTokenAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as const,
          poolAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as const,
          apy: 0,
          type: 'onchain' as const
        }, // TODO: make useOpportunities return spot stuff too
        ...opportunities?.filter(opportunity =>
          opportunity.chainId === base.id && opportunity.symbol === 'USDC' &&
          !opportunity.poolName.includes('Boost') // Beefy boosts are different and require claiming
        ) ?? []
      ]
  }, [opportunities])

  if (isOpportunitiesLoading) {
    return <LoadingSpinner />
  }
  if (!opportunities) {
    return <span>Nothing to see here</span>
  }
  return <SwapComponent opportunities={filteredOpportunities} fromOpportunityId={fromOpportunityId} toOpportunityId={toOpportunityId} />
}

export default SwapWrapper
