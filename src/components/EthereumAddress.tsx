import React, { useState } from "react";
import { FaCopy, FaThumbsUp } from 'react-icons/fa';
import styled from 'styled-components';

const Wrapper = styled.span`
  cursor: pointer;
  color: #e5e7eb;
`

const EthereumAddress = ({ address, enableCopy = false }) => {
  const [copied, setCopied] = useState(false);

  const shortenAddress = address =>
    address.slice(0, 5) + "..." + address.slice(address.length - 4)

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Wrapper onClick={handleCopy}>
      <span>{shortenAddress(address)}</span>
      {enableCopy && <button style={{ marginLeft: "8px" }}>
        {copied ? <FaThumbsUp/> : <FaCopy/>}
      </button>}
    </Wrapper>
  );
};

export default EthereumAddress;
