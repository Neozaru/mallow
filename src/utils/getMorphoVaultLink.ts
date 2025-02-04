import { memoize, property } from 'lodash';

const getMorphoVaultLink = memoize(
  vault => `https://app.morpho.org/vault?vault=${vault.address}&network=${vault.chain.network}`,
  property('id')
)

export default getMorphoVaultLink
