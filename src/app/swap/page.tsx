'use client';

import Layout from '@/components/Layout';
import ProvidersBundleWrapper from '@/components/ProvidersBundleWrapper';
import SwapWrapper from '@/components/SwapWrapper'
import { ConnectKitProvider } from 'connectkit';
import { Suspense } from 'react';


const Swap = () => {
  return (
    <Layout page='swap'>
      <ProvidersBundleWrapper>
        <ConnectKitProvider theme="midnight">
          <Suspense>
            <SwapWrapper/>
          </Suspense>
        </ConnectKitProvider>
      </ProvidersBundleWrapper>
    </Layout>
  )
}

export default Swap
