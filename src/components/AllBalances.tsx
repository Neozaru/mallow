"use client";

import { useOnChainBalances } from '@/hooks/useOnChainBalances';
import { getBinanceBalance } from '@/lib/getBinanceBalance';
import { getCoinbaseBalance } from '@/lib/getCoinbaseBalance';
import { getKrakenBalances } from '@/lib/getKrakenBalances';
import { isNumber, isString, pick, sumBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getGroupedRowModel, getSortedRowModel, GroupingState, SortingState, useReactTable } from '@tanstack/react-table';
import PlatformDisplay from './PlatformDisplay';
import EthereumAddress from './EthereumAddress';
import getChainName from '@/utils/getChainName';
import SettingsService from '@/lib/settingsService';

type AllBalancesProps = {
  accountAddresses: Array<string> | [];
  manualPositions: Array<object> | [];
};

const formatUsdBalance = (balance: number, minimumFractionDigits = 0, maximumFractionDigits = 0)  => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(balance);
};

// GPT
const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(50, 15, 105);
  border-radius: 8px;
  background-color: #1e093f;
`;

const TableHeader = styled.div`
  display: flex;
  background-color: #1e093f;
  color: white;
  font-weight: bold;
  text-align: left;

  & > div {
    flex: 1;
    cursor: pointer;
  }

  // Last th
  div > div:last-child {
   text-align: right;
  }
`;

const TableRow = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid rgb(50, 15, 105);

  &:nth-child(even) {
    background-color: #1e093f;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #1e093f;
  }
`;

interface CustomAlignProp {
  align?: 'left' | 'center' | 'right';  // Define the possible values for `align`
}

const TableCell = styled.div<CustomAlignProp>`
  flex: 1;
  padding: 5px 5px;
  text-align: ${({ align }) => align || 'left'};
  white-space: nowrap;
  
  &:first-child {
    flex: 2;
  }
`;
///

const ComponentWrapper = styled.div`
  background-color: #1e093f;
  color: white;
`;

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
`

const NothingToShow = styled.div`
  font-size: 32px;
  text-align: center;
`

const columnHelper = createColumnHelper()

const balanceSortingFn = (rowA, rowB) => {
  return rowA.original.balanceUsd > rowB.original.balanceUsd
  ? 1
  : -1
}

const Balance = styled.span`
  color: #b4b0c4;
  font-size: 13px;
`

const ApyCell = styled.div`
  font-weight: bold;
  text-align: right;
`;

const BalancesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingWrapper = styled.div`
  font-size: 24px;
  text-align: center;
  padding-top: 40px;
`;

const wobbleSquish = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1, 0.9) rotate(-10deg);
  }
  50% {
    transform: scale(0.9, 1.1) rotate(10deg);
  }
  75% {
    transform: scale(1.05, 0.95) rotate(-5deg);
  }
`;

const LoadingLogo = styled.img`
  margin: auto;
  animation: ${wobbleSquish} 1.5s infinite ease-in-out;
`

const columns = [
  columnHelper.accessor(row => pick(row, ['protocol', 'poolName', 'symbol', 'chainId']), {
    id: 'platform',
    header: () => <span>Position</span>,
    sortingFn: 'alphanumeric',
    aggregationFn: 'uniqueCount',
    enableGrouping: false,
    cell: info => {
      const { protocol, poolName, symbol, chainId } = info.getValue()
      return (<PlatformDisplay platform={protocol} pool={poolName} symbol={symbol} chainId={chainId}></PlatformDisplay>)
    }
  }),
  columnHelper.accessor(row => pick(row, ['formattedBalance', 'balanceUsd', 'symbol', 'type']), {
    id: 'balance',
    header: () => <span>Balance</span>,
    cell: info => {
      const { balanceUsd, formattedBalance, symbol, type } = info.getValue()
      return (
      <BalancesWrapper>
        {balanceUsd >= 0 && <span>${formatUsdBalance(balanceUsd)}<br/></span>}
        {type !== 'manual' && formattedBalance >= 0 && <Balance>{formatUsdBalance(formattedBalance)} {symbol}</Balance>}
      </BalancesWrapper>)
    },
    footer: info => info.column.id,
    sortingFn: 'balanceSortingFn',
    aggregationFn: 'balanceAggregation',
    enableGrouping: false,
  }),
  columnHelper.accessor('apy', {
    header: () => 'Apy',
    cell: info => <ApyCell>{((info.renderValue() || 0) * 100).toFixed(2)}%</ApyCell>,
    sortingFn: 'basic',
    aggregationFn: 'mean',
    enableGrouping: false,
  }),
  columnHelper.accessor('accountAddress', {
    id: 'accountAddress',
    header: 'Address',
    cell: info => {
      const value: string = info.getValue()
      if (!value) {
        return ''
      }
      if (isNumber(value)) {
        return value
      }
      if (!isString(value)) {
        return ''
      }
      if (!value.startsWith('0x')) {
        return value
      }
      return <EthereumAddress address={value}></EthereumAddress>
    },
    sortingFn: 'alphanumeric',
    aggregationFn: 'uniqueCount',
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

const AllBalances: React.FC<AllBalancesProps> = ({accountAddresses, manualPositions}) => {
  const [coinbaseBalances, setCoinbaseBalances] = useState<YieldPosition[]>([])
  useEffect(() => {
    if (SettingsService.getSettings().apiKeys.coinbaseKeyName && SettingsService.getSettings().apiKeys.coinbaseApiSecret) {
      getCoinbaseBalance().then(setCoinbaseBalances)
    }
  }, [])

  const [binanceBalances, setBinanceBalances] = useState<YieldPosition[]>([])
  useEffect(() => {
    if (SettingsService.getSettings().apiKeys.binanceApiKey && SettingsService.getSettings().apiKeys.binanceApiSecret) {
      getBinanceBalance().then(setBinanceBalances)
    }
  }, [])

const [krakenBalances, setKrakenBalances] = useState<YieldPosition[]>([])
  useEffect(() => {
    if (SettingsService.getSettings().apiKeys.krakenApiKey && SettingsService.getSettings().apiKeys.krakenApiSecret) {
      getKrakenBalances().then(setKrakenBalances)
    }
  }, [])

  const { balances: onChainBalances, isLoading } = useOnChainBalances(accountAddresses)
  const allBalances: YieldPosition[] = useMemo<YieldPosition[]>(() => {
    return [
      ...onChainBalances,
      ...krakenBalances,
      ...coinbaseBalances,
      ...binanceBalances,
      ...manualPositions,
    ]
  }, [
    onChainBalances,
    krakenBalances,
    coinbaseBalances,
    binanceBalances,
    manualPositions
  ])

  const balancesSum = useMemo(
    () => sumBy(allBalances, 'balanceUsd'),
    [allBalances]
  )

  const averageAPY = useMemo(
    () => {
      return allBalances.reduce((acc, bal) => acc + bal.apy * bal.balanceUsd, 0) / balancesSum
    },
    [allBalances, balancesSum]
  )

  const earnings = useMemo(() => {
    const year = averageAPY * balancesSum
    return {
      year,
      month: year / 12,
      day: year / 365
    }
  }, [balancesSum, averageAPY])

  const smallBalancesHideAmount = 0

  const hasEnoughBalance = useMemo(() => balancesSum > smallBalancesHideAmount, [balancesSum, smallBalancesHideAmount])

  const [sorting, setSorting] = useState<SortingState>([{id: 'balance', desc: true}])
  const [grouping, setGrouping] = React.useState<GroupingState>([])

  const table = useReactTable({
    data: allBalances,
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
    sortingFns: {
      balanceSortingFn
    },
    aggregationFns: {
      balanceAggregation: (leafRows) => {
        const res = sumBy(leafRows, leafRow => leafRow.getUniqueValues('balance')[0].balanceUsd)
        return {
          balanceUsd: res
        }
      },
    },
    // debugTable: true,
    debugHeaders: true,
    enableSorting: true,
  })

  return (<ComponentWrapper>
    <ComponentHeader>
      <Summary>
        <TotalWithAPY>
          <Total>${formatUsdBalance(balancesSum, 0, 0)}</Total>
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
    {isLoading 
    ? <LoadingWrapper>
        <LoadingLogo src='/mallowLogoWhiteTransparentBackground.svg' alt=''/>
        <div>Loading...</div>
      </LoadingWrapper>
    : hasEnoughBalance ? <TableWrapper>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableCell
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                style={{ cursor: 'pointer' }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {{
                  asc: ' ▲',
                  desc: ' ▼',
                }[header.column.getIsSorted() as string] || null}
                {header.column.getCanGroup() ? (
                  <button
                    {...{
                      onClick: header.column.getToggleGroupingHandler(),
                      style: {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    {header.column.getIsGrouped()
                      ? `🛑(${header.column.getGroupedIndex()}) `
                      : `👊 `}
                  </button>
                ) : null}{' '}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      {table.getRowModel().rows.map(row => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map(cell => (
            <TableCell key={cell.id} className={cell.id === 'apy' ? 'apyCell' : ''}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableWrapper>
    : (!isLoading && <NothingToShowWrapper>
        <NothingToShow>Nothing to show 🤷</NothingToShow>
        <div>Supported protocols are Aave, Morpho, Beefy and DSR (more to come soon).</div>
      </NothingToShowWrapper>)}
  </ComponentWrapper>)
}

export default AllBalances
