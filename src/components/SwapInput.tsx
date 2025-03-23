import WalletIcon from './WalletIcon'
import PlatformDisplay from './PlatformDisplay'

type TokenInputProps = {
  opportunity?: YieldOpportunityOnChain,
  amount: TokenAmountBaseAndDisplay,
  balance: TokenAmountBaseAndDisplay,
  handleChange?: (newValue: string) => void,
  handleClickItem?: () => void,
  disabled?: boolean
}

const SwapInput = ({ opportunity, amount, balance, handleChange, handleClickItem, disabled }: TokenInputProps) => {
  return (
  <div className='flex flex-col rounded-lg p-4 h-25  bg-background border-background'>
    <div className='relative flex flex-row items-center'>
      <input
        className='flex-1 flex-shrink border-none text-4xl text-left p-0 outline-none min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis bg-background'
        autoComplete="off" inputMode="numeric" min="0" placeholder="0"
        value={amount.display} onChange={e => handleChange && handleChange(e.target.value)}
        disabled={disabled}
      />
      <div style={{
          WebkitMask: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, black 20%)',
          mask: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, black 20%)'
        }}
        className="absolute flex flex-row items-center flex-shrink-0 h-10 right-0 text-2xl pr-1 pl-8 max-w-44 bg-background leading-normal shadow-lg rounded-lg cursor-pointer"
        onClick={() => handleClickItem && handleClickItem()}>
          <div>
            {opportunity
              ? <PlatformDisplay {...opportunity} />
              : <span className='text-lg font-bold'>Select ▼</span>
            }
        </div>
      </div>
    </div>
    <div className='flex justify-between mt-1 text-sm text-grayTxt'>
      <div className={`flex ${!disabled && 'cursor-pointer'} items-center`} onClick={() => handleChange && handleChange(balance.display)}>
        <span className='pr-1'>{balance.display}</span>
        <WalletIcon/>
      </div>
    </div>
  </div>)
}

export default SwapInput