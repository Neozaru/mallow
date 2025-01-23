"use client";

import styled from 'styled-components';
import React from 'react';
import Layout from '@/components/Layout';

const Container = styled.div`
  background-color: rgb(30, 9, 63);
  color: white;
  padding: 20px;
  margin: 0 auto;
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const ComingSoonWrapper = styled.div`
  font-size: 36px;
  margin: auto;
  text-align: center;
`

const Explore = () => {
  return (
    <Layout>
      <Container>
        <Heading>Explore</Heading>
        <ComingSoonWrapper>
          Coming Soon™
        </ComingSoonWrapper>

      </Container>
    </Layout>
  )
}

export default Explore
