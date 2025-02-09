import Link from "next/link";
import { DashboardIcon, ExploreIcon, SettingsIcon } from "./MenuIcons"; // Import icons
import styles from './BottomBar.module.css'; // Import the CSS module

const BottomBar = ({ page }) => {
  return (
    <div className={styles.bottomBarContainer}>
      <Link href="/dashboard" passHref>
        <div className={page === 'dashboard' ? `${styles.bottomBarItem} ${styles.bottomBarItemCurrent}` : `${styles.bottomBarItem} ${styles.bottomBarItemDefault}`}>
          <DashboardIcon />
        </div>
      </Link>
      <Link href="/explore" passHref>
        <div className={page === 'explore' ? `${styles.bottomBarItem} ${styles.bottomBarItemCurrent}` : `${styles.bottomBarItem} ${styles.bottomBarItemDefault}`}>
          <ExploreIcon />
        </div>
      </Link>
      <Link href="/settings" passHref>
        <div className={page === 'settings' ? `${styles.bottomBarItem} ${styles.bottomBarItemCurrent}` : `${styles.bottomBarItem} ${styles.bottomBarItemDefault}`}>
          <SettingsIcon />
        </div>
      </Link>
    </div>
  );
};

export default BottomBar;
