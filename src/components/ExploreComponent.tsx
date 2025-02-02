import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getGroupedRowModel, getSortedRowModel, GroupingState, SortingState, useReactTable } from '@tanstack/react-table'
import MallowTable from './MallowTable'
import PlatformDisplay from './PlatformDisplay'
import { pick } from 'lodash'
import ApyCell from './ApyCell'
import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useOpportunities } from '@/hooks/useOpportunities'

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor(row => pick(row, ['protocol', 'poolName', 'symbol', 'chainId', 'type']), {
    id: 'platform',
    header: () => <span>Position</span>,
    sortingFn: 'alphanumeric',
    aggregationFn: 'uniqueCount',
    enableGrouping: false,
    cell: info => {
      const { protocol, poolName, symbol, chainId, type } = info.getValue()
      return (<PlatformDisplay platform={protocol} pool={poolName} symbol={symbol} chainId={chainId} type={type}></PlatformDisplay>)
    }
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
