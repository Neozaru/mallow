"use client";

import { useOnChainBalances } from '@/hooks/balances/useOnChainBalances';
import { pick, sumBy } from 'lodash'
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getGroupedRowModel, getSortedRowModel, GroupingState, Row, SortingState, useReactTable } from '@tanstack/react-table';
import PlatformDisplay from './PlatformDisplay';
import getChainName from '@/utils/getChainName';
import MallowTable from './MallowTable';
import ApyCell from './ApyCell';
import LoadingSpinner from './LoadingSpinner';
import { Address } from 'viem';
import useExchangeBalances from '@/hooks/balances/useExchangeBalances';
import EthereumAddress from './EthereumAddress';

type AllBalancesProps = {
  accountAddresses: Array<Address> | [];
  manualPositions: Array<YieldPositionManual> | [];
  enableExchanges: boolean;
};

const formatUsdBalance = (balance: number, minimumFractionDigits = 0, maximumFractionDigits = 0)  => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(balance);
};

const ComponentHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 10px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Summary = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  color: #fff;
`;

const Total = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0px;
`;

const TotalWithAPY = styled.div`
  display: flex;
  flex-direction: column;
`;

const Details = styled.div`
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.3rem;
  color: #b4b0c4;

`;

const APY = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #b4b0c4;
`;

const Earnings = styled.div`
  text-align: right;
  span {
    display: block;
  }
`;

const NothingToShowWrapper = styled.div`
  text-align: center;
  padding: 50px;
`;

const NothingToShow = styled.div`
  font-size: 32px;
  text-align: center;
`;

const columnHelper = createColumnHelper<YieldPositionExchange | YieldPositionOnChain | YieldPositionManual>()

const balanceSortingFn = (rowA, rowB) => {
  return rowA.original.balanceUsd > rowB.original.balanceUsd
  ? 1
  : -1
}

const balanceAggregationFn = (columnId, leafRows: Row<YieldPositionAny>[]) => {
  const res = sumBy(leafRows, leafRow => (leafRow.getUniqueValues<YieldPositionAny>('balance')[0]).balanceUsd)
  return {
    balanceUsd: res
  }
}

const Balance = styled.span`
  color: #b4b0c4;
  font-size: 13px;
`

const BalancesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const GrandTotal = styled.div`
  font-size: 13px;
  color: #b4b0c4;
  display: none;
`

const columns = [
  columnHelper.accessor(row => row, {
    id: 'platform',
    header: () => <span>Position</span>,
    sortingFn: 'alphanumeric',
    aggregationFn: 'uniqueCount',
    enableGrouping: false,
    cell: info => {
      const value = info.getValue()
      const { metadata, poolName, symbol, type } = value
      const chainId = value.type === 'onchain' ? value.chainId : undefined
      const platform = value.type !== 'manual' ? value.platform : undefined
      return (<PlatformDisplay link={metadata?.link} platform={platform} pool={poolName} symbol={symbol} chainId={chainId} type={type}></PlatformDisplay>)
    }
  }),
  columnHelper.accessor(row => pick(row, ['formattedBalance', 'balanceUsd', 'symbol', 'type']), {
    id: 'balance',
    header: () => <span>Balance</span>,
    cell: info => {
      const { balanceUsd, formattedBalance, symbol, type } = info.getValue() as YieldPositionAny
      return (
      <BalancesWrapper>
        {balanceUsd >= 0 && <span>${formatUsdBalance(balanceUsd)}<br/></span>}
        {type !== 'manual' && Number(formattedBalance) >= 0 && <Balance>{formatUsdBalance(Number(formattedBalance))} {symbol}</Balance>}
      </BalancesWrapper>)
    },
    footer: info => info.column.id,
    sortingFn: balanceSortingFn,
    aggregationFn: balanceAggregationFn,
    enableGrouping: false,
  }),
  columnHelper.accessor('accountAddress', {
    header: () => 'Account',
    cell: info => {
      const value = info.renderValue()
      return value ? <EthereumAddress address={value} enableCopy={true}/> : ''
    },
    enableGrouping: false,
    enableHiding: true
  }),
  columnHelper.accessor('apy', {
    header: () => 'Apy',
    cell: info => <ApyCell apy={info.renderValue()}/>,
    sortingFn: 'basic',
    aggregationFn: 'mean',
    enableGrouping: false,
  }),
  columnHelper.accessor('chainId', {
    header: 'Chain',
    cell: info => info.getValue() ? getChainName(info.getValue()) : '',
    sortingFn: 'alphanumeric',
    aggregationFn: 'uniqueCount',
    enableGrouping: false,
    enableHiding: true
  }),
]

const AllBalances: React.FC<AllBalancesProps> = ({accountAddresses, manualPositions, enableExchanges = false}) => {

  const { data: exchangeBalances, isLoading: isExchangeBalancesLoading } = useExchangeBalances(enableExchanges)
  const { data: onChainBalances, isLoading: isOnChainBalancesLoading } = useOnChainBalances(accountAddresses)

  const allBalances: YieldPositionAny[] = useMemo<YieldPositionAny[]>(() => {
    if (isOnChainBalancesLoading || isExchangeBalancesLoading) {
      return []
    }
    return [
      ...(onChainBalances || []),
      ...(exchangeBalances || []),
      ...(manualPositions || []),
    ]
  }, [
    onChainBalances,
    exchangeBalances,
    manualPositions,
    isOnChainBalancesLoading,
    isExchangeBalancesLoading
  ])

  const smallBalancesHideAmount = 1

  const hideZeroApy = false
  
  const allBalancesFiltered = useMemo(() => {
    return allBalances.filter(({ balanceUsd, apy }) => balanceUsd >= smallBalancesHideAmount && (!hideZeroApy || apy > 0))
  }, [allBalances, hideZeroApy])


  const balancesSum = useMemo(
    () => sumBy(allBalancesFiltered, 'balanceUsd'),
    [allBalancesFiltered]
  )

  const balancesGrandTotal = useMemo(
    () => sumBy(allBalances, 'balanceUsd'),
    [allBalances]
  )

  const averageAPY = useMemo(
    () => {
      return allBalancesFiltered.reduce((acc, bal) => acc + bal.apy * bal.balanceUsd, 0) / balancesSum
    },
    [allBalancesFiltered, balancesSum]
  )
  
  const earnings = useMemo(() => {
    const year = averageAPY * balancesSum
    return {
      year,
      month: year / 12,
      day: year / 365
    }
  }, [balancesSum, averageAPY])

  const hasEnoughBalance = useMemo(() => balancesSum > smallBalancesHideAmount, [balancesSum, smallBalancesHideAmount])
  
  const [sorting, setSorting] = useState<SortingState>([{id: 'balance', desc: true}])
  const [grouping, setGrouping] = React.useState<GroupingState>([])

  const isLoading = useMemo(() => {
    return isOnChainBalancesLoading || isExchangeBalancesLoading
  }, [isOnChainBalancesLoading, isExchangeBalancesLoading])

  const table = useReactTable({
    data: allBalancesFiltered,
    columns,
    initialState: {
      columnVisibility: { chainId: false, accountAddress: false },
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
    sortingFns: {
      balanceSortingFn
    },
    aggregationFns: {
      balanceAggregationFn
    },
    // debugTable: true,
    debugHeaders: true,
    enableSorting: true,
  })

  return isLoading ? <LoadingSpinner/>
    : <>
        <ComponentHeader>
          <Summary>
            <TotalWithAPY>
              <Total>${formatUsdBalance(balancesSum, 0, 0)}{hideZeroApy && <GrandTotal>/${formatUsdBalance(balancesGrandTotal, 0, 0)}</GrandTotal>}</Total>
              <APY>{(hasEnoughBalance ? averageAPY*100 : 0).toFixed(2)}% APY</APY>
            </TotalWithAPY>
            {hasEnoughBalance && <Details>
              <Earnings>
                <span>Year ${formatUsdBalance(earnings.year, 0, 0)}</span>
                <span>Month ${formatUsdBalance(earnings.month, 0, 0)}</span>
                <span>Day ${formatUsdBalance(earnings.day, 0, 0)}</span>
              </Earnings>
            </Details>}
          </Summary>
        </ComponentHeader>
        {hasEnoughBalance ? <MallowTable table={table}/>
        : <NothingToShowWrapper>
            <NothingToShow>Nothing to show 🤷</NothingToShow>
            <div>Supported platforms are Aave, Morpho, Beefy and DSR (more to come soon).</div>
          </NothingToShowWrapper>}
      </>
}

export default AllBalances
