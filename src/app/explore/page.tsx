"use client";

import styled from 'styled-components';
import React from 'react';
import Layout from '@/components/Layout';
import ExploreComponent from '@/components/ExploreComponent';
import { WagmiProvider } from 'wagmi';
import { wagmiconfig } from '@/wagmiconfig';
import { QueryClientProvider } from '@tanstack/react-query';
import getQueryClient from '@/lib/getQueryClient';

const Container = styled.div`
  background-color: rgb(30, 9, 63);
  color: white;
  padding: 20px;
  margin: 0 auto;
`;

const queryClient = getQueryClient()

const Explore = () => {
  return (
    <WagmiProvider config={wagmiconfig}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Container>
            <ExploreComponent />
          </Container>
        </Layout>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Explore
