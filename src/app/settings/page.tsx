import React from 'react';
import Layout from '@/components/Layout';
import SettingsComponent from '@/components/SettingsComponent';

const Settings = async () => {
  return (
    <Layout page={'settings'}>
      <SettingsComponent />
    </Layout>
  )
}

export default Settings
