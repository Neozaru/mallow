import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'


const useWriteContractAndWaitForTransactionReceipt = () => {
  const { data: txHash, isPending: isTxSignaturePending, error: txSignatureError, writeContract } = useWriteContract()
  const { isLoading: isTxPendingConfirmation, data: txReceipt, error: txError } = useWaitForTransactionReceipt({ hash: txHash })

  const error = txSignatureError || txError

  return { writeContract, isTxSignaturePending, isTxPendingConfirmation, txHash, txReceipt, error }
}

export default useWriteContractAndWaitForTransactionReceipt
