'use client';

import { ConnectKitProvider } from 'connectkit'
import DashboardComponent from './DashboardComponent'

const DashboardComponentWrapper = () => {
  return (
    <ConnectKitProvider theme="midnight">
      <DashboardComponent key="dashboardwrapper"/>
    </ConnectKitProvider>
  )
}

export default DashboardComponentWrapper
