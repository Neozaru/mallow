import { Address } from 'viem';
import { usePendleOpportunities } from '../usePendleOpportunities';
import { useBalancesFromOpportunities } from './useBalancesFromOpportunities';

export function usePendleBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: pendleOpportunities, isLoading: isLoadingOpportunities } = usePendleOpportunities()
  return useBalancesFromOpportunities({
    accountAddresses,
    opportunities: pendleOpportunities,
    enabled: !isLoadingOpportunities && accountAddresses.length > 0
  })
}
