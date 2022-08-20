import useStore from '@store';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { useKey } from 'react-use';
import { baseMotionSettings } from 'src/utils/base_motion_settings';

import styles from './index.module.scss';
import { MenuContext } from './menu-context';

const ListOfNotes = () => {
    const { closeList } = useContext(MenuContext);
    const store = useStore();

    useKey((key) => key.key === 'Escape', closeList);

    return (
        <motion.div className={styles.extended} {...baseMotionSettings} layout id="list-of-items">
            <motion.div className={styles.indicator} {...baseMotionSettings}>
                <p>Press Esc to exit this menu.</p>
            </motion.div>
        </motion.div>
    );
};

export default ListOfNotes;
