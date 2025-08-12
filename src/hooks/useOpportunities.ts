import { useMemo } from 'react'
import { some } from 'lodash'
import { useAaveOpportunities } from './useAaveOpportunities'
import useBeefyOpportunities from './useBeefyOpportunities'
import useSexyDaiOpportunities from './useSexyDaiOpportunities'
import useMorphoOpportunities from './useMorphoOpportunities'
import { usePendleOpportunities } from './usePendleOpportunities'
import { useAaveStakingOpportunities } from './useAaveStakingOpportunities'

export function useOpportunities() {
  const { data: aaveOpportunities, isLoading: isLoadingAave } = useAaveOpportunities()
  const { data: aaveStakingOpportunities, isLoading: isLoadingAaveStaking } = useAaveStakingOpportunities()
  const { data: beefyOpportunities, isLoading: isLoadingBeefy } = useBeefyOpportunities()
  const { data: sexyDaiOpportunities, isLoading: isLoadingSexyDai } = useSexyDaiOpportunities()
  const { data: morphoOpportunities, isLoading: isLoadingMorpho } = useMorphoOpportunities()
  const { data: pendleOpportunities, isLoading: isLoadingPendle } = usePendleOpportunities()

  const isLoading = useMemo(
    () => {
      return some([isLoadingAave, isLoadingAaveStaking, isLoadingBeefy, isLoadingSexyDai, isLoadingMorpho, isLoadingPendle])
    },
    [isLoadingAave, isLoadingAaveStaking, isLoadingBeefy, isLoadingSexyDai, isLoadingMorpho, isLoadingPendle]
  )

  const allOpportunities = useMemo(() => [
    ...(aaveOpportunities || []),
    ...(aaveStakingOpportunities || []),
    ...(beefyOpportunities || []),
    ...(sexyDaiOpportunities || []),
    ...(morphoOpportunities || []),
    ...(pendleOpportunities || []),
  ], [aaveOpportunities, aaveStakingOpportunities, beefyOpportunities, sexyDaiOpportunities, morphoOpportunities, pendleOpportunities])
  return { data: allOpportunities, isLoading }
}
