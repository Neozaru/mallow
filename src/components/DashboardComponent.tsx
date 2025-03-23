"use client";

import AllBalances from '@/components/AllBalances';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';
import EthereumAddress from './EthereumAddress';
import { ConnectKitButton } from 'connectkit';
import { Address } from 'viem';
import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';
import MallowLogo from './MallowLogo';

const WelcomeActionsWrapper = styled.div`
  font-size: 36px;
  margin: auto;
  text-align: center;
  color: white;
  align-self: center;
  padding: 20px;
  line-height: 2;
`

const WatchingStatus = styled.div`
  font-size: 16px;
  text-align: center;
  color: white;
  align-self: center;
`

const Label = styled.label`
  font-size: 18px;
  display: block;
`;

const AddressWatchInput = styled.input`
  width: 44ch;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: rgb(48, 16, 99);
  font-size: 14px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #703e91;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #8d54b2;
  }
`;

const NoWatchedAddresses = styled.div`
  font-size: 32px;
  padding: 40px;
`

const ConnectOrWatchWrapper = styled.div`

`;

const OrText = styled.div`
  padding: 20px;
  padding-top: 30px;
  color: gray;
  font-size: 16px;
`;

const ConnectButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  div:first-child {
    background-color: #D98E04;
    color: black;
    border-radius: 5px;

    &:hover {
      background-color: rgba(217, 142, 4, 0.8); /* #D98E04 at 80% opacity */
    }
  }
`

type DashboardConfig = {
  onChainAddresses: [];
  manualPositions: [];
  enableExchanges: false;
  source: 'none';
  isLoading: boolean;
} | {
  onChainAddresses: [Address];
  manualPositions: [];
  enableExchanges: false;
  source: 'watched' | 'connected';
  isLoading: false;
}

const initialDashboardConfig: DashboardConfig = {
  onChainAddresses: [],
  manualPositions: [],
  enableExchanges: false,
  source: 'none',
  isLoading: true
}

const isEthereumAddress = address => address.startsWith('0x') && address.length === 42

function DashboardComponent() {
  const params = useParams<{ address: Address }>()
  const router = useRouter()

  // TODO: Could this be better done via middleware ?
  const inputUrlAddress = params?.address
  if (inputUrlAddress && !isEthereumAddress(inputUrlAddress)) {
    router.replace('/dashboard')
  }

  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(initialDashboardConfig)
  const { address: connectedWalletAddress, status: walletConnectionStatus } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    // Case we have a valid input address
    if (inputUrlAddress && isEthereumAddress(inputUrlAddress)) {
      setDashboardConfig({
        onChainAddresses: [inputUrlAddress],
        manualPositions: [],
        enableExchanges: false,
        source: 'watched',
        isLoading: false
      })
      return
    }
    // If wallet status is still in limbo, wait
    if (walletConnectionStatus !== 'connected' && walletConnectionStatus !== 'disconnected') {
      return
    }
    // If wallet connected, display that
    if (walletConnectionStatus === 'connected') {
      setDashboardConfig({
        onChainAddresses: [connectedWalletAddress],
        manualPositions: [],
        enableExchanges: false,
        source: 'connected',
        isLoading: false
      })
      return
    }
    // If nothing will be shown, clear the watchlist (in case a wallet was watched or connected)
    setDashboardConfig({
      onChainAddresses: [],
      manualPositions: [],
      enableExchanges: false,
      source: 'none',
      isLoading: false
    })
  }, [inputUrlAddress, connectedWalletAddress, walletConnectionStatus])

  const tryInputAddress = useCallback(inputAddress => {
    if (isEthereumAddress(inputAddress)) {
      router.push(`/dashboard/${inputAddress}`)
    }
  }, [router])

  const stopWatchingAddress = useCallback(() => {
    router.push('/dashboard')
  }, [router])

  const disconnectAndStopWatching = useCallback(() => {
    disconnect()
  }, [disconnect])

  return (
    <span key="dashboard">
      {dashboardConfig.isLoading ? <LoadingSpinner/>
      : <>
        {(dashboardConfig.source !== 'none' && dashboardConfig.onChainAddresses.length > 0)
          && <AllBalances accountAddresses={dashboardConfig.onChainAddresses} />}
        <WelcomeActionsWrapper>
          {/* {true ? */}
          {dashboardConfig.source === 'none' ?
          <ConnectOrWatchWrapper>
            <NoWatchedAddresses>Welcome to Mallow</NoWatchedAddresses>
            <div className='pb-10'>
              <MallowLogo />
            </div>
            <ConnectButtonWrapper>
              <ConnectKitButton/>
            </ConnectButtonWrapper>
            <OrText>or</OrText>
            <Label htmlFor="watchAddress">watch any address</Label>
            <AddressWatchInput
              placeholder='0xabd...'
              id="watchAddress"
              type="text"
              onChange={(e) => tryInputAddress(e.target.value)}
            />
          </ConnectOrWatchWrapper> : <>
          {/* Watching Connected Wallet */}
          {dashboardConfig.source === 'connected'
            && <WatchingStatus><div>🦊 Currently watching connected wallet <EthereumAddress address={dashboardConfig.onChainAddresses[0]}/></div><Button onClick={() => disconnectAndStopWatching()}>Disconnect</Button></WatchingStatus>}
          {/* Watching Query Address */}
          {dashboardConfig.source === 'watched'
            && <WatchingStatus><div>👀 Currently watching <EthereumAddress address={dashboardConfig.onChainAddresses[0]}/></div><Button onClick={() => stopWatchingAddress()}>Stop watching</Button></WatchingStatus>}
          </>}
        </WelcomeActionsWrapper>
      </>}
    </span>)
}

// TODO: Make non-styled-component CSS to enable display before hydration
export default dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false,
})
