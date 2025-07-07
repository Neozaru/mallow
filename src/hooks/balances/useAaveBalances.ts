import { useAaveOpportunities } from '../useAaveOpportunities'
import { Address } from 'viem'
import { useBalancesFromOpportunities } from './useBalancesFromOpportunities'

export function useAaveBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: aaveOpportunities, isLoading: isLoadingOpportunities } = useAaveOpportunities()
  return useBalancesFromOpportunities({
    accountAddresses,
    opportunities: aaveOpportunities,
    enabled: !isLoadingOpportunities && accountAddresses.length > 0
  })
}
