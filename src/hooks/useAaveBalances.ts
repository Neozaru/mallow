import { useEffect, useMemo, useState } from 'react';
import { useTokenBalances } from './useTokenBalances';
import { useAaveStablecoinData } from './useAaveStablecoinData';
import { formatBalanceWithSymbol } from '../lib/formatBalanceWithSymbol';

// Custom hook to fetch Aave balances
export function useAaveBalances(accountAddresses: string[]) {
  const [aaveTokenConfigs, setAaveTokenConfigs] = useState([]);
  const { balances: aTokenBalances, isLoading: isLoadingBalances } = useTokenBalances(accountAddresses, aaveTokenConfigs);
  const { data: aaveStablecoinData, isLoading: isLoadingStablecoinData } = useAaveStablecoinData()

  useEffect(() => {
    if (!aaveStablecoinData) {
      return
    }
    const fetchData = async () => {
      const tokenConfigs = aaveStablecoinData.map(({ aTokenAddress, chainId }) => ({
        address: aTokenAddress,
        chainId
      }))
      return tokenConfigs
    }
    fetchData().then(setAaveTokenConfigs)
  }, [aaveStablecoinData])

  return useMemo(() => {
    if (isLoadingBalances || isLoadingStablecoinData || !aaveStablecoinData || !aaveTokenConfigs) {
      return { balances: [], isLoading: true }
    }
    const balances = aTokenBalances?.map(bal => {
      const { balance, chainId, accountAddress, tokenAddress } = bal
      const { id, symbol, apy } = aaveStablecoinData.find(d => d.aTokenAddress === tokenAddress)
      // Assuming not legitimate stablecoin with ever start with 'A'.
      const isNewAToken = symbol.startsWith('A')
      const spotTokenSymbol = isNewAToken ? symbol.slice(1) : symbol
      const formattedBalance = formatBalanceWithSymbol(balance, spotTokenSymbol)
      return {
        id,
        accountAddress,
        symbol: spotTokenSymbol,
        balance,
        balanceUsd: parseFloat(formattedBalance),
        formattedBalance,
        protocol: 'aave',
        poolName: `Aave ${spotTokenSymbol}`,
        chainId,
        apy,
        type: 'dapp'
      }
    })
    return { balances, isLoading: false }
  }, [aTokenBalances, aaveStablecoinData, aaveTokenConfigs, isLoadingBalances, isLoadingStablecoinData])
}
