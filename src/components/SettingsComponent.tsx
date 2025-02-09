"use client";

import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import SettingsService, { OnChainAccount } from '@/lib/settingsService';
import { uniq } from 'lodash';
import { useRouter } from 'next/navigation';
import { Address } from 'viem';
import dynamic from 'next/dynamic';

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

const SettingsComponent = () => {
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
      settings.manualPositions.map(({symbol, balanceUsd, apy}) => `${symbol},${balanceUsd},${apy}`).join('\n')
    )
  }, []);

  function onlyUnique(value: unknown, index: number, array: unknown[]) {
    return array.indexOf(value) === index
  }  

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const accountAddresses = onChainAccounts.split('\n').map(s => s.trim()).filter(s => s !== '').filter(onlyUnique)
    const uniqueAccountAddresses = uniq(accountAddresses)
    const onChainAccountsNewSettings: OnChainAccount[] = uniqueAccountAddresses.map((address: string) => ({
      address: address as Address,
      chainType: 'evm'
    }))

    const manualPositionsNewSettings: YieldPositionManual[] = manualPositions.split('\n').map(s => s.trim()).filter(s => s !== '').map((line, i) => {
      const [name, balanceUsd, apy] = line.split(',')
      return {
        id: `manual-${name}-${i}`,
        symbol: name, 
        poolName: name,
        balanceUsd: parseFloat(balanceUsd),
        balance: BigInt(balanceUsd),
        formattedBalance: `${parseFloat(balanceUsd)}`,
        type: 'manual' as const,
        apy: parseFloat(apy)
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
  )
}

// TODO: Make non-styled-component CSS to enable display before hydration
export default dynamic(() => Promise.resolve(SettingsComponent), {
  ssr: false,
})
