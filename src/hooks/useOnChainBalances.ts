import { useMemo } from 'react'
import { useAaveBalances } from './useAaveBalances'
import { useMorphoBalances } from './useMorphoBalances'
import { useBeefyBalances } from './useBeefyBalances'
import { useSexyDaiBalances } from './useSexyDaiBalances'
import { some } from 'lodash'

export function useOnChainBalances(accountAddresses: string[]) {
  const { balances: aaveBalances, isLoading: isLoadingAave } = useAaveBalances(accountAddresses)
  const { balances: morphoBalances, isLoading: isLoadingMorpho } = useMorphoBalances(accountAddresses)
  const { balances: beefyBalances, isLoading: isLoadingBeefy } = useBeefyBalances(accountAddresses)
  const { balances: sexyDaiBalances, isLoading: isLoadingSexyDai } = useSexyDaiBalances(accountAddresses)

  const isLoading = useMemo(
    () => some([isLoadingAave, isLoadingMorpho, isLoadingBeefy, isLoadingSexyDai]),
    [isLoadingAave, isLoadingMorpho, isLoadingBeefy, isLoadingSexyDai]
  )

  const allBalances = useMemo(() => [
    ...(aaveBalances || []),
    ...(morphoBalances || []),
    ...(beefyBalances || []),
    ...(sexyDaiBalances || []),
  ], [aaveBalances, morphoBalances, beefyBalances, sexyDaiBalances])

  // Memoize the combination and filtering of balances to avoid unnecessary recalculations.
  const filteredBalances = useMemo(() => {
    return allBalances.flat().filter(b => b.balance > 0)
  }, [allBalances]) // Recompute filtered balances only when allBalances changes.

  return { balances: filteredBalances, isLoading }
}
