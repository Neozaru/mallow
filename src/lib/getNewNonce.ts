
let nonce = Math.floor(Date.now() / 1000)

export const getNewNonce = () => {
  const currentNonce = nonce
  nonce += 1
  return currentNonce
};

export default getNewNonce
