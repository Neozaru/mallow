import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import stablecoinAddresses from '@/constants/stablecoinAddresses'

const stablecoinAddressesAndChainArray = stablecoinAddresses.flatMap(({symbol, addresses}) => {
  return Object.entries(addresses).map(([chainId, address]) => ({
    chainId, address, symbol
  }))
})

export function useSpotBalances(accountAddresses: string[]) {
  const { balances: spotTokenBalances, isLoading, error } = useTokenBalances(accountAddresses, stablecoinAddressesAndChainArray)
  return useMemo(() => {
    if (error) {
      console.error(error)
      return { isLoading: false, balances: [] }
    }
    if (isLoading || !spotTokenBalances) {
      return { balances: [], isLoading: true }
    }
    const balances = spotTokenBalances?.map(bal => {
      const { balance, chainId, accountAddress, tokenAddress } = bal
      const { symbol } = stablecoinAddressesAndChainArray.find(d => d.chainId === chainId && d.address === tokenAddress)
      const formattedBalance = formatBalanceWithSymbol(balance, symbol)
      return {
        id: `spot-${symbol}-${chainId}`,
        accountAddress,
        symbol,
        balance,
        balanceUsd: parseFloat(formattedBalance),
        formattedBalance,
        protocol: `${symbol}`,
        poolName: `Spot ${symbol}`,
        chainId,
        apy: 0,
        type: 'spot'
      }
    })
    return { balances, isLoading: false }
  }, [isLoading, spotTokenBalances, error])
}
