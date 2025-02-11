import React from 'react'
import styles from './LoadingSpinner.module.css'

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingWrapper}>
      <img
        className={styles.loadingLogo}
        src='/mallowLogoWhiteTransparentBackground.svg'
        alt=''
      />
      <div>Loading...</div>
    </div>
  );
};

export default LoadingSpinner;
