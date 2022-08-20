import React from 'react';

import styles from './index.module.scss';

type Props = {
    height?: number;
    width?: number;
};

const Loader = (props: Props) => {
    return (
        <div className={styles['lds-ripple']} style={{ height: props.height, width: props.width }}>
            <div />
            <div />
        </div>
    );
};

export default Loader;
