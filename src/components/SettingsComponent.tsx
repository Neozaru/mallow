"use client";

import styled from 'styled-components';
import React, { useState, useEffect, useCallback } from 'react';
import SettingsService, { OnChainAccount } from '@/lib/settingsService';
import { uniq } from 'lodash';
import { useRouter } from 'next/navigation';
import { Address } from 'viem';
import dynamic from 'next/dynamic';
import ActionButton from './ActionButton';

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

const SettingsComponent = () => {
  const [coinbaseKeyName, setCoinbaseKeyName] = useState('')
  const [coinbaseApiSecret, setCoinbaseApiSecret] = useState('')
  const [krakenApiKey, setKrakenApiKey] = useState('')
  const [krakenApiSecret, setKrakenApiSecret] = useState('')
  const [binanceApiKey, setBinanceApiKey] = useState('')
  const [binanceApiSecret, setBinanceApiSecret] = useState('')
  const [bitstampApiKey, setBitstampApiKey] = useState('')
  const [bitstampApiSecret, setBitstampApiSecret] = useState('')
  const [onChainAccounts, setOnChainAccounts] = useState('')
  const [manualPositions, setManualPositions] = useState('')

  const router = useRouter()

  const loadFromLocalStorage = useCallback(() => {
    const settings = SettingsService.getSettings()
    setCoinbaseKeyName(settings.apiKeys.coinbaseKeyName)
    setCoinbaseApiSecret(settings.apiKeys.coinbaseApiSecret)
    setKrakenApiKey(settings.apiKeys.krakenApiKey)
    setKrakenApiSecret(settings.apiKeys.krakenApiSecret)
    setBinanceApiKey(settings.apiKeys.binanceApiKey)
    setBinanceApiSecret(settings.apiKeys.binanceApiSecret)
    setBitstampApiKey(settings.apiKeys.bitstampApiKey)
    setBitstampApiSecret(settings.apiKeys.bitstampApiSecret)
    setOnChainAccounts(
      settings.onChainAccounts.map(account => `${account.address}`).join('\n')
    )
    setManualPositions(
      settings.manualPositions.map(({symbol, balanceUsd, apy}) => `${symbol},${balanceUsd},${apy}`).join('\n')
    )
  }, [])

  useEffect(() => {
    loadFromLocalStorage()
  }, [loadFromLocalStorage]);

  function onlyUnique(value: unknown, index: number, array: unknown[]) {
    return array.indexOf(value) === index
  }

  const saveSettings = useCallback(() => {
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
        bitstampApiKey,
        bitstampApiSecret
      },
      onChainAccounts: onChainAccountsNewSettings,
      manualPositions: manualPositionsNewSettings,
    })
    router.push('/pro')
  }, [router, binanceApiKey, binanceApiSecret, krakenApiKey, krakenApiSecret, coinbaseKeyName, coinbaseApiSecret, bitstampApiKey, bitstampApiSecret, onChainAccounts, manualPositions])

  const saveSettingsForm = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    saveSettings()
  }, [saveSettings])

  return (
    <div>
      <div className='flex flex-row justify-between pb-3 pt-3'>
        <h1 className='text-5xl'>Pro Settings</h1>
        <div>
          {/* <button onClick={SettingsService.downloadSettingsToFile}>Import</button> */}
          <div className='pb-2'>
            <label htmlFor="file" role="button" className='text-md cursor-pointer p-2 rounded bg-widgetBg h-11 align-middle'>
              📥 Import
            </label>
            <input className='hidden' id="file" type="file" accept=".json" onChange={e => SettingsService.loadSettingsFromFile(e.target.files?.[0]).then(loadFromLocalStorage)} />
          </div>
          <div>
            <button className='text-md cursor-pointer pl-2 pr-2 pt-1 pb-1 rounded bg-widgetBg align-middle' onClick={() => SettingsService.downloadSettingsToFile()}>
              📤 Export
            </button>
          </div>
        </div>
      </div>
      <Form onSubmit={saveSettingsForm}>
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
        {/* Bitstamp */}
        <InputGroup>
          <Label htmlFor="binanceApiKey">Bitstamp API Key:</Label>
          <Input
            id="bitstampApiKey"
            type="text"
            value={bitstampApiKey}
            onChange={(e) => setBitstampApiKey(e.target.value)}
            placeholder="Enter your Bitstamp API Key"
          />
          <Label htmlFor="binanceApiSecret">Bitstamp API Secret:</Label>
          <Input
            id="bitstampApiSecret"
            type="text"
            value={bitstampApiSecret}
            onChange={(e) => setBitstampApiSecret(e.target.value)}
            placeholder="Enter your Bitstamp API Secret"
          />
        </InputGroup>
        <ActionButton text='Save Settings' callback={saveSettings} />
      </Form>
    </div>
  )
}

// TODO: Make non-styled-component CSS to enable display before hydration
export default dynamic(() => Promise.resolve(SettingsComponent), {
  ssr: false,
})
