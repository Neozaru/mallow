import { formatUnits } from 'viem';
import { getTokenDecimals } from './getTokenDecimals';

export function formatBalanceWithSymbol(balance: bigint, symbol: string) {
  return formatUnits(balance, getTokenDecimals(symbol))
}
