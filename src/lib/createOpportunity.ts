import getOpportunityRisk from './getOpportunityRisk'


const createOpportunity = params => {
  return {
    ...params,
    risk: getOpportunityRisk({...params})
  }
}

export default createOpportunity
