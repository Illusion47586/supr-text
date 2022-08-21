import useStore from '@store';
import { AnimatePresence, motion } from 'framer-motion';
import { Clipboard, Copy, GearSix, Plus, ShareNetwork, UploadSimple } from 'phosphor-react';
import { FC, useContext } from 'react';
import { baseMotionSettings } from 'src/utils/base_motion_settings';

import Button, { HorizontalButtonGroup } from '../button';
import Extended from './extended';
import styles from './index.module.scss';
import ListOfNotes from './list';
import { MenuContext } from './menu-context';

const Menu: FC = () => {
    const context = useContext(MenuContext);
    const store = useStore();

    const openNew = () => {
        window.open('/', '_blank');
    };

    return (
        <AnimatePresence>
            {context.visible && (
                <motion.div className={styles.menu} {...baseMotionSettings}>
                    <AnimatePresence>{context.extendedVisible && <Extended />}</AnimatePresence>
                    <AnimatePresence>{context.listVisible && <ListOfNotes />}</AnimatePresence>
                    <motion.div className={styles.main} layout>
                        <HorizontalButtonGroup>
                            {!store.localLock && (
                                <Button
                                    title={store.current === 'local' ? 'Share' : undefined}
                                    onClick={() => context.uploadToServer?.()}
                                    icon={store.current === 'local' ? ShareNetwork : UploadSimple}
                                    label={store.current === 'local' ? 'Share' : 'Update'}
                                />
                            )}
                            {store.current !== 'local' && (
                                <Button
                                    title={store.current}
                                    onClick={() => context.copyCodeToClipboard?.()}
                                    icon={Copy}
                                    label="Copy current note id"
                                />
                            )}
                            {store.getNote().content.length > 0 && (
                                <Button
                                    onClick={() => context.copyContentToClipboard?.()}
                                    icon={Clipboard}
                                    label="Copy current note content"
                                />
                            )}
                            {!store.localLock && (
                                <Button
                                    onClick={() => context.toggleExtended?.()}
                                    icon={GearSix}
                                    isActive={context.extendedVisible}
                                    id="open-config"
                                    label="open menu"
                                />
                            )}
                            {store.current !== 'local' && window && (
                                <Button onClick={openNew} icon={Plus} label="open-new-note" />
                            )}
                        </HorizontalButtonGroup>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Menu;
