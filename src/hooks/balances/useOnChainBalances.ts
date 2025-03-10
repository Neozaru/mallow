import { useMemo } from 'react'
import { Address } from 'viem'
import { some } from 'lodash'
import { useAaveBalances } from './useAaveBalances'
import { useMorphoBalances } from './useMorphoBalances'
import { useBeefyBalances } from './useBeefyBalances'
import { useSexyDaiBalances } from './useSexyDaiBalances'
import { useSpotBalances } from './useSpotBalances'
import { useSSRBalances } from './useSSRBalances'
import { usePendleBalances } from './usePendleBalances'

export function useOnChainBalances(accountAddresses: Address[]): LoadableData<YieldPositionAny[]> {
  const { data: spotBalances, isLoading: isLoadingSpot } = useSpotBalances(accountAddresses)
  const { data: aaveBalances, isLoading: isLoadingAave } = useAaveBalances(accountAddresses)
  const { data: morphoBalances, isLoading: isLoadingMorpho } = useMorphoBalances(accountAddresses)
  const { data: beefyBalances, isLoading: isLoadingBeefy } = useBeefyBalances(accountAddresses)
  const { data: sexyDaiBalances, isLoading: isLoadingSexyDai } = useSexyDaiBalances(accountAddresses)
  const { data: ssrBalances, isLoading: isLoadingSSR } = useSSRBalances(accountAddresses)
  const { data: pendleBalances, isLoading: isLoadingPendle } = usePendleBalances(accountAddresses)
  const isLoading = useMemo(
    () => {
      return some([isLoadingSpot, isLoadingAave, isLoadingMorpho, isLoadingBeefy, isLoadingSexyDai, isLoadingSSR, isLoadingPendle])
    },
    [isLoadingSpot, isLoadingAave, isLoadingMorpho, isLoadingBeefy, isLoadingSexyDai, isLoadingSSR, isLoadingPendle]
  )

  const allBalances = useMemo(() => [
    ...(spotBalances || []),
    ...(aaveBalances || []),
    ...(morphoBalances || []),
    ...(beefyBalances || []),
    ...(sexyDaiBalances || []),
    ...(ssrBalances || []),
    ...(pendleBalances || []),
  ], [spotBalances, aaveBalances, morphoBalances, beefyBalances, sexyDaiBalances, ssrBalances, pendleBalances])

  const filteredBalances = useMemo<YieldPositionAny[]>(() => {
    return allBalances.flat().filter(b => b.balance > 0)
  }, [allBalances])

  return { data: filteredBalances, isLoading }
}
