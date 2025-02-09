'use client';

import { ConnectKitProvider } from 'connectkit'
import DashboardComponent from './DashboardComponent'
// import dynamic from 'next/dynamic';

const DashboardComponentWrapper = () => {
  return (
    <ConnectKitProvider theme="midnight">
      <DashboardComponent key="dashboardwrapper"/>
    </ConnectKitProvider>
  )
}

export default DashboardComponentWrapper
// export default dynamic(() => Promise.resolve(DashboardComponentWrapper), {
//   ssr: false,
// })
