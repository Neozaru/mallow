import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';
import { useAaveOpportunities } from '../useAaveOpportunities';
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import { Address } from 'viem';

export function useAaveBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: aaveOpportunities, isLoading: isLoadingOpportunities } = useAaveOpportunities()
  
  const aaveTokenConfigs = useMemo(() => {    
    return aaveOpportunities?.map(({ poolTokenAddress, chainId }) => ({
      address: poolTokenAddress,
      chainId
    })) || []
  }, [aaveOpportunities])
  
  const { data: aTokenBalances, isLoading: isLoadingBalances } = useTokenBalances(accountAddresses, aaveTokenConfigs);
  
  return useMemo(() => {
    if (isLoadingBalances || isLoadingOpportunities || !aaveOpportunities || !aaveTokenConfigs) {
      return { data: [], isLoading: true }
    }
    const balances = aTokenBalances?.map(bal => {
      const { balance, chainId, accountAddress, tokenAddress } = bal
      const opportunity: YieldOpportunityOnChain | undefined = aaveOpportunities.find(
        d => d.poolTokenAddress === tokenAddress && d.chainId === chainId
      )
      if (!opportunity) {
        throw new Error(`Unexpected opportunity mismatch ${JSON.stringify({ tokenAddress, chainId })}`)
      }
      // Assuming not legitimate stablecoin with ever start with 'A'.
      const formattedBalance = formatBalanceWithSymbol(balance, opportunity.symbol)
      return {
        ...opportunity,
        accountAddress,
        balance,
        balanceUsd: parseFloat(formattedBalance),
        formattedBalance,
      }
    }) || []
    return { data: balances, isLoading: false }
  }, [aTokenBalances, aaveOpportunities, aaveTokenConfigs, isLoadingBalances, isLoadingOpportunities])
}
