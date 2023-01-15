import React, { useEffect, useState } from 'react';

import { useNoteStore } from '@state';

import styles from './index.module.scss';

export const Header: React.FC = () => {
    const store = useNoteStore();
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
