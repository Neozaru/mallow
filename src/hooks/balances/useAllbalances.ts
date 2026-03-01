import { useCallback, useMemo } from 'react'
import useExchangeBalances from './useExchangeBalances'
import { useOnChainBalances } from './useOnChainBalances'
import useCurrencyRates from '../useCurrencyRates'

const emptyArray = []

const supportedCurrencies = ['USD', 'EUR', 'JPY', 'BTC']

const getPositionCurrency = (position: YieldPositionOnChain) => {
  const { symbol } = position
  const currencyFromSymbol = supportedCurrencies.find(currency => symbol.includes(currency))
  if (currencyFromSymbol) {
    return currencyFromSymbol
  }
  return 'USD';
}

const addCurrency = (position: YieldPositionOnChain) => {
  return {
    ...position,
    currency: getPositionCurrency(position)
  }
}

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

  const addBalanceUsd = useCallback((position: YieldPositionOnChain & WithCurrency) => {
    const rate = currencyRates && position.currency !== 'USD' ? currencyRates[position.currency] : 1
    const balanceUsd = position.balanceUnderlying * rate
    console.warn('=== Adding balanceUsd to position', { position, rate, balanceUsd })
    return {
      ...position,
      balanceUsd,
    }
  }, [currencyRates])

  const allBalances: YieldPositionAnyWithCurrencyInfo[] = useMemo<YieldPositionAnyWithCurrencyInfo[]>(() => {
    if (isLoading) {
      return []
    }
    return [
      ...(onChainBalances || emptyArray),
      ...(exchangeBalances || emptyArray),
      ...(manualPositions || emptyArray),
    ]
    .map(addCurrency)
    .map(addBalanceUsd)
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
