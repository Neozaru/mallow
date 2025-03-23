import Link from 'next/link'
import { DashboardIcon, ExploreIcon, ProIcon, SwapIcon } from './MenuIcons'
import styles from './Sidebar.module.css'

const Sidebar = ({ page }) => {
  return (
    <div className={styles.sidebarContainer}>
      <Link href="/" passHref>
        <img src="/mallowLogoWhiteTransparentBgWithText.svg" alt="MALLOW" className={styles.logo} />
      </Link>
      <ul className={styles.sidebarList}>
        <Link href="/dashboard" passHref>
          <li className={styles.sidebarItem} style={{ backgroundColor: page === 'dashboard' ? '#8d54b2' : 'transparent', fontWeight: page === 'dashboard' ? 'bold' : 'normal' }}>
            <span className={styles.icon}><DashboardIcon /></span>
            Dashboard
          </li>
        </Link>
        <Link href="/swap" passHref>
          <li className={styles.sidebarItem} style={{ backgroundColor: page === 'swap' ? '#8d54b2' : 'transparent', fontWeight: page === 'swap' ? 'bold' : 'normal' }}>
            <span className={styles.icon}><SwapIcon /></span>
            Zap (beta)
          </li>
        </Link>
        <Link href="/explore" passHref>
          <li className={styles.sidebarItem} style={{ backgroundColor: page === 'explore' ? '#8d54b2' : 'transparent', fontWeight: page === 'explore' ? 'bold' : 'normal' }}>
            <span className={styles.icon}><ExploreIcon /></span>
            Explore
          </li>
        </Link>
        <hr/>
        <Link href="/pro" passHref>
          <li className={styles.sidebarItem} style={{ backgroundColor: page === 'pro' ? '#8d54b2' : 'transparent', fontWeight: page === 'pro' ? 'bold' : 'normal' }}>
            <span className={styles.icon}><ProIcon /></span>
            Mallow Pro
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
