"use client";

import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import SettingsService, { OnChainAccount } from '@/lib/settingsService';
import Layout from '@/components/Layout';
import { uniq } from 'lodash';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  background-color: rgb(30, 9, 63);
  color: white;
  padding: 20px;
  margin: 0 auto;
`;

const Form = styled.form`

  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: rgb(48, 16, 99);
  resize: vertical; /* Allow resizing vertically only */
  font-size: 14px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #703e91;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #8d54b2;
  }
`;

const Settings = () => {
  const [coinbaseKeyName, setCoinbaseKeyName] = useState('')
  const [coinbaseApiSecret, setCoinbaseApiSecret] = useState('')
  const [krakenApiKey, setKrakenApiKey] = useState('')
  const [krakenApiSecret, setKrakenApiSecret] = useState('')
  const [binanceApiKey, setBinanceApiKey] = useState('')
  const [binanceApiSecret, setBinanceApiSecret] = useState('')
  const [onChainAccounts, setOnChainAccounts] = useState('')
  const [manualPositions, setManualPositions] = useState('')

  const router = useRouter()

  useEffect(() => {
    const settings = SettingsService.getSettings()
    setCoinbaseKeyName(settings.apiKeys.coinbaseKeyName)
    setCoinbaseApiSecret(settings.apiKeys.coinbaseApiSecret)
    setKrakenApiKey(settings.apiKeys.krakenApiKey)
    setKrakenApiSecret(settings.apiKeys.krakenApiSecret)
    setBinanceApiKey(settings.apiKeys.binanceApiKey)
    setBinanceApiSecret(settings.apiKeys.binanceApiSecret)
    setOnChainAccounts(
      settings.onChainAccounts.map(account => `${account.address}`).join('\n')
    )
    setManualPositions(
      settings.manualPositions.map(({protocol, balanceUsd, apy}) => `${protocol},${balanceUsd},${apy}`).join('\n')
    )
  }, []);

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }  

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const accountAddresses = onChainAccounts.split('\n').map(s => s.trim()).filter(s => s !== '').filter(onlyUnique)
    const uniqueAccountAddresses = uniq(accountAddresses)
    const onChainAccountsNewSettings: OnChainAccount[] = uniqueAccountAddresses.map((address: string) => ({
      address,
      chainType: 'evm'
    }))

    const manualPositionsNewSettings = manualPositions.split('\n').map(s => s.trim()).filter(s => s !== '').map(line => {
      const [protocol, balanceUsd, apy, chain, address] = line.split(',')
      return {
        accountAddress: address, 
        symbol: protocol, 
        protocol,
        poolName: 'Manual entry',
        balanceUsd: parseFloat(balanceUsd),
        balance: parseFloat(balanceUsd),
        formattedBalance: parseFloat(balanceUsd),
        type: 'manual',
        apy: parseFloat(apy),
        chain
      }
    })

    SettingsService.updateSettings({
      apiKeys: {
        coinbaseKeyName,
        coinbaseApiSecret,
        krakenApiKey,
        krakenApiSecret,
        binanceApiKey,
        binanceApiSecret,
      },
      onChainAccounts: onChainAccountsNewSettings,
      manualPositions: manualPositionsNewSettings,
    })
    router.push('/dashboard')
  }

  return (
    <Layout>
      <Container>
        <Form onSubmit={saveSettings}>
          <InputGroup>
            <Label htmlFor="onChainAccounts">On-chain accounts (one address per line):</Label>
            <TextArea
              id="onChainAccounts"
              value={onChainAccounts}
              onChange={(e) => setOnChainAccounts(e.target.value)}
              placeholder="Ex: 0x... (one EVM address per line)"
              rows={2}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="manualPositions">Manual positions (name,valueUSD,apy):</Label>
            <TextArea
              id="manualPositions"
              value={manualPositions}
              onChange={(e) => setManualPositions(e.target.value)}
              placeholder="Ex: RealT,15630,0.09 (one per line)"
              rows={2}
            />
          </InputGroup>

          {/* Coinbase */}
          <InputGroup>
            <Label htmlFor="coinbaseKeyName">Coinbase Key Name:</Label>
            <Input
              id="coinbaseKeyName"
              type="text"
              value={coinbaseKeyName}
              onChange={(e) => setCoinbaseKeyName(e.target.value)}
              placeholder="Enter your Coinbase Key Name"
            />

            <Label htmlFor="coinbaseApiSecret">Coinbase API Secret:</Label>
            <TextArea
              id="coinbaseApiSecret"
              value={coinbaseApiSecret}
              onChange={(e) => setCoinbaseApiSecret(e.target.value)}
              placeholder="Enter your Coinbase API Secret"
              rows={2}
            />
          </InputGroup>

          {/* Kraken */}
          <InputGroup>
            <Label htmlFor="krakenApiKey">Kraken API Key:</Label>
            <Input
              id="krakenApiKey"
              type="text"
              value={krakenApiKey}
              onChange={(e) => setKrakenApiKey(e.target.value)}
              placeholder="Enter your Kraken API Key"
            />
            <Label htmlFor="krakenApiSecret">Kraken API Secret:</Label>
            <Input
              id="krakenApiSecret"
              type="text"
              value={krakenApiSecret}
              onChange={(e) => setKrakenApiSecret(e.target.value)}
              placeholder="Enter your Kraken API Secret"
            />
          </InputGroup>

          {/* Binance */}
          <InputGroup>
            <Label htmlFor="binanceApiKey">Binance API Key:</Label>
            <Input
              id="binanceApiKey"
              type="text"
              value={binanceApiKey}
              onChange={(e) => setBinanceApiKey(e.target.value)}
              placeholder="Enter your Binance API Key"
            />
            <Label htmlFor="binanceApiSecret">Binance API Secret:</Label>
            <Input
              id="binanceApiSecret"
              type="text"
              value={binanceApiSecret}
              onChange={(e) => setBinanceApiSecret(e.target.value)}
              placeholder="Enter your Binance API Secret"
            />
          </InputGroup>

          <Button type="submit">Save Settings</Button>
        </Form>
      </Container>
    </Layout>
  )
}

export default Settings
