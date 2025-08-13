const tokenDecimals = {
  'USDT': 6,
  'USDC': 6,
  'EURC': 6
}

const findDecimalsAssumingPrefix = symbolWithPrefix => {
  for (const [symbol, decimals] of Object.entries(tokenDecimals)) {
    if (symbolWithPrefix.endsWith(symbol)) {
      return decimals
    }
  }
}

export function getTokenDecimals(symbol: string) {
  const recordedDecimals = tokenDecimals[symbol] || findDecimalsAssumingPrefix(symbol)
  return recordedDecimals || 18
}
