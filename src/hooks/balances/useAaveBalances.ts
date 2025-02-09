import { useEffect, useMemo, useState } from 'react';
import { useTokenBalances } from './useTokenBalances';
import { useAaveOpportunities } from '../useAaveOpportunities';
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import { Address } from 'viem';

export function useAaveBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const [aaveTokenConfigs, setAaveTokenConfigs] = useState<TokenConfig[]>([]);
  const { data: aTokenBalances, isLoading: isLoadingBalances } = useTokenBalances(accountAddresses, aaveTokenConfigs);
  const { data: aaveOpportunities, isLoading: isLoadingStablecoinData } = useAaveOpportunities()

  useEffect(() => {
    if (!aaveOpportunities) {
      return
    }
    const tokenConfigs = aaveOpportunities.map(({ poolTokenAddress, chainId }) => ({
      address: poolTokenAddress,
      chainId
    }))
    setAaveTokenConfigs(tokenConfigs)
  }, [aaveOpportunities])

  return useMemo(() => {
    if (isLoadingBalances || isLoadingStablecoinData || !aaveOpportunities || !aaveTokenConfigs) {
      return { balances: [], isLoading: true }
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
    })
    return { data: balances, isLoading: false }
  }, [aTokenBalances, aaveOpportunities, aaveTokenConfigs, isLoadingBalances, isLoadingStablecoinData])
}
