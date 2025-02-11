import Link from 'next/link'
import { DashboardIcon, ExploreIcon, SettingsIcon } from './MenuIcons'
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
        <Link href="/explore" passHref>
          <li className={styles.sidebarItem} style={{ backgroundColor: page === 'explore' ? '#8d54b2' : 'transparent', fontWeight: page === 'explore' ? 'bold' : 'normal' }}>
            <span className={styles.icon}><ExploreIcon /></span>
            Explore
          </li>
        </Link>
        <Link href="/settings" passHref>
          <li className={styles.sidebarItem} style={{ backgroundColor: page === 'settings' ? '#8d54b2' : 'transparent', fontWeight: page === 'settings' ? 'bold' : 'normal' }}>
            <span className={styles.icon}><SettingsIcon /></span>
            Settings
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
