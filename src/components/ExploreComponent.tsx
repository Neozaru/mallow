'use client';

import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getGroupedRowModel, getSortedRowModel, GroupingState, SortingState, useReactTable } from '@tanstack/react-table'
import MallowTable from './MallowTable'
import PlatformDisplay from './PlatformDisplay'
import { pick } from 'lodash'
import ApyCell from './ApyCell'
import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useOpportunities } from '@/hooks/useOpportunities'
import RiskCell from './RiskCell';

const columnHelper = createColumnHelper<YieldOpportunityOnChain>()

const columns = [
  columnHelper.accessor(row => pick(row, ['metadata', 'platform', 'poolName', 'symbol', 'chainId', 'type']), {
    id: 'platform',
    header: () => <span>Opportunity</span>,
    sortingFn: 'alphanumeric',
    aggregationFn: 'uniqueCount',
    enableGrouping: false,
    cell: info => {
      const { metadata, platform, poolName, symbol, chainId, type } = info.getValue()
      return (<PlatformDisplay link={metadata?.link} platform={platform} pool={poolName} symbol={symbol} chainId={chainId} type={type}></PlatformDisplay>)
    }
  }),
  columnHelper.accessor('risk', {
    header: () => 'Risk',
    cell: info => <RiskCell risk={info.renderValue()}/>,
    sortingFn: 'basic',
    aggregationFn: 'mean',
    enableGrouping: false,
  }),
  columnHelper.accessor('apy', {
    header: () => 'Apy',
    cell: info => <ApyCell apy={info.renderValue()}/>,
    sortingFn: 'basic',
    aggregationFn: 'mean',
    enableGrouping: false,
  })
]

const ExploreComponent = () => {
  const [sorting, setSorting] = useState<SortingState>([{id: 'apy', desc: true}])
  const [grouping, setGrouping] = useState<GroupingState>([])
  const { data: opportunities, isLoading } = useOpportunities()

  const table = useReactTable({
    data: opportunities,
    columns,
    initialState: {
      columnVisibility: { accountAddress: false, chainId: false },
    },
    state: {
      sorting,
      grouping,
    },
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // debugTable: true,
    debugHeaders: true,
    enableSorting: true,
  })

  return isLoading ? <LoadingSpinner/> : <MallowTable table={table}/>

}

export default ExploreComponent
