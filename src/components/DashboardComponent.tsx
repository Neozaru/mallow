"use client";

import AllBalances from '@/components/AllBalances';
import Layout from '@/components/Layout';
import SettingsService from '@/lib/settingsService';
import { wagmiconfig } from '@/wagmiconfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { map } from 'lodash';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAccount, useConnect, useDisconnect, WagmiProvider } from 'wagmi';
import EthereumAddress from './EthereumAddress';
import dynamic from 'next/dynamic';

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
  padding: 5px 20px;
  background-color: #703e91;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 20px;
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

const SettingsLink = styled.span`
  text-decoration: underline;
`;

const LogoWrapper = styled.div`
  text-align: center;
`;

const Logo = styled.img`
  margin: auto;
  padding-bottom: 40px;
`


function DashboardComponent() {
  const params = useParams<{ address: string }>()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [onChainAccounts, setOnChainAccounts] = useState([])
  const manualPositions = SettingsService.getSettings().manualPositions
  const onChainAccountsFromSettings = SettingsService.getSettings().onChainAccounts

  const isAdvanced = onChainAccountsFromSettings.length > 0 || manualPositions.length > 0

  const { connectors, connect } = useConnect()
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
        setOnChainAccounts(onChainAccountsFromSettings)
      }
      return
    } 
    if (params.address.startsWith('0x') && params.address.length === 42) {
      setOnChainAccounts([{ address: params.address, chainType: 'evm'}])
      setIsLoading(false)
    } else {
      router.push(`/dashboard`)
    }
    setIsLoading(false)
  }, [params?.address, isAdvanced])

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

  const metamaskConnector = useMemo(() => {
    return connectors.find(connector => connector.id === 'io.metamask')
  }, [connectors])

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
          {metamaskConnector && <div>
            <Button onClick={e => connect({ connector: metamaskConnector })}>🦊 Connect Metamask</Button>
            <OrText>or</OrText>
          </div>}
          <Label htmlFor="watchAddress">watch any address</Label>
            <Input
              placeholder='0xabd...'
              id="watchAddress"
              type="text"
              onChange={(e) => tryInputAddress(e.target.value)}
            />
          </ConnectOrWatchWrapper>}
          {/* Watching Connected Wallet */}
          {onChainAccounts.length === 1 && !isAdvanced && address && <WatchingStatus><div>🦊 Currently watching connected wallet <EthereumAddress address={onChainAccounts[0].address}/></div><Button onClick={(e) => disconnectAndStopWatching()}>Disconnect</Button></WatchingStatus>}
          {/* Watching Query Address */}
          {onChainAccounts.length === 1 && params?.address && <WatchingStatus><div>👀 Currently watching <EthereumAddress address={onChainAccounts[0].address}/></div><Button onClick={(e) => stopWatchingAddress()}>Stop watching</Button></WatchingStatus>}
          {/* Watching Address(es) as Set in Settings */}
          {isAdvanced && !params?.address && <WatchingStatus>🕵️ Watching <Link href='/settings'>{onChainAccounts.length} addresses from Settings</Link></WatchingStatus>}
        </WelcomeActionsWrapper>
      </span>}
    </Layout>)
}

export default dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false,
})
