import getOpportunityRisk from './getOpportunityRisk'

const createOpportunity = params => {
  return {
    ...params,
    poolAddress: params.poolAddress || params.poolTokenAddress,
    risk: getOpportunityRisk({...params})
  }
}

export default createOpportunity
