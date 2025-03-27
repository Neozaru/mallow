'use client';

import Layout from '@/components/Layout';
import ProvidersBundleWrapper from '@/components/ProvidersBundleWrapper';
import SwapWrapper from '@/components/SwapWrapper'
import { Suspense } from 'react';

const Swap = () => {
  return (
    <Layout page='swap'>
      <ProvidersBundleWrapper>
        <Suspense>
          <SwapWrapper/>
        </Suspense>
      </ProvidersBundleWrapper>
    </Layout>
  )
}

export default Swap
