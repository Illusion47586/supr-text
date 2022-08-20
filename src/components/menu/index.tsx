import useStore from '@store';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import {
    Check,
    Clipboard,
    Copy,
    FilePlus,
    GearSix,
    List,
    Plus,
    ShareNetwork,
    Upload,
    UploadSimple,
} from 'phosphor-react';
import { FC, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { baseMotionSettings } from 'src/utils/base_motion_settings';

import Button, { HorizontalButtonGroup } from '../button';
import Extended from './extended';
import styles from './index.module.scss';
import ListOfNotes from './list';
import { MenuContext } from './menu-context';

const Menu: FC = () => {
    const context = useContext(MenuContext);
    const store = useStore();
    const router = useRouter();

    const openNew = () => {
        window.open('/', '_blank');
    };

    return (
        <AnimatePresence>
            {context.visible && (
                <motion.div className={styles.menu} {...baseMotionSettings}>
                    <AnimatePresence>{context.extendedVisible && <Extended />}</AnimatePresence>
                    <AnimatePresence>{context.listVisible && <ListOfNotes />}</AnimatePresence>
                    <motion.div className={styles.main}>
                        <HorizontalButtonGroup>
                            {!store.localLock && (
                                <Button
                                    title={store.current === 'local' ? 'Share' : undefined}
                                    onClick={() => context.uploadToServer?.()}
                                    icon={store.current === 'local' ? ShareNetwork : UploadSimple}
                                />
                            )}
                            {store.current !== 'local' && (
                                <Button
                                    title={store.current}
                                    onClick={() => context.copyCodeToClipboard?.()}
                                    icon={Copy}
                                />
                            )}
                            {store.getNote().content.length > 0 && (
                                <Button
                                    onClick={() => context.copyContentToClipboard?.()}
                                    icon={Clipboard}
                                />
                            )}
                            {!store.localLock && (
                                <Button
                                    onClick={() => context.toggleExtended?.()}
                                    icon={GearSix}
                                    isActive={context.extendedVisible}
                                    id="open-config"
                                />
                            )}
                            {store.current !== 'local' && (
                                <Button
                                    onClick={openNew}
                                    icon={Plus}
                                    isActive={context.listVisible}
                                />
                            )}
                        </HorizontalButtonGroup>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Menu;
