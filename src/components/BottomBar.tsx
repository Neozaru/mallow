import Link from "next/link";
import { DashboardIcon, ExploreIcon, SwapIcon } from "./MenuIcons"
import styles from './BottomBar.module.css'

const BottomBar = ({ page }) => {
  return (
    <div className={styles.bottomBarContainer}>
      <Link href="/dashboard" passHref>
        <div className={page === 'dashboard' ? `${styles.bottomBarItem} ${styles.bottomBarItemCurrent}` : `${styles.bottomBarItem} ${styles.bottomBarItemDefault}`}>
          <DashboardIcon />
        </div>
      </Link>
      <Link href="/swap" passHref>
        <div className={page === 'swap' ? `${styles.bottomBarItem} ${styles.bottomBarItemCurrent}` : `${styles.bottomBarItem} ${styles.bottomBarItemDefault}`}>
          <SwapIcon />
        </div>
      </Link>
      <Link href="/explore" passHref>
        <div className={page === 'explore' ? `${styles.bottomBarItem} ${styles.bottomBarItemCurrent}` : `${styles.bottomBarItem} ${styles.bottomBarItemDefault}`}>
          <ExploreIcon />
        </div>
      </Link>
    </div>
  );
};

export default BottomBar;
