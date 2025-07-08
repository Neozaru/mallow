const tokenDecimals = {
  'USDT': 6,
  'USDC': 6,
  'aUSDC': 6,
  'aUSDT': 6,
  'stkaUSDC': 6,
  'stkaUSDT': 6,
  'aEURC': 6,
  'EURC': 6
}

export function getTokenDecimals(symbol: string) {
  return tokenDecimals[symbol] || 18
}
