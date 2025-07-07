import { Address } from 'viem';
import { useBalancesFromOpportunities } from './useBalancesFromOpportunities';
import { useAaveStakingOpportunities } from '../useAaveStakingOpportunities';

export function useAaveStakingBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: aaveStakingOpportunities, isLoading: isLoadingOpportunities } = useAaveStakingOpportunities()
  return useBalancesFromOpportunities({
    accountAddresses,
    opportunities: aaveStakingOpportunities,
    enabled: !isLoadingOpportunities && accountAddresses.length > 0
  })
}
