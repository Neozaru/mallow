"use client";

import AllBalances from '@/components/AllBalances';
import SettingsService from '@/lib/settingsService';
import { map } from 'lodash';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';
import MallowLogo from './MallowLogo';

function ProComponent() {
  // If nothing set to be watched or nothing connected, read config from Settings
  const onChainAddresses = map(SettingsService.getSettings().onChainAccounts, 'address')
  const manualPositions = SettingsService.getSettings().manualPositions
  const hasSetExchangeKeys = SettingsService.hasSetExchangeKeys()

  const hasSetSomethingToTrack = onChainAddresses.length > 0 || manualPositions.length > 0 || hasSetExchangeKeys

  const isLoading = false

  // TODO: Inject exchange balances / config
  return (
    <span key="pro">
      {isLoading ? <LoadingSpinner/>
      : <>
        {hasSetSomethingToTrack
        ? <div>
            <AllBalances accountAddresses={onChainAddresses} manualPositions={manualPositions} enableExchanges={true} displayAccounts={true} />
            <div className='text-center'>
              🕵️ Watching {onChainAddresses.length} addresses from
              &nbsp;<Link href='/settings' className='underline'>&#9881;Settings</Link>
            </div>
          </div>
        : <div className='h-full flex flex-col items-center justify-center'>
            <div className='text-center'>
              <div className='pb-5'>
                <MallowLogo />
              </div>
              <div>
                Nothing tracked yet. ¯\_(ツ)_/¯
              </div>
              <div>
                Go on <Link href='/settings' className='underline'>&#9881;Settings</Link> to add addresses, exchanges or manual positions.
              </div>
            </div>
          </div>}
        </>}
    </span>)
}

// TODO: Make non-styled-component CSS to enable display before hydration
export default dynamic(() => Promise.resolve(ProComponent), {
  ssr: false,
})
