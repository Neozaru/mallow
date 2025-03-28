import getSupportedChainIds from './getSupportedChainIds'


const isChainEnabled = chainId => {
  return getSupportedChainIds().includes(chainId)
}

export default isChainEnabled
