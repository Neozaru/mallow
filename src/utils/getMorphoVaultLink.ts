import { memoize, property } from 'lodash';

const vaultNetworkNameMapping = {
  'op mainnet': 'opmainnet',
  'arbitrum one': 'arbitrum',
}

const getVaultNetworkName = vault => {
  const vaultNetworkName = vault.chain.network.toLocaleLowerCase();
  return vaultNetworkNameMapping[vaultNetworkName] ?? vaultNetworkName
}

const getMorphoVaultLink = memoize(
  vault => `https://app.morpho.org/${getVaultNetworkName(vault)}/vault/${vault.address}`,
  property('id')
)

export default getMorphoVaultLink
