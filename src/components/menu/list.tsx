import { useRef } from 'react';
import { useClickAway, useKey } from 'react-use';
import { motion } from 'framer-motion';

import { ApplicationState } from '@state';

import { baseMotionSettings } from '@fe-utils/base_motion_settings';

import styles from './index.module.scss';

const ListOfNotes = () => {
    const ref = useRef(null);

    const closeList = () => {
        ApplicationState.isListVisible.set(false);
    };

    useKey((key) => key.key === 'Escape', closeList);

    useClickAway(ref, (e: { target?: { tagName?: string; id?: string } } & any) => {
        if (!(e.target?.tagName === 'svg' || e.target?.id === 'open-config')) closeList();
    });

    return (
        <motion.div
            className={styles.extended}
            {...baseMotionSettings}
            layout
            id="list-of-items"
            ref={ref}
        >
            <motion.div className={styles.indicator} {...baseMotionSettings}>
                <p>Press Esc to exit this menu.</p>
            </motion.div>
        </motion.div>
    );
};

export default ListOfNotes;
