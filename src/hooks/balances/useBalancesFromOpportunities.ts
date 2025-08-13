import { Address } from 'viem';
import { useTokenBalances } from './useTokenBalances';
import { useMemo } from 'react';
import { formatBalanceWithSymbol } from '@/lib/formatBalanceWithSymbol';

type Props = {
  accountAddresses: Address[];
  opportunities: YieldOpportunityOnChain[];
  enabled?: boolean;
}

export function useBalancesFromOpportunities({
  accountAddresses,
  opportunities,
  enabled = true
}: Props): LoadableData<YieldPositionOnChain[]> {

  const tokenConfigs = useMemo(() => {    
    return opportunities?.map(({ poolTokenAddress, chainId }) => ({
      address: poolTokenAddress,
      chainId
    })) || []
  }, [opportunities])
  
  const { data: tokenBalances, isLoading: isLoadingBalances, refetch } = useTokenBalances(accountAddresses, tokenConfigs)
  return useMemo(() => {
    if (isLoadingBalances || !opportunities || !enabled || !tokenConfigs) {
      return { data: [], isLoading: true }
    }
    const balances = tokenBalances?.map(bal => {
      const { balance, chainId, accountAddress, tokenAddress } = bal
      const opportunity: YieldOpportunityOnChain | undefined = opportunities.find(
        d => d.poolTokenAddress === tokenAddress && d.chainId === chainId
      )
      if (!opportunity) {
        throw new Error(`useBalancesFromOpportunities: Unexpected opportunity mismatch ${JSON.stringify({ tokenAddress, chainId })}`)
      }
      const formattedBalance = formatBalanceWithSymbol(balance, opportunity.symbol)
      return {
        ...opportunity,
        accountAddress,
        balance,
        balanceUnderlying: opportunity.rateToPrincipal ? parseFloat(formattedBalance) * opportunity.rateToPrincipal : parseFloat(formattedBalance),
        formattedBalance,
      }
    }) || []
    return { data: balances, isLoading: false, refetch }
  }, [tokenBalances, opportunities, tokenConfigs, isLoadingBalances, enabled, refetch])
}
