
const bitstampHeaders = {
  AUTH: 'X-Auth'.toLocaleLowerCase(),
  NONCE: 'X-Auth-Nonce'.toLocaleLowerCase(),
  TIMESTAMP: 'X-Auth-Timestamp'.toLocaleLowerCase(),
  VERSION: 'X-Auth-Version'.toLocaleLowerCase(),
  SIGNATURE: 'X-Auth-Signature'.toLocaleLowerCase(),
  // SUBACCOUNT_ID: 'X-Auth-Subaccount-Id'.toLocaleLowerCase(),
  // CONTENT_TYPE: 'Content-Type'.toLocaleLowerCase()
}

export default bitstampHeaders

