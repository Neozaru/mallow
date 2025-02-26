import { useMemo } from 'react'
import { some } from 'lodash'
import { useAaveOpportunities } from './useAaveOpportunities'
import useBeefyOpportunities from './useBeefyOpportunities'
import useSexyDaiOpportunities from './useSexyDaiOpportunities'
import useMorphoOpportunities from './useMorphoOpportunities'
import { usePendleOpportunities } from './usePendleOpportunities'

export function useOpportunities() {
  const { data: aaveOpportunities, isLoading: isLoadingAave } = useAaveOpportunities()
  const { data: beefyOpportunities, isLoading: isLoadingBeefy } = useBeefyOpportunities()
  const { data: sexyDaiOpportunities, isLoading: isLoadingSexyDai } = useSexyDaiOpportunities()
  const { data: morphoOpportunities, isLoading: isLoadingMorpho } = useMorphoOpportunities()
  const { data: pendleOpportunities, isLoading: isLoadingPendle } = usePendleOpportunities()

  const isLoading = useMemo(
    () => {
      return some([isLoadingAave, isLoadingBeefy, isLoadingSexyDai, isLoadingMorpho, isLoadingPendle])
    },
    [isLoadingAave, isLoadingBeefy, isLoadingSexyDai, isLoadingMorpho, isLoadingPendle]
  )

  const allOpportunities = useMemo(() => [
    ...(aaveOpportunities || []),
    ...(beefyOpportunities || []),
    ...(sexyDaiOpportunities || []),
    ...(morphoOpportunities || []),
    ...(pendleOpportunities || []),
  ], [aaveOpportunities, beefyOpportunities, sexyDaiOpportunities, morphoOpportunities, pendleOpportunities])

  return { data: allOpportunities, isLoading }
}
