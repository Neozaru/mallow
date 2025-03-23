import React from 'react';
import Layout from '@/components/Layout';
import ProvidersBundleWrapper from '@/components/ProvidersBundleWrapper';
import ProComponent from '@/components/ProComponent';

const ProPage = async () => {
  return (
    <Layout page='pro'>
      <ProvidersBundleWrapper>
        <ProComponent/>
      </ProvidersBundleWrapper>
    </Layout>
  )
}

export default ProPage
