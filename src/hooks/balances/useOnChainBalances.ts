import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { some } from 'lodash'
import { useAaveBalances } from './useAaveBalances'
import { useBeefyBalances } from './useBeefyBalances'
import { useSexyDaiBalances } from './useSexyDaiBalances'
import { useSpotBalances } from './useSpotBalances'
import { useSSRBalances } from './useSSRBalances'
import { usePendleBalances } from './usePendleBalances'
import { useMorphoOnChainBalances } from './useMorphoOnChainBalances'
import { useAaveStakingBalances } from './useAaveStakingBalances'

export function useOnChainBalances(accountAddresses: Address[]): LoadableData<YieldPositionAny[]> {
  const { data: spotBalances, isLoading: isLoadingSpot, refetch: refetchSpotBalances } = useSpotBalances(accountAddresses)
  const { data: aaveBalances, isLoading: isLoadingAave, refetch: refetchAaveBalances } = useAaveBalances(accountAddresses)
  const { data: aaveStakingBalances, isLoading: isLoadingAaveStaking, refetch: refetchAaveStakingBalances } = useAaveStakingBalances(accountAddresses)
  const { data: morphoBalances, isLoading: isLoadingMorpho, refetch: refetchMorphoBalances } = useMorphoOnChainBalances(accountAddresses)
  const { data: beefyBalances, isLoading: isLoadingBeefy, refetch: refetchBeefyBalances } = useBeefyBalances(accountAddresses)
  const { data: sexyDaiBalances, isLoading: isLoadingSexyDai, refetch: refetchSexyDaiBalances } = useSexyDaiBalances(accountAddresses)
  const { data: ssrBalances, isLoading: isLoadingSSR, refetch: refetchSSRBalances } = useSSRBalances(accountAddresses)
  const { data: pendleBalances, isLoading: isLoadingPendle, refetch: refetchPendleBalances } = usePendleBalances(accountAddresses)
  const isLoading = useMemo(
    () => {
      return some([isLoadingSpot, isLoadingAave, isLoadingAaveStaking, isLoadingMorpho, isLoadingBeefy, isLoadingSexyDai, isLoadingSSR, isLoadingPendle])
    },
    [isLoadingSpot, isLoadingAave, isLoadingAaveStaking, isLoadingMorpho, isLoadingBeefy, isLoadingSexyDai, isLoadingSSR, isLoadingPendle]
  )

  const allBalances = useMemo(() => [
    ...(spotBalances || []),
    ...(aaveBalances || []),
    ...(aaveStakingBalances || []),
    ...(morphoBalances || []),
    ...(beefyBalances || []),
    ...(sexyDaiBalances || []),
    ...(ssrBalances || []),
    ...(pendleBalances || []),
  ], [spotBalances, aaveBalances, aaveStakingBalances, morphoBalances, beefyBalances, sexyDaiBalances, ssrBalances, pendleBalances])

  const refetchAll = useCallback(() => {
    refetchSpotBalances?.()
    refetchAaveBalances?.()
    refetchAaveStakingBalances?.()
    refetchMorphoBalances?.()
    refetchBeefyBalances?.()
    refetchSexyDaiBalances?.()
    refetchSSRBalances?.()
    refetchPendleBalances?.() 
  }, [refetchSpotBalances, refetchAaveBalances, refetchAaveStakingBalances, refetchMorphoBalances, refetchBeefyBalances, refetchSexyDaiBalances, refetchSSRBalances, refetchPendleBalances]) 

  const filteredBalances = useMemo<YieldPositionAny[]>(() => {
    return allBalances.flat().filter(b => b.balance > 0)
  }, [allBalances])

  return { data: filteredBalances, isLoading, refetch: refetchAll }
}
