import mallowConfig from '@/mallow.config'

// Can be switched in mallow.config
const riskFunctions = {
  avg: ({chainRisk, protocolRisk, symbolRisk}) => {
    const maxRisk = Math.max(chainRisk, protocolRisk, symbolRisk)
    const avgRisk = (chainRisk + protocolRisk + symbolRisk) / 3
    const totalRisk = maxRisk + 0.5 * avgRisk
    return Math.min(Math.round(totalRisk), 4)
  },
  max: ({chainRisk, protocolRisk, symbolRisk}) => {
    return Math.max(chainRisk, protocolRisk, symbolRisk)
  },
  weighted: ({chainRisk, protocolRisk, symbolRisk}) => {
    const totalRisk = (0.4 * chainRisk) + (0.3 * protocolRisk) + (0.3 * symbolRisk);
    return Math.min(Math.round(totalRisk), 4);
  },
}

type PropsGetRiskForItem = {
  itemValue: string | number;
  itemType: 'chains' | 'symbols' | 'protocols';
}
const getRiskForItem = ({ itemValue, itemType }: PropsGetRiskForItem) => {
  if (mallowConfig.risks[itemType].hasOwnProperty(itemValue)) {
    return mallowConfig.risks[itemType][itemValue]
  }
  return mallowConfig.risks.defaults[itemType]
}

const getRisksForOpportunityOnChain = ({ platform, symbol, chainId }) => {
  return {
    chainRisk: getRiskForItem({ itemType: 'chains', itemValue: chainId }),
    protocolRisk: getRiskForItem({ itemType: 'protocols', itemValue: platform }),
    symbolRisk: getRiskForItem({ itemType: 'symbols', itemValue: symbol.split('.')[0].toUpperCase() })
  }
}

const getOpportunityRisk = ({ platform, symbol, chainId }) => {
  const riskFunction = riskFunctions[mallowConfig.risks.algo || 'avg']
  const risks = getRisksForOpportunityOnChain({ platform, symbol, chainId })
  return riskFunction(risks)
}

export default getOpportunityRisk
