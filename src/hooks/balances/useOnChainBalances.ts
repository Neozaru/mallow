import { useMemo } from 'react'
import { useAaveBalances } from './useAaveBalances'
import { useMorphoBalances } from './useMorphoBalances'
import { useBeefyBalances } from './useBeefyBalances'
import { useSexyDaiBalances } from './useSexyDaiBalances'
import { some } from 'lodash'
import { useSpotBalances } from './useSpotBalances'
import { useSSRBalances } from './useSSRBalances'

export function useOnChainBalances(accountAddresses: string[]) {
  const { balances: spotBalances, isLoading: isLoadingSpot } = useSpotBalances(accountAddresses)
  const { balances: aaveBalances, isLoading: isLoadingAave } = useAaveBalances(accountAddresses)
  const { balances: morphoBalances, isLoading: isLoadingMorpho } = useMorphoBalances(accountAddresses)
  const { balances: beefyBalances, isLoading: isLoadingBeefy } = useBeefyBalances(accountAddresses)
  const { balances: sexyDaiBalances, isLoading: isLoadingSexyDai } = useSexyDaiBalances(accountAddresses)
  const { balances: ssrBalances, isLoading: isLoadingSSR } = useSSRBalances(accountAddresses)

  const isLoading = useMemo(
    () => {
      return some([isLoadingSpot, isLoadingAave, isLoadingMorpho, isLoadingBeefy, isLoadingSexyDai, isLoadingSSR])
    },
    [isLoadingSpot, isLoadingAave, isLoadingMorpho, isLoadingBeefy, isLoadingSexyDai, isLoadingSSR]
  )

  const allBalances = useMemo(() => [
    ...(spotBalances || []),
    ...(aaveBalances || []),
    ...(morphoBalances || []),
    ...(beefyBalances || []),
    ...(sexyDaiBalances || []),
    ...(ssrBalances || []),
  ], [spotBalances, aaveBalances, morphoBalances, beefyBalances, sexyDaiBalances, ssrBalances])

  const filteredBalances = useMemo(() => {
    return allBalances.flat().filter(b => b.balance > 0)
  }, [allBalances])

  return { balances: filteredBalances, isLoading }
}
