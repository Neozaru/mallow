import { wagmiconfig } from '@/wagmiconfig'
import { memoize } from 'lodash'

const getSupportedChainIds = memoize(() => {
  return wagmiconfig.chains.map(({ id }) => id)
})

export default getSupportedChainIds