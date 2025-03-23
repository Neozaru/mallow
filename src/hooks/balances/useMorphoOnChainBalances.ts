import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import { Address } from 'viem';
import useMorphoOpportunities from '../useMorphoOpportunities';
import { useTokenBalances } from './useTokenBalances';
import { useMemo } from 'react';
import { sharesToBaseNR } from '@/lib/lpUtils';

export type UserVaultPosition = {
  assets: number;
  assetsUsd: number;
  id: string;
  shares: string;
  vault: {
    id: string;
    name: string;
    symbol: string;
    address: Address;
    asset: {
      symbol: string;
    };
    chain: {
      id: number;
      network: string;
    };
    dailyApys: {
      netApy: string;
    };
  };
};

export type GetUserVaultPositionsResponse = {
  userByAddress: {
  address: Address;
    vaultPositions: UserVaultPosition[];
  };
};

export function useMorphoOnChainBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {

  const { data: morphoOpportunities, isLoading: isLoadingOpportunities } = useMorphoOpportunities()

  // TODO: Common logic, refactor
  const morphoTokenConfigs = useMemo(() => {    
    return morphoOpportunities?.map(({ poolTokenAddress, chainId }) => ({
      address: poolTokenAddress,
      chainId
    })) || []
  }, [morphoOpportunities])

  const { data: morphoPoolBalances, isLoading: isLoadingBalances, refetch } = useTokenBalances(accountAddresses, morphoTokenConfigs)

  return useMemo(() => {
    if (isLoadingOpportunities || isLoadingBalances || !morphoPoolBalances) {
      return { isLoading: true, balances: [] }
    }
    const balances = morphoPoolBalances.flatMap(({ balance: sharesBalance, chainId, accountAddress, tokenAddress }) => {

      const opportunity: YieldOpportunityOnChain | undefined = morphoOpportunities.find(
        d => d.poolTokenAddress === tokenAddress && d.chainId === chainId
      )
      if (!opportunity) {
        throw new Error(`Morpho: Unexpected opportunity mismatch ${JSON.stringify({ tokenAddress, chainId })}`)
      }
      const balance = sharesToBaseNR(sharesBalance, BigInt(opportunity.rateToPrincipal || 1))
      const formattedBalance = formatBalanceWithSymbol(balance, opportunity.symbol)

      return {
        ...opportunity,
        accountAddress,
        balance,
        balanceUsd: parseFloat(formattedBalance),
        formattedBalance,
      }
    })
    return { data: balances, isLoading: false, refetch }
  }, [isLoadingOpportunities, isLoadingBalances, morphoPoolBalances, morphoOpportunities, refetch])
}
