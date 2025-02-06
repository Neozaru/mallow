import { useMemo } from 'react'
import { useAaveBalances } from './useAaveBalances'
import { useMorphoBalances } from './useMorphoBalances'
import { useBeefyBalances } from './useBeefyBalances'
import { useSexyDaiBalances } from './useSexyDaiBalances'
import { some } from 'lodash'
import { useSpotBalances } from './useSpotBalances'
import { useSSRBalances } from './useSSRBalances'
import { Address } from 'viem'

export function useOnChainBalances(accountAddresses: Address[]): LoadableData<YieldPositionAny[]> {
  const { data: spotBalances, isLoading: isLoadingSpot } = useSpotBalances(accountAddresses)
  const { data: aaveBalances, isLoading: isLoadingAave } = useAaveBalances(accountAddresses)
  const { data: morphoBalances, isLoading: isLoadingMorpho } = useMorphoBalances(accountAddresses)
  const { data: beefyBalances, isLoading: isLoadingBeefy } = useBeefyBalances(accountAddresses)
  const { data: sexyDaiBalances, isLoading: isLoadingSexyDai } = useSexyDaiBalances(accountAddresses)
  const { data: ssrBalances, isLoading: isLoadingSSR } = useSSRBalances(accountAddresses)

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

  const filteredBalances = useMemo<YieldPositionAny[]>(() => {
    return allBalances.flat().filter(b => b.balance > 0)
  }, [allBalances])

  return { data: filteredBalances, isLoading }
}
