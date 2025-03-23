'use client';

import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getGroupedRowModel, getSortedRowModel, GroupingState, SortingState, useReactTable } from '@tanstack/react-table'
import MallowTable from './MallowTable'
import PlatformDisplay from './PlatformDisplay'
import { pick } from 'lodash'
import ApyCell from './ApyCell'
import { useMemo, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useOpportunities } from '@/hooks/useOpportunities'
import RiskGauge from './RiskGauge';
import SearchBar from './SearchBar';
import styled from 'styled-components';
import { useDebounce } from 'use-debounce';

const Container = styled.div`
  padding-top: 10px;
`

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
      return (<PlatformDisplay link={metadata?.link} platform={platform} poolName={poolName} symbol={symbol} chainId={chainId} type={type}></PlatformDisplay>)
    }
  }),
  columnHelper.accessor('risk', {
    header: () => 'Risk',
    cell: info => <RiskGauge risk={info.renderValue() as RiskValue}/>,
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

  const [textFilter, setTextFilter] = useState('')
  const [debouncedTextFilter] = useDebounce(textFilter, 500)

  const filteredOpportunities = useMemo(() => {
    const trimmedTextFilter = debouncedTextFilter.trim().toLocaleLowerCase()
    if (trimmedTextFilter === '') {
      return opportunities
    }
    return opportunities.filter(
      op => op.poolName.toLocaleLowerCase().includes(trimmedTextFilter) || op.platform.toLocaleLowerCase().includes(trimmedTextFilter)
    )
  }, [opportunities, debouncedTextFilter])

  const table = useReactTable({
    data: filteredOpportunities,
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
    debugHeaders: true,
    enableSorting: true,
  })

  if (isLoading) {
    return <LoadingSpinner/>
  }
  return <Container>
    <SearchBar autoFocus={true} value={textFilter} onChange={e => setTextFilter(e.target.value)} onClear={() => setTextFilter('')} />
    <MallowTable table={table}/>
  </Container>

}

export default ExploreComponent
