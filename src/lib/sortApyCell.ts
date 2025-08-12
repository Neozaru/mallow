import { SortingFn } from '@tanstack/react-table'

const sortApyCell: SortingFn<YieldOpportunityBase> = (rowA, rowB, columnId) => {
  const apyA = rowA.getValue<YieldOpportunityBase>(columnId).apy
  const apyB = rowB.getValue<YieldOpportunityBase>(columnId).apy
  return Number(apyA > apyB) - Number(apyA < apyB)
}

export default sortApyCell
