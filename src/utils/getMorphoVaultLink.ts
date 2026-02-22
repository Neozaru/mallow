import { memoize, property } from 'lodash';

const getMorphoVaultLink = memoize(
  vault => `https://app.morpho.org/vault?vault=${vault.address}&network=${vault.chain.network.toLocaleLowerCase()}`,
  property('id')
)

export default getMorphoVaultLink
