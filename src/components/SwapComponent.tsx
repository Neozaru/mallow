'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

import getStablecoinAddress from '@/lib/getStablecoinAddress';
import getMallowManagerContractAddressForChain from '@/lib/getMallowManagerContractAddressForChain';
import { useOnChainBalances } from '@/hooks/balances/useOnChainBalances';
import { find, noop } from 'lodash';
import ActionButton, { ActionButtonProps } from './ActionButton';
import { base } from 'viem/chains';
import getTokenAmountFromInputValue from '@/lib/getTokenAmountFromInputValue';
import getTokenInfo from '@/lib/getTokenInfo';
import SwapInput from './SwapInput';
import OpportunityPickerModal, { OpportunityPickerModalProps } from './OpportunityPickerModal';
import { useRouter } from 'next/navigation';
import SwitchIcon from './SwitchIcon';
import useTokenAllowance from '@/hooks/useTokenAllowance';
import useSwapQuote from '@/hooks/useSwapQuote';
import useApproveSwap from '@/hooks/useApproveSwap';
import useSwap from '@/hooks/useSwap';
import { useConnectModal } from '@rainbow-me/rainbowkit';

enum OpportunityFromTo {
  OPPORTUNITY_FROM,
  OPPORTUNITY_TO
}

type Props = {
  opportunities: YieldOpportunityOnChain[];
  fromOpportunityId: string | null;
  toOpportunityId: string | null;
}

const emptyAmount: TokenAmountBaseAndDisplay = {
  base: BigInt(0),
  display: '0',
  displayUsd: '$0',
}

const closedModalState = {
  isOpen: false,
  opportunitiesGroups: [],
  onClose: noop
}

const debug = false

const SwapComponent = ({ opportunities, fromOpportunityId, toOpportunityId }: Props) => {
  const router = useRouter()
  
  const [fromOpportunity, setFromOpportunity] = useState<YieldOpportunityOnChain | undefined>()
  const [toOpportunity, setToOpportunity] = useState<YieldOpportunityOnChain | undefined>()

  // Find opportunties A and B from their IDs
  useEffect(() => {
    let newFromOpportunity = fromOpportunityId ? opportunities.find(o => o.id === fromOpportunityId) : undefined
    if (!newFromOpportunity) {
      newFromOpportunity = opportunities.find(o => o.platform === 'aave' && o.symbol === 'USDC' && o.chainId === base.id) 
    }
    const newToOpportunity = toOpportunityId ? opportunities.find(o => o.id === toOpportunityId) : undefined
    setFromOpportunity(newFromOpportunity)
    setToOpportunity(newToOpportunity)
  }, [fromOpportunityId, toOpportunityId, opportunities])

  const [baseAssetAmount, setBaseAssetAmount] = useState<TokenAmountBaseAndDisplay>(emptyAmount)

  const baseAmountIn = useMemo(() => {
    if (!baseAssetAmount.base || !fromOpportunity) {
      return BigInt(0)
    }
    // HACK: I'd rather have an unified way to do this, ideally as a "quote" from the smart-contract.
    return fromOpportunity.convertPrincipalToLP
      ? fromOpportunity.convertPrincipalToLP(baseAssetAmount.base)
      : baseAssetAmount.base
  }, [baseAssetAmount, fromOpportunity])

  const { data: quote, refetch: refetchQuoteData, isPending: isQuotePending, error: quoteError } = useSwapQuote({ fromOpportunity, toOpportunity, baseAmountIn })

  const {
    writeApprove,
    error: approveError,
    isTxSignaturePending: isApproveTxSigningPending,
    isTxPendingConfirmation: isApproveTxLoading,
    txReceipt: approveTxReceipt,
    txHash: approveTxHash
  } = useApproveSwap({ fromOpportunity, baseAmountIn })

  const {
    writeSwap,
    error: swapError,
    isTxSignaturePending: isSwapTxSigningPending,
    isTxPendingConfirmation: isSwapTxLoading,
    txReceipt: swapTxReceipt,
    txHash: swapTxHash
  } = useSwap({ fromOpportunity, toOpportunity, baseAmountIn, quote })

  const hasTxConfirmationPending = isApproveTxLoading || isSwapTxLoading
  const txError = approveError || swapError

  const { address: userAddress, status: connectionStatus } = useAccount()

  const { data: onChainBalances, refetch: refetchBalances } = useOnChainBalances(userAddress ? [userAddress] : [])

  const findBalanceForOpportunity = useCallback((opportunity?: YieldOpportunityOnChain) => {
    if (!opportunity || !onChainBalances) {
      return emptyAmount
    }
    const found = find(onChainBalances, { id: opportunity.id })
    if (!found) {
      return emptyAmount
    }
    return {
      base: found.balance,
      display: found.formattedBalance,
      displayUsd: found.balanceUsd.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      }),
    }
  }, [onChainBalances])

  const buildOpportunitiesAndBalancesForOpportunities = useCallback(opportunities => {
    return opportunities.map(opportunity => ({
      opportunity,
      balance: findBalanceForOpportunity(opportunity)
    }))
  }, [findBalanceForOpportunity])


  // V1 is same-chain swaps only, taking info from fromOpportunity
  const { fromOpportunityBalance, toOpportunityBalance } = useMemo(() => ({
    fromOpportunityBalance: findBalanceForOpportunity(fromOpportunity),
    toOpportunityBalance: findBalanceForOpportunity(toOpportunity)
  }), [fromOpportunity, toOpportunity, findBalanceForOpportunity])

  const chainId = fromOpportunity?.chainId
  
  const mallowManagerAddress = useMemo(
    () => chainId && getMallowManagerContractAddressForChain(chainId),
    [chainId]
  )

  const isChainUnsupported = useMemo(() => chainId && !mallowManagerAddress, [mallowManagerAddress, chainId])

  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (chainId && !isChainUnsupported && connectionStatus === 'connected') {
      switchChain({ chainId })
    }
  }, [chainId, isChainUnsupported, switchChain, connectionStatus])

  const baseAssetTokenInfo = useMemo(() => {
    if ((!fromOpportunity && !toOpportunity) || isChainUnsupported) {
      return null
    }
    const { symbol, chainId } = (fromOpportunity || toOpportunity) as YieldOpportunityOnChain
    return getTokenInfo(symbol, getStablecoinAddress({ symbol, chainId }))
  }, [fromOpportunity, toOpportunity, isChainUnsupported])


  const onBaseAssetAmountChange = useCallback((inputValue: string) => {
    if (!baseAssetTokenInfo) {
      return
    }
    const newBaseAssetAmount = getTokenAmountFromInputValue(inputValue, baseAssetTokenInfo)
    setBaseAssetAmount(newBaseAssetAmount)
  }, [baseAssetTokenInfo])

  const { data: tokenInAllowance, error: allowanceError, isLoading: isLoadingAllowance, refetch: refetchAllowance } = useTokenAllowance({
    tokenAddress: fromOpportunity?.poolTokenAddress,
    ownerAddress: userAddress,
    spenderAddress: mallowManagerAddress,
    chainId
  })

  const needsApprove = useMemo(() => {
    if (isLoadingAllowance || tokenInAllowance === undefined) {
      return false
    }
    return BigInt(tokenInAllowance) < baseAmountIn
  }, [tokenInAllowance, isLoadingAllowance, baseAmountIn])

  useEffect(() => {
    if (!approveTxReceipt) {
      return
    }
    refetchAllowance()
  }, [approveTxReceipt, refetchAllowance])

  useEffect(() => {
    if (!swapTxReceipt) {
      return
    }
    if (swapTxReceipt.status === 'success') {
      setBaseAssetAmount(emptyAmount)
      refetchAllowance()
      refetchBalances?.()
      refetchQuoteData()
    }
  }, [swapTxReceipt, refetchBalances, refetchQuoteData, refetchAllowance])

  const { openConnectModal } = useConnectModal()

  const ctaButtonProps = useMemo<ActionButtonProps>(() => {
    if (connectionStatus === 'disconnected') {
      return { disabled: false, text: 'Connect wallet', callback: openConnectModal }
    }
    if (isChainUnsupported) {
      return { disabled: true, text: 'Unsupported chain' }
    }
    if (fromOpportunity && !toOpportunity) {
      return { disabled: true, text: 'Select opportunity' }
    }
    if (!baseAssetAmount.base) {
      return { disabled: true, text: 'Enter an amount' }
    }
    if (!connectionStatus || connectionStatus === 'connecting' || connectionStatus === 'reconnecting'
      || isLoadingAllowance || !fromOpportunityBalance || isQuotePending) {
      return { disabled: true, text: 'Loading...' }
    }
    if (quoteError) {
      return { disabled: true, text: 'No route available' }
    }
    // If wallet connected...
    if (isApproveTxSigningPending || isSwapTxSigningPending) {
      return { disabled: true, text: 'Confirm in wallet' }
    }
    if (hasTxConfirmationPending) {
      return { disabled: true, text: 'Waiting for confirmation...' }
    }
    if (baseAssetAmount.base > fromOpportunityBalance.base) {
      return { disabled: true, text: 'Insufficient balance' }
    }
    if (needsApprove) {
      return { disabled: false, text: 'Approve', callback: writeApprove }
    }
    return { disabled: false, text: 'Zap', callback: writeSwap }
  }, [baseAssetAmount, fromOpportunity, toOpportunity, isLoadingAllowance, fromOpportunityBalance, needsApprove, connectionStatus, hasTxConfirmationPending, isChainUnsupported, writeSwap, writeApprove, openConnectModal, isApproveTxSigningPending, isSwapTxSigningPending, isQuotePending, quoteError])

  const [modalState, setModalState] = useState<OpportunityPickerModalProps>(closedModalState)

  const refreshSearchParams = useCallback((newFromOpportunity, newToOppportunity) => {
    const fromPart = newFromOpportunity ? `from=${newFromOpportunity.id}` : ''
    const toPart = newToOppportunity ? `to=${newToOppportunity.id}` : ''
    const search = [fromPart, toPart].filter(s => s.length > 0).join('&')
    router.push(`?${search}`)
  }, [router])

  const getErrorShortMessage = useCallback(error => {
    return error?.shortMessage
  }, [])

  const changeOpportunitySelection = useCallback((newOpportunity: YieldOpportunityOnChain, fromTo: OpportunityFromTo) => {
    if (fromTo === OpportunityFromTo.OPPORTUNITY_FROM) {
      if (newOpportunity === toOpportunity) {
        // If same as "to opportunity", swap them
        refreshSearchParams(newOpportunity, fromOpportunity)
      } else {
        refreshSearchParams(newOpportunity, toOpportunity)
      }
    } else {
      refreshSearchParams(fromOpportunity, newOpportunity)
    }
    setModalState(closedModalState)
  }, [fromOpportunity, toOpportunity, refreshSearchParams])

  const onClickSelectOpportunity = useCallback((fromTo: OpportunityFromTo) => {
    const opportunitiesGroups = fromTo === OpportunityFromTo.OPPORTUNITY_FROM
      ? [{
          label: 'From',
          opportunitiesAndBalances: buildOpportunitiesAndBalancesForOpportunities(
            opportunities
          ).sort((o1, o2) => Number(o2.balance.base - o1.balance.base))
        }]
      : [{
          label: 'To',
          opportunitiesAndBalances: buildOpportunitiesAndBalancesForOpportunities(
            opportunities.filter(o => o.id !== fromOpportunity?.id)
          ).sort((o1, o2) => Number(o2.opportunity.apy - o1.opportunity.apy))
        }]
      setModalState({
        isOpen: true,
        opportunitiesGroups,
        onSelect:  o => changeOpportunitySelection(o, fromTo),
        onClose: () => setModalState(closedModalState)
      })
  }, [opportunities, fromOpportunity, changeOpportunitySelection, buildOpportunitiesAndBalancesForOpportunities])

  const onClickReverseOpportunities = useCallback(() => {
    refreshSearchParams(toOpportunity, fromOpportunity)
  }, [fromOpportunity, toOpportunity, refreshSearchParams])

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-[360px] rounded border border-primary/50 p-5 bg-[#3a184d]'>
        <SwapInput
          opportunity={fromOpportunity}
          amount={baseAssetAmount}
          balance={fromOpportunityBalance}
          handleChange={onBaseAssetAmountChange}
          handleClickItem={() => onClickSelectOpportunity(OpportunityFromTo.OPPORTUNITY_FROM)}
        />
        <div className='flex flex-row items-center justify-center cursor-pointer p-1' onClick={onClickReverseOpportunities}>
          <SwitchIcon />
        </div>
        <SwapInput
          opportunity={toOpportunity}
          amount={baseAssetAmount}
          balance={toOpportunityBalance}
          handleClickItem={() => onClickSelectOpportunity(OpportunityFromTo.OPPORTUNITY_TO)}
          disabled={true}
        />
        <div className='pt-5'>
          <ActionButton {...ctaButtonProps} />
        </div>
        {swapError && <div>Swap Error: {getErrorShortMessage(swapError)}</div>}
        {approveError && <div>Approve Error: {getErrorShortMessage(approveError)}</div>}
        {txError && <div>Tx Error: {getErrorShortMessage(txError)}</div>}
        {debug && <>
          {allowanceError && <div>Allowance Error: {allowanceError?.shortMessage}</div>}
          {quoteError && <div>Quote error: {quoteError?.shortMessage}</div>}
          <div>Amount in: ({baseAmountIn} / {fromOpportunityBalance.base})</div>
          <div>fromOpportunityBalance: {fromOpportunityBalance.base} - {fromOpportunityBalance.display} - {fromOpportunityBalance.displayUsd}</div>
          <div>Quote: {quote?.[1] || 0}</div>
          <div>Approve tx: {approveTxHash}</div>
          <div>Swap tx: {swapTxHash}</div>
          Allowance: {tokenInAllowance}
        </>}
      </div>
      <OpportunityPickerModal {...modalState} />
    </div>
  )
}

export default SwapComponent
