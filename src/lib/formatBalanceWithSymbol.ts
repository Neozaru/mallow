import { formatUnits } from 'viem';

const tokenDecimals = {
  'USDT': 6,
  'USDC': 6,
  'aUSDC': 6,
  'aUSDT': 6,
  'aEURC': 6,
  'EURC': 6
}

export function formatBalanceWithSymbol(balance: bigint, symbol: string) {
  return formatUnits(balance, tokenDecimals[symbol] || 18)
}
