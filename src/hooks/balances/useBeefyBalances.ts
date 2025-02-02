import { useEffect, useMemo, useState } from 'react';
import { useBeefyData } from '../useBeefyData';
import { useTokenBalances } from './useTokenBalances';
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import { formatUnits } from 'viem';
import useBeefyOpportunities from '../useBeefyOpportunities';
import { find } from 'lodash';

export function useBeefyBalances(accountAddresses: string[]) {
  const [beefyTokenConfigs, setBeefyTokenConfigs] = useState([])
  const { balances: balancesOpportunities } = useTokenBalances(accountAddresses, beefyTokenConfigs)

  const { vaults, boosts } = useBeefyData()

  const { data: opportunities } = useBeefyOpportunities()

  useEffect(() => {
    if (!opportunities) {
      return
    }
    const tokenConfigs = opportunities.map(({ chainId, poolTokenAddress }) => ({ chainId, address: poolTokenAddress }))
    setBeefyTokenConfigs(tokenConfigs)
  }, [opportunities])

  return useMemo(() => {
    if (!balancesOpportunities || !vaults || !boosts) {
      return { balances: [], isLoading: true }
    }

    const balances = balancesOpportunities.map(bal => {
      const opportunity: YieldOpportunity = find(opportunities, { chainId: bal.chainId, poolTokenAddress: bal.tokenAddress })
      const { balance: sharesBalance, accountAddress } = bal
      const { id, symbol } = opportunity
      const isBoost = id.startsWith('moo_')

      const vaultId = isBoost ? find(boosts, { id }).poolId : id

      // Calculate USD value of owned vault shares
      const correspondingVault = find(vaults, { id: vaultId })
      const { pricePerFullShare } = correspondingVault
      const balance = parseInt(
        formatUnits(sharesBalance * BigInt(pricePerFullShare), 18)
      )
      const formattedBalance = formatBalanceWithSymbol(BigInt(balance), symbol)
      return {
        accountAddress,
        balance,
        balanceUsd: parseFloat(formattedBalance),
        formattedBalance,
        ...opportunity
      }
    })
    return { balances, isLoading: false }
  }, [vaults, boosts, opportunities, balancesOpportunities])
}
