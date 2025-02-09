import React from 'react';
import Layout from '@/components/Layout';
import ExploreComponent from '@/components/ExploreComponent';
import ProvidersBundleWrapper from '@/components/ProvidersBundleWrapper';

const Explore = async () => {
  return (
    <Layout page={'explore'}>
      <ProvidersBundleWrapper>
        <ExploreComponent />
      </ProvidersBundleWrapper>
    </Layout>
  );
};

export default Explore;
