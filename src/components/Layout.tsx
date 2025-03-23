import BottomBar from './BottomBar'
import Sidebar from './Sidebar'
import React, { Suspense } from 'react'
import styles from './Layout.module.css'
import LoadingSpinner from './LoadingSpinner'

interface LayoutProps {
  children: React.ReactNode;
  page: 'dashboard' | 'explore' | 'swap' | 'pro' | 'settings'
}

const Layout: React.FC<LayoutProps> = ({ children, page }) => (
  <div className={styles.layoutContainer}>
    <Sidebar page={page} />
    <div className={styles.content}>
      <Suspense fallback={<LoadingSpinner/>}>
        {children}
      </Suspense>
    </div>
    <BottomBar page={page} />
  </div>
);

export default Layout;
