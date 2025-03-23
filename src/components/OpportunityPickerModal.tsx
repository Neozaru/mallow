import ReactDOM from 'react-dom';
import PlatformDisplay from './PlatformDisplay';
import { formatApy } from '@/lib/formatApy';

type OpportunityAndBalance = {
  opportunity: YieldOpportunityOnChain;
  balance: TokenAmountBaseAndDisplay;
}

type OpportunitiesGroup = {
  label: string;
  opportunitiesAndBalances: OpportunityAndBalance[];
}

export type OpportunityPickerModalProps = {
  isOpen: boolean;
  opportunitiesGroups: OpportunitiesGroup[];
  onClose: () => void;
  onSelect?: (opportunity: YieldOpportunityOnChain) => void;
}

const OpportunityPickerModal = ({ isOpen, opportunitiesGroups, onClose, onSelect }: OpportunityPickerModalProps) => {
  if (!isOpen) {
    return null
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center content-center items-center bg-black/50 z-40" onClick={onClose}>
      <div className="absolute m-auto bg-widgetBg rounded-lg h-[600px] w-[400px] z-50 overflow-y-scroll" onClick={e => e.stopPropagation()}>
          {opportunitiesGroups?.map(({label, opportunitiesAndBalances}) => {
            return (
              <div key={label}>
                <div className='text-white text-lg font-bold pl-4 pt-4'>{label}</div>
                <ul>
                  {opportunitiesAndBalances?.map(({opportunity, balance}) => (
                  <li className='p-4 cursor-pointer hover:bg-purple-500' key={opportunity.id} onClick={() => onSelect && onSelect(opportunity)}>
                    <div className='flex justify-between'>
                      <PlatformDisplay {...opportunity} />
                      {/* <div className='text-right'><RiskGauge risk={opportunity.risk}/></div> */}
                      <div className='flex flex-col text-right'>
                        <div className='text-white font-bold'>{balance.displayUsd}</div>
                        {opportunity.apy ? <div className='text-[#b4b0c4] text-sm'>{formatApy(opportunity.apy)}</div> : null}
                      </div>
                    </div>
                  </li>))}
                </ul>
              </div>
            )
          })})
      </div>
    </div>
  , document.body)
}

export default OpportunityPickerModal
