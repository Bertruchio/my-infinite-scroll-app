import React from 'react';
import styles from '../styles/Loader.module.css';

export const Loader: React.FC = () => (
    <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <span role="status">Загрузка данных...</span>
    </div>
);
