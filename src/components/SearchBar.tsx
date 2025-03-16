import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgb(48, 16, 99);
`;

const SearchIcon = styled(FaSearch)`
  margin-right: 8px;
  color: #ccc;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 18px;

  &:focus {
    outline: none;
  }

  ::placeholder {
    color: #aaa;
  }
`;

const ClearIcon = styled(FaTimes)`
  margin-left: 8px;
  color: #ccc;
  cursor: pointer;
`;

export default function SearchBar({ value, onChange, onClear, autoFocus }) {
  return (
    <SearchContainer>
      <SearchIcon />
      <Input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      {value && <ClearIcon onClick={onClear} />}
    </SearchContainer>
  );
}
