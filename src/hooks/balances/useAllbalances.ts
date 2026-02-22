import { useCallback, useMemo } from 'react'
import useExchangeBalances from './useExchangeBalances'
import { useOnChainBalances } from './useOnChainBalances'
import useCurrencyRates from '../useCurrencyRates'

const emptyArray = []

const useAllBalances = ({
  accountAddresses,
  manualPositions,
  enableExchanges = false
}) => {

  const { data: exchangeBalances, isLoading: isExchangeBalancesLoading } = useExchangeBalances(enableExchanges)
  const { data: onChainBalances, isLoading: isOnChainBalancesLoading } = useOnChainBalances(accountAddresses)

  const isLoading = useMemo(() => {
    return isOnChainBalancesLoading || isExchangeBalancesLoading
  }, [isOnChainBalancesLoading, isExchangeBalancesLoading])

  const { data: currencyRates } = useCurrencyRates()
  const addBalanceUsd = useCallback((position: YieldPositionOnChain) => {
    let balanceUsd = position.balanceUnderlying
    // TODO: More generic instead of just EUR/JPY.
    if (currencyRates && currencyRates['EUR'] && position.symbol.includes('EUR')) {
      balanceUsd = position.balanceUnderlying * currencyRates['EUR']
    } else if (currencyRates && currencyRates['JPY'] && position.symbol.includes('JPY')) {
      balanceUsd = position.balanceUnderlying * currencyRates['JPY']
    }
    return {
      ...position,
      balanceUsd
    }
  }, [currencyRates])

  const allBalances: YieldPositionAnyWithBalanceUsd[] = useMemo<YieldPositionAnyWithBalanceUsd[]>(() => {
    if (isLoading) {
      return []
    }
    return [
      ...(onChainBalances || emptyArray),
      ...(exchangeBalances || emptyArray),
      ...(manualPositions || emptyArray),
    ].map(addBalanceUsd)
  }, [
    onChainBalances,
    exchangeBalances,
    manualPositions,
    isLoading,
    addBalanceUsd
  ])

  return {
    data: allBalances,
    isLoading
  }
}

export default useAllBalances
