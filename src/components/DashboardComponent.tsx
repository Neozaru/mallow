"use client";

import AllBalances from '@/components/AllBalances';
import Layout from '@/components/Layout';
import SettingsService from '@/lib/settingsService';
import { map } from 'lodash';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import EthereumAddress from './EthereumAddress';
import dynamic from 'next/dynamic';
import { ConnectKitButton } from 'connectkit';

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

const Input = styled.input`
  width: 100%;
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
  // border: none;
  border-radius: 5px;
  // font-size: 20px;
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
  color: gray;
  font-size: 16px;
`;

const LogoWrapper = styled.div`
  text-align: center;
`;

const Logo = styled.img`
  margin: auto;
  padding-bottom: 40px;
`

const ConnectButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  div:first-child {
    background-color: #703e91;
    border-radius: 5px;

    &:hover {
      background-color: #8d54b2;
    }
  }
`

function DashboardComponent() {
  const params = useParams<{ address: string }>()
  const router = useRouter()

  const [onChainAccounts, setOnChainAccounts] = useState([])
  const manualPositions = SettingsService.getSettings().manualPositions

  const isAdvanced = SettingsService.getSettings().onChainAccounts.length > 0 || manualPositions.length > 0

  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (isAdvanced) {
      return
    }
    if (address?.startsWith('0x') && address?.length === 42) {
      setOnChainAccounts([{ address, chainType: 'evm'}])
    }
  }, [address, router, isAdvanced])

  useEffect(() => {
    if (!params?.address) {
      if (isAdvanced) {
        setOnChainAccounts(SettingsService.getSettings().onChainAccounts)
      }
      return
    } 
    if (params.address.startsWith('0x') && params.address.length === 42) {
      setOnChainAccounts([{ address: params.address, chainType: 'evm' }])
    } else {
      router.push(`/dashboard`)
    }
  }, [params?.address, isAdvanced, router])

  const accountAddresses = useMemo(() => {
    return map(onChainAccounts, 'address')
  }, [onChainAccounts])

  const tryInputAddress = inputAddress => {
    if (inputAddress.startsWith('0x') && inputAddress.length === 42) {
      router.push(`/dashboard/${inputAddress}`)
    }
  }

  const stopWatchingAddress = () => {
    router.push('/dashboard')
  }

  const disconnectAndStopWatching = () => {
    disconnect()
    setOnChainAccounts([])
  }

  return (
    <Layout>
      {!false && <span>
      {(accountAddresses.length > 0 || manualPositions.length > 0) && <AllBalances accountAddresses={accountAddresses} manualPositions={manualPositions}/>}
      <WelcomeActionsWrapper>
        {accountAddresses.length === 0 &&
        <ConnectOrWatchWrapper>
          <NoWatchedAddresses>Welcome to Mallow</NoWatchedAddresses>
          <LogoWrapper>
            <Logo src='/mallowLogoWhiteTransparentBackground.svg' alt=''></Logo>
          </LogoWrapper>
          <ConnectButtonWrapper>
            <ConnectKitButton/>
          </ConnectButtonWrapper>
          <OrText>or</OrText>
          <Label htmlFor="watchAddress">watch any address</Label>
            <Input
              placeholder='0xabd...'
              id="watchAddress"
              type="text"
              onChange={(e) => tryInputAddress(e.target.value)}
            />
          </ConnectOrWatchWrapper>}
          {/* Watching Connected Wallet */}
          {onChainAccounts.length === 1 && !params?.address && !isAdvanced && address && <WatchingStatus><div>🦊 Currently watching connected wallet <EthereumAddress address={onChainAccounts[0].address}/></div><Button onClick={() => disconnectAndStopWatching()}>Disconnect</Button></WatchingStatus>}
          {/* Watching Query Address */}
          {onChainAccounts.length === 1 && params?.address && <WatchingStatus><div>👀 Currently watching <EthereumAddress address={onChainAccounts[0].address}/></div><Button onClick={() => stopWatchingAddress()}>Stop watching</Button></WatchingStatus>}
          {/* Watching Address(es) as Set in Settings */}
          {isAdvanced && !params?.address && <WatchingStatus>🕵️ Watching <Link href='/settings'>{onChainAccounts.length} addresses from Settings</Link></WatchingStatus>}
        </WelcomeActionsWrapper>
      </span>}
    </Layout>)
}

export default dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false,
})
