import { parseUnits } from 'viem'
import getTokenDisplayUsdFromDisplayAmount from './getTokenDisplayUsdFromDisplayAmount'

const trimAmountValue = (amountValue: string) => {
  let trimmedAmountValue = amountValue.replace(/[^0-9.]/g, '')
  // Ensure only one dot is allowed
  const parts = trimmedAmountValue.split('.');
  if (parts.length > 2) {
    trimmedAmountValue = parts[0] + '.' + parts.slice(1).join('')
  }

  if (amountValue.length > 1 && trimmedAmountValue.startsWith("0") && trimmedAmountValue[1] !== ".") {
    trimmedAmountValue = trimmedAmountValue.replace(/^0+/, '')
  }
  return trimmedAmountValue
}

const getTokenAmountFromInputValue = (inputValue: string, tokenInfo: TokenInfo): TokenAmountBaseAndDisplay => {
  const displayAmount = trimAmountValue(inputValue)
  return {
    display: displayAmount,
    base: parseUnits(displayAmount, tokenInfo.decimals),
    displayUsd: getTokenDisplayUsdFromDisplayAmount(displayAmount, tokenInfo)
  }
}

export default getTokenAmountFromInputValue
