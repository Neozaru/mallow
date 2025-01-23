import { useEffect, useMemo, useState } from 'react';
import { useBeefyData } from './useBeefyData';
import { useTokenBalances } from './useTokenBalances';
import { formatBalanceWithSymbol } from '../lib/formatBalanceWithSymbol';
import { formatUnits } from 'viem';

function makeTokenConfigFromBeefyData(beefyData: {earnContractAddress: string, chainId: number}[]) {
  if (!beefyData) {
    return []
  }
  return beefyData.map(d => {
    return {
      address: d.earnContractAddress,
      chainId: d.chainId
    }
  })
}

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

export function useBeefyBalances(accountAddresses: string[]) {
  const [beefyTokenConfigsVaults, setBeefyTokenConfigsVaults] = useState([])
  const [beefyTokenConfigsBoosts, setBeefyTokenConfigsBoosts] = useState([])
  const { balances: balancesVaults } = useTokenBalances(accountAddresses, beefyTokenConfigsVaults);
  const { balances: balancesBoosts } = useTokenBalances(accountAddresses, beefyTokenConfigsBoosts);

  const { vaults, boosts, apys } = useBeefyData()
  
  useEffect(() => {
    if (!vaults) {
      return
    }
    setBeefyTokenConfigsVaults(
      makeTokenConfigFromBeefyData(vaults)
    )
  }, [vaults])

  useEffect(() => {
    if (!boosts) {
      return
    }
    setBeefyTokenConfigsBoosts(
      makeTokenConfigFromBeefyData(boosts)
    )
  }, [boosts])

  return useMemo(() => {
    if (!balancesVaults || !balancesBoosts || !apys) {
      return { balances: [], isLoading: true }
    }

    const beefyBalancesVaults = balancesVaults?.map((bal, i) => {
      const { balance: sharesBalance, accountAddress } = bal 
      if (!sharesBalance) return null

      const { id, chainId, token } = vaults[i]
      const symbol = token
      const balance = sharesBalance
      const formattedBalance = formatBalanceWithSymbol(balance, symbol)
      return {
        id,
        accountAddress,
        symbol,
        balance,
        balanceUsd: parseFloat(formattedBalance),
        formattedBalance,
        protocol: 'beefy',
        poolName: id,
        chainId,
        boost: false,
      }
    }) || []

    const beefyBalancesBoosts = balancesBoosts?.map((bal, i) => {
      const { balance: sharesBalance, accountAddress } = bal
      if (!sharesBalance) return null
      const { poolId } = boosts[i]

      const correspondingVault = vaults.find(v => v.id === poolId)
      const apy = apys[correspondingVault.id]

      const { chainId, token, pricePerFullShare } = correspondingVault
      const symbol = token
      const balance = parseInt(
        formatUnits(sharesBalance * BigInt(pricePerFullShare), 18)
      )
      const formattedBalance = formatBalanceWithSymbol(BigInt(balance), symbol)
      return {
        id: poolId,
        accountAddress,
        symbol,
        balance,
        balanceUsd: parseFloat(formattedBalance),
        formattedBalance,
        protocol: 'beefy',
        poolName: poolId.split('-').map(capitalize).join(' '),
        chainId,
        boost: true,
        apy
      }
    }) || []
    const balances = [...beefyBalancesVaults, ...beefyBalancesBoosts].filter(item => item !== null)
    return { balances, isLoading: false }
  }, [balancesVaults, balancesBoosts, vaults, boosts, apys])
}
