import { formatUnits } from 'viem'
import getTokenDisplayUsdFromDisplayAmount from './getTokenDisplayUsdFromDisplayAmount'

const getTokenAmountFromBaseUnits = (baseUnits: bigint, tokenInfo: TokenInfo) => {
  const displayAmount = formatUnits(baseUnits, tokenInfo.decimals)
  return {
    display: displayAmount,
    base: baseUnits,
    displayUsd: getTokenDisplayUsdFromDisplayAmount(displayAmount, tokenInfo)
  }
}

export default getTokenAmountFromBaseUnits
