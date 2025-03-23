import { encodePacked, keccak256 } from 'viem';

const encodeProtocolName = (protocolName: string) =>
  keccak256(encodePacked(['string'], [protocolName]))

export default encodeProtocolName
