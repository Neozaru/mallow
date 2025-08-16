"use client";

import { pick, sumBy } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getGroupedRowModel, getSortedRowModel, GroupingState, Row, SortingState, useReactTable } from '@tanstack/react-table';
import PlatformDisplay from './PlatformDisplay';
import getChainName from '@/utils/getChainName';
import MallowTable from './MallowTable';
import ApyCell from './ApyCell';
import LoadingSpinner from './LoadingSpinner';
import { Address } from 'viem';
import EthereumAddress from './EthereumAddress';
import Link from 'next/link';
import { base } from 'viem/chains';
import ToggleButton from './ToggleButton';
import sortApyCell from '@/lib/sortApyCell';
import useCurrencyRates from '@/hooks/useCurrencyRates';
import useAllBalances from '@/hooks/balances/useAllbalances';

type AllBalancesProps = {
  accountAddresses: Array<Address> | [];
  manualPositions?: Array<YieldPositionManual> | [];
  displayAccounts?: boolean;
  enableExchanges?: boolean;
  enableSwapLinks?: boolean;
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
  cursor: pointer;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
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

const availableCurrencies = ['USD', 'EUR', 'BTC']

const columnHelper = createColumnHelper<YieldPositionAnyWithBalanceUsd>()

const balanceSortingFn = (rowA, rowB) => {
  return rowA.original.balanceUsd > rowB.original.balanceUsd
  ? 1
  : -1
}

const balanceAggregationFn = (columnId, leafRows: Row<YieldPositionAnyWithBalanceUsd>[]) => {
  const res = sumBy(leafRows, leafRow => (leafRow.getUniqueValues<YieldPositionAnyWithBalanceUsd>('balance')[0]).balanceUsd)
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
      return (<PlatformDisplay link={metadata?.link} platform={platform} poolName={poolName} symbol={symbol} chainId={chainId} type={type}></PlatformDisplay>)
    }
  }),
  columnHelper.accessor(row => pick(row, ['formattedBalance', 'balanceUsd', 'symbol', 'type']), {
    id: 'balance',
    header: () => <span>Balance</span>,
    cell: info => {
      const { balanceUsd, formattedBalance, symbol, type } = info.getValue() as YieldPositionAnyWithBalanceUsd
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
      return value ? <EthereumAddress address={value} enableLink={true}/> : ''
    },
    enableGrouping: false
  }),
  columnHelper.accessor(row => row, {
    id: 'apy',
    header: () => 'Apy',
    cell: info => {
      const value = info.getValue()
      const { id, apy } = value
      if (value.type === 'onchain' && value.platform === 'spot' && value.chainId === base.id) {
        return <div className='flex-end justify-end align-middle text-right'>
            <Link className=' text-black bg-[#d98e04] hover:bg-[#d98e04]/80 p-2 rounded' href={`/swap?from=${id}`} passHref>Zap</Link>
          </div>
      } else {
        const expiry = value.type === 'onchain' ? value?.expiry : undefined
        return (<ApyCell apy={apy} expiry={expiry}/>)
      }
    },
    sortingFn: sortApyCell,
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

const emptyArray = []

const AllBalances: React.FC<AllBalancesProps> = ({
  accountAddresses,
  manualPositions = emptyArray,
  displayAccounts = false,
  enableExchanges = false
}) => {
  const { data: allBalances, isLoading } = useAllBalances({
    accountAddresses,
    manualPositions,
    enableExchanges
  })

  const smallBalancesHideAmount = 1
  const hideZeroApy = false
  const [countSpot, setCountSpot] = useState(true)

  const [currency, setCurrency] = useState(availableCurrencies[0])

  const { data: currencyRates } = useCurrencyRates()

  const allBalancesFiltered = useMemo(() => {
    return allBalances.filter(({ balanceUsd, apy, isSpot }) =>
      balanceUsd >= smallBalancesHideAmount
      && (!hideZeroApy || apy > 0)
      && (countSpot || !isSpot)
    )
  }, [allBalances, hideZeroApy, countSpot])

  const toggleCurrency = useCallback(() => {
    if (!currencyRates) return;

    const currentIndex = availableCurrencies.indexOf(currency);
    const nextIndex = (currentIndex + 1) % availableCurrencies.length;

    setCurrency(availableCurrencies[nextIndex]);
  }, [currency, currencyRates, setCurrency]);

  const balancesSum = useMemo(
    () => sumBy(allBalancesFiltered, 'balanceUsd'),
    [allBalancesFiltered]
  )

  const formatDashboardBalance = useCallback((balanceUsd) => {
    if (!currencyRates || currency === 'USD') {
      return `$${formatUsdBalance(balanceUsd)}`
    } else if (currency === 'EUR') {
      return `€${formatUsdBalance(balanceUsd / currencyRates['EUR'])}`
    } else if (currency === 'BTC') {
      return `₿${formatUsdBalance(balanceUsd / currencyRates['BTC'], 2, 5)}`
    }
  }, [currencyRates, currency])

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

  const columnVisibility = useMemo(() => ({
    chainId: false,
    accountAddress: displayAccounts
  }), [displayAccounts])

  const table = useReactTable({
    data: allBalancesFiltered,
    columns,
    initialState: {
      columnVisibility,
    },
    state: {
      sorting,
      grouping,
      columnVisibility
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
              <Total onClick={toggleCurrency}>{formatDashboardBalance(balancesSum)}</Total>
              <APY>{(hasEnoughBalance ? averageAPY*100 : 0).toFixed(2)}% APY</APY>
            </TotalWithAPY>
            {hasEnoughBalance && <Details>
              <Earnings>
                <span>Year {formatDashboardBalance(earnings.year)}</span>
                <span>Month {formatDashboardBalance(earnings.month)}</span>
                <span>Day {formatDashboardBalance(earnings.day)}</span>
              </Earnings>
            </Details>}
          </Summary>
        </ComponentHeader>
        <div className='flex flex-row items-start pl-2 pb-2'>
          <ToggleButton label='Include spot positions' enabled={countSpot} setEnabled={setCountSpot} />
        </div>
        {hasEnoughBalance ? <MallowTable table={table}/>
        : <NothingToShowWrapper>
            <NothingToShow>Nothing to show 🤷</NothingToShow>
            <div>Supported platforms are Aave, Morpho, Beefy and DSR (more to come soon).</div>
          </NothingToShowWrapper>}
      </>
}

export default AllBalances
