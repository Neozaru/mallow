import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import { Address } from 'viem';
import { usePendleOpportunities } from '../usePendleOpportunities';

export function usePendleBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: pendleOpportunities, isLoading: isLoadingOpportunities } = usePendleOpportunities()
  const pendleTokenConfigs = useMemo(() => {    
    return pendleOpportunities?.map(({ poolTokenAddress, chainId }) => ({
      address: poolTokenAddress,
      chainId
    })) || []
  }, [pendleOpportunities])

  const { data: pendleTokenBalances, isLoading: isLoadingBalances } = useTokenBalances(accountAddresses, pendleTokenConfigs)

  return useMemo(() => {
    if (isLoadingBalances || isLoadingOpportunities || !pendleOpportunities || !pendleTokenConfigs) {
      return { data: [], isLoading: true }
    }
    const balances = pendleTokenBalances?.map(bal => {
      const { balance, chainId, accountAddress, tokenAddress } = bal
      const opportunity: YieldOpportunityOnChain | undefined = pendleOpportunities.find(
        d => d.poolTokenAddress === tokenAddress && d.chainId === chainId
      )
      if (!opportunity) {
        throw new Error(`Unexpected opportunity mismatch ${JSON.stringify({ tokenAddress, chainId })}`)
      }
      const formattedBalance = formatBalanceWithSymbol(balance, opportunity.symbol)
      // const rateToPrincipal = opportunity.rateToPrincipal ?? 1
      return {
        ...opportunity,
        accountAddress,
        balance,
        balanceUsd: parseFloat(formattedBalance) * (opportunity.rateToPrincipal ?? 1),
        formattedBalance,
      }
    }) || []
    return { data: balances, isLoading: false }
  }, [pendleTokenBalances, pendleOpportunities, pendleTokenConfigs, isLoadingBalances, isLoadingOpportunities])
}
