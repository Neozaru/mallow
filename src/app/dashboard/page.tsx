import React from 'react';
import DashboardComponentWrapper from '@/components/DashboardComponentWrapper';
import Layout from '@/components/Layout';
import ProvidersBundleWrapper from '@/components/ProvidersBundleWrapper';

const DashboardPageWithoutAddress = async () => {
  return (
    <Layout page='dashboard'>
      <ProvidersBundleWrapper>
        <DashboardComponentWrapper/>
      </ProvidersBundleWrapper>
    </Layout>
  )
}

export default DashboardPageWithoutAddress
