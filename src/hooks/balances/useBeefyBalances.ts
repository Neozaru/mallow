import { useMemo } from 'react';
import { useBeefyData } from '../useBeefyData';
import { useTokenBalances } from './useTokenBalances';
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import { Address, formatUnits } from 'viem';
import useBeefyOpportunities from '../useBeefyOpportunities';
import { find } from 'lodash';

const initialTokenConfig = []
export function useBeefyBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { vaults, boosts } = useBeefyData()
  const { data: opportunities } = useBeefyOpportunities()

  const beefyTokenConfigs = useMemo(() => {
    if (!opportunities) {
      return initialTokenConfig
    }
    return opportunities.map(({ chainId, poolTokenAddress }) => ({ chainId, address: poolTokenAddress }))
  }, [opportunities])

  const { data: balancesOpportunities } = useTokenBalances(accountAddresses, beefyTokenConfigs)

  return useMemo(() => {
    if (!balancesOpportunities || !vaults || !boosts) {
      return { balances: [], isLoading: true }
    }

    const balances = balancesOpportunities.map(bal => {
      const opportunity: YieldOpportunityOnChain = find(opportunities, { chainId: bal.chainId, poolTokenAddress: bal.tokenAddress })!
      const { balance: sharesBalance, accountAddress } = bal
      const { id, symbol } = opportunity
      const isBoost = id.startsWith('moo_')

      const vaultId = isBoost ? find(boosts, { id })?.poolId : id

      // Calculate USD value of owned vault shares
      const correspondingVault = find(vaults, { id: vaultId })!
      const { pricePerFullShare } = correspondingVault
      const balance = BigInt(
        parseInt(formatUnits(BigInt(sharesBalance) * BigInt(pricePerFullShare), 18))
      )
      const formattedBalance = formatBalanceWithSymbol(balance, symbol)
      return {
        accountAddress,
        balance,
        balanceUsd: parseFloat(formattedBalance),
        formattedBalance,
        ...opportunity
      }
    })
    return { data: balances, isLoading: false }
  }, [vaults, boosts, opportunities, balancesOpportunities])
}
