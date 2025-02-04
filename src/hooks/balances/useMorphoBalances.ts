import { GET_USER_VAULT_POSITIONS } from '@/lib/graphqlMorpho/GET_USER_VAULT_POSITIONS';
import { useEffect, useMemo, useRef, useState } from 'react';
import request from 'graphql-request'
import { replaceEqualDeep, useQueries } from '@tanstack/react-query'
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import getMorphoVaultLink from '@/utils/getMorphoVaultLink';

function useStable<T>(value: T) {
  const ref = useRef(value);
  const stable = replaceEqualDeep(ref.current, value);
  useEffect(() => {
    ref.current = stable;
  }, [stable]);
  return stable;
}

const initialQueriesState = { queries: [] }

export function useMorphoBalances(accountAddresses: string[]) {
  const [queries, setQueries] = useState(initialQueriesState)
  const queriesResult = useQueries(queries)
  const queriesResultStable = useStable(queriesResult)

  useEffect(() => {
    if (!accountAddresses) {
      return
    }
    const queriesArray = accountAddresses.map(accountAddress => {
      return {
        queryKey: ['vaultPositions', accountAddress],
        queryFn: () =>
          request(
            'https://blue-api.morpho.org/graphql',
            GET_USER_VAULT_POSITIONS,
            { userAddress: accountAddress }
          ),
        enabled: !!accountAddress,
        staleTime: Infinity,
      }
    })
    setQueries({ queries: queriesArray })
  }, [accountAddresses, setQueries])

  return useMemo(() => {
    if (!queriesResultStable) {
      return { isLoading: true, balances: [] }
    }
    const balances = queriesResultStable.flatMap(({ data }) => {
      if (!data?.userByAddress) {
        return []
      }
      const { address: accountAddress } = data.userByAddress 
      return data.userByAddress.vaultPositions.map(position => {
        const symbol = position.vault.asset.symbol
        const balance = position.assets
        const formattedBalance = formatBalanceWithSymbol(balance, symbol)
        const apy = position.vault.dailyApys.netApy
        return {
          id: position.id,
          accountAddress,
          symbol,
          balance,
          balanceUsd: position.assetsUsd,
          formattedBalance,
          protocol: 'morpho',
          poolName: position.vault.name,
          chainId: position.vault.chain.id,
          apy,
          metadata: {
            link: getMorphoVaultLink(position.vault)
          }
        }
      })
    })
    return { balances, isLoading: false }
  }, [queriesResultStable])
}
