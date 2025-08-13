import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';
import { formatBalanceWithSymbol } from '../../lib/formatBalanceWithSymbol';
import stablecoinAddresses from '@/constants/stablecoinAddresses'
import { Address } from 'viem';

type TokenConfigAndSymbol = TokenConfig & {
  symbol: string;
}

const stablecoinAddressesAndChainArray: TokenConfigAndSymbol[] = stablecoinAddresses.flatMap(({symbol, addresses}) => {
  return Object.entries(addresses).map(([chainId, address]) => ({
    chainId: Number(chainId), address, symbol
  }))
})

export function useSpotBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: spotTokenBalances, isLoading, error, refetch } = useTokenBalances(accountAddresses, stablecoinAddressesAndChainArray)
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
      const { symbol } = stablecoinAddressesAndChainArray.find(d => d.chainId === chainId && d.address === tokenAddress)!
      const formattedBalance = formatBalanceWithSymbol(balance, symbol)
      return {
        id: `spot-${symbol.toLocaleLowerCase()}-${chainId}`,
        accountAddress,
        symbol,
        poolTokenAddress: tokenAddress,
        poolAddress: tokenAddress,
        balance,
        balanceUnderlying: parseFloat(formattedBalance),
        formattedBalance,
        platform: 'spot' as const,
        poolName: `Spot ${symbol}`,
        chainId,
        apy: 0,
        type: 'onchain' as const,
        isSpot: true
      }
    }) || []
    return { data: balances, isLoading: false, refetch }
  }, [isLoading, spotTokenBalances, error, refetch])
}
