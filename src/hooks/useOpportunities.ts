import { useEffect, useMemo } from 'react'
import { some } from 'lodash'
import { useAaveOpportunities } from './useAaveOpportunities'
import useBeefyOpportunities from './useBeefyOpportunities'
import useSexyDaiOpportunities from './useSexyDaiOpportunities'
import useMorphoOpportunities from './useMorphoOpportunities'

export function useOpportunities() {
  const { data: aaveOpportunities, isLoading: isLoadingAave } = useAaveOpportunities()
  const { data: beefyOpportunities, isLoading: isLoadingBeefy } = useBeefyOpportunities()
  const { data: sexyDaiOpportunities, isLoading: isLoadingSexyDai } = useSexyDaiOpportunities()
  const { data: morphoOpportunities, isLoading: isLoadingMorphoOpportunities } = useMorphoOpportunities()

  const isLoading = useMemo(
    () => {
      return some([isLoadingAave, isLoadingBeefy, isLoadingSexyDai, isLoadingMorphoOpportunities])
    },
    [isLoadingAave, isLoadingBeefy, isLoadingSexyDai, isLoadingMorphoOpportunities]
  )

  const allOpportunities = useMemo(() => [
    ...(aaveOpportunities || []),
    ...(beefyOpportunities || []),
    ...(sexyDaiOpportunities || []),
    ...(morphoOpportunities || []),
  ], [aaveOpportunities, beefyOpportunities, sexyDaiOpportunities, morphoOpportunities])

  return { data: allOpportunities, isLoading }
}
