"use client";

import AllBalances from '@/components/AllBalances';
import SettingsService from '@/lib/settingsService';
import { map } from 'lodash';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';
import MallowLogo from './MallowLogo';
import { useEffect, useMemo, useState } from 'react';

const mobileScreenWidthBreakPoint = 768

function ProComponent() {
  // If nothing set to be watched or nothing connected, read config from Settings
  const onChainAddresses = map(SettingsService.getSettings().onChainAccounts, 'address')
  const manualPositions = SettingsService.getSettings().manualPositions
  const hasSetExchangeKeys = SettingsService.hasSetExchangeKeys()

  const hasSetSomethingToTrack = onChainAddresses.length > 0 || manualPositions.length > 0 || hasSetExchangeKeys

  const isLoading = false

  const [screenWidthInfo, setScreenWidthInfo] = useState<number>(window.innerWidth)

  function handleWindowSizeChange() {
    setScreenWidthInfo(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const isMobile = useMemo(() => screenWidthInfo < mobileScreenWidthBreakPoint, [screenWidthInfo])

  // TODO: Inject exchange balances / config
  return (
    <span key="pro">
      {isLoading ? <LoadingSpinner/>
      : <>
        {hasSetSomethingToTrack
        ? <div>
            <AllBalances accountAddresses={onChainAddresses} manualPositions={manualPositions} enableExchanges={true} displayAccounts={!isMobile} />
            <div className='text-center'>
              🕵️ Watching {onChainAddresses.length} addresses from {isMobile ? 'mobile' : 'desktop'}
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
