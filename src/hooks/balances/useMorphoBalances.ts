import { GET_USER_VAULT_POSITIONS } from '@/lib/graphqlMorpho/GET_USER_VAULT_POSITIONS';
import request from 'graphql-request'
import { useCallback, useMemo } from 'react';
import { useQueries, UseQueryOptions } from '@tanstack/react-query'
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import getMorphoVaultLink from '@/utils/getMorphoVaultLink';
import { Address } from 'viem';
import useStable from '@/utils/useStable';

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

type QueryOptions = {
  queries: UseQueryOptions<GetUserVaultPositionsResponse>[];
};

const initialQueriesState = { queries: [] }

export function useMorphoBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const queryOptions = useMemo<QueryOptions>(() => {
    if (!accountAddresses) {
      return initialQueriesState
    }
    const queries = accountAddresses.map(accountAddress => {
      return {
        queryKey: ['vaultPositions', accountAddress],
        queryFn: () =>
          request<GetUserVaultPositionsResponse>(
            'https://blue-api.morpho.org/graphql',
            GET_USER_VAULT_POSITIONS,
            { userAddress: accountAddress }
          ),
        enabled: !!accountAddress,
        staleTime: Infinity,
      }
    })
    return {
      queries
    }
  }, [accountAddresses])

  const queriesResult = useQueries(queryOptions)
  const queriesResultStable = useStable(queriesResult)

  const refetchAll = useCallback(() => queriesResultStable.forEach(query => query.refetch()), [queriesResultStable])

  return useMemo(() => {
    if (!queriesResultStable) {
      return { isLoading: true, balances: [] }
    }
    const balances = queriesResultStable.flatMap(({ data }) => {
      if (!data) {
        return []
      }
      const typedData = data as GetUserVaultPositionsResponse // Failed to infer types with graphql-request
      const { address: accountAddress } = typedData.userByAddress
      return typedData.userByAddress.vaultPositions.map(position => {
        const symbol = position.vault.asset.symbol
        const balance = BigInt(position.assets)
        const formattedBalance = formatBalanceWithSymbol(balance, symbol)
        const apy = Number(position.vault.dailyApys.netApy)
        return {
          id: position.vault.id,
          accountAddress,
          poolAddress: position.vault.address,
          poolTokenAddress: position.vault.address,
          symbol,
          balance,
          balanceUsd: position.assetsUsd,
          formattedBalance,
          platform: 'morpho' as const,
          poolName: position.vault.name,
          chainId: position.vault.chain.id,
          apy,
          type: 'onchain' as const,
          metadata: {
            link: getMorphoVaultLink(position.vault)
          }
        }
      })
    })
    return { data: balances, isLoading: false, refetch: refetchAll }
  }, [queriesResultStable, refetchAll])
}
