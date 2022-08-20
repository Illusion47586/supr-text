import React, { useEffect, useState } from 'react';
import useStore from 'store';

import styles from './index.module.scss';

export const Header: React.FC = () => {
    const store = useStore();
    const [header, setHeader] = useState('Supr-Text');

    useEffect(() => {
        if (store.getNote()?.title) setHeader(store.getNote().title!);
        else setHeader('Supr-Text');
    }, [store.getNote()?.title]);

    return (
        <div className={styles.header}>
            <h1>{header}</h1>
        </div>
    );
};

export default Header;
