type EvmAddressInternal = `0x${string}`

type YieldOpportunityBase = {
  id: string;
  symbol: string;
  poolName: string;
  apy: number;
  metadata?: {
    link: string;
  }
}

type RiskValue = 0 | 1 | 2 | 3

type Protocol = 'spot' | 'aave' | 'morpho' | 'beefy' | 'dsr' | 'ssr' | 'pendle'

type YieldOpportunityOnChain = YieldOpportunityBase & {
  id: string;
  poolTokenAddress: EvmAddressInternal;
  poolAddress: EvmAddressInternal; // Often same as poolTokenAddress - but not always
  platform: Protocol;
  chainId: number;
  rateToPrincipal?: number; // Optional: When the LP token is non-rebasing
  convertPrincipalToLP?: (principal: bigint) => bigint; // Hack.
  risk?: RiskValue;
  type: 'onchain';
}

type YieldOpportunityExchange = YieldOpportunityBase & {
  platform: 'kraken' | 'coinbase' | 'binance';
  type: 'exchange';
}

type YieldOpportunityManual = YieldOpportunityBase & {
  type: 'manual';
}

type PositionBalances = {
  balance: bigint;
  balanceUsd: number;
  formattedBalance: string;
}

type YieldPositionOnChain = YieldOpportunityOnChain & PositionBalances & { accountAddress: EvmAddressInternal }

type YieldPositionExchange = YieldOpportunityExchange & PositionBalances

type YieldPositionManual = YieldOpportunityManual & PositionBalances

type YieldPositionAny = YieldPositionOnChain | YieldPositionExchange | YieldPositionManual

type LoadableData<T> = {
  isLoading: boolean;
  data?: T;
  error?: unknown;
  isFetching?: boolean | undefined;
  refetch?: () => void;
};

type FetchableData<T> = LoadableData<T> & {
  isFetching: boolean;
};

type TokenConfig = {
  address: EvmAddressInternal;
  chainId: number;
}

type ContractCallBigIntResultOk = {
  result: bigint;
  status: 'success';
}

type ContractCallBigIntError = {
  status: 'failure';
  error?: unknown;
}

type ContractCallBigIntResult = ContractCallBigIntResultOk | ContractCallBigIntResultError

type TokenInfo = {
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  name?: string;
}

type TokenAmountBaseAndDisplay = {
  base: bigint;
  display: string;
  displayUsd: string;
}
