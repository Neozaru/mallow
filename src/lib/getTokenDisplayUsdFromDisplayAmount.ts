
const nonStableTokenPrices = {}

const getTokenUsdPrice = (symbol: string): number => {
  if (nonStableTokenPrices[symbol]) {
    return nonStableTokenPrices[symbol]
  }
  return 1
}

const getTokenDisplayUsdFromDisplayAmount = (displayAmount: string, tokenInfo: TokenInfo) => {
  return (getTokenUsdPrice(tokenInfo.symbol) * parseFloat(displayAmount) || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })
}

export default getTokenDisplayUsdFromDisplayAmount
