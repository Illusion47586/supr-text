import { useStore } from '@nanostores/react';
import { KeyBindingContext } from '@state';
import { AnimatePresence, motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import {
    ArrowFatDown,
    Clipboard,
    Copy,
    GearSix,
    Plus,
    ShareNetwork,
    UploadSimple,
} from 'phosphor-react';
import { FC, useContext } from 'react';
import { baseMotionSettings } from 'src/utils/base_motion_settings';
import useNoteStore from 'state/stores/note';
import {
    currentView,
    isExtendedMenuVisible,
    isListVisible,
    isMenuVisible,
    toggleCurrentView,
    toggleExtendedMenuVisibility,
} from 'state/stores/toggles';

import Button, { HorizontalButtonGroup } from '../button';
import Extended from './extended';
import styles from './index.module.scss';
import ListOfNotes from './list';

const Menu: FC = () => {
    const context = useContext(KeyBindingContext);
    const store = useNoteStore();

    const $isMenuVisible = useStore(isMenuVisible);
    const $isExtendedMenuVisible = useStore(isExtendedMenuVisible);
    const $isListVisible = useStore(isListVisible);
    const $currentView = useStore(currentView);

    const openNew = () => {
        window.open('/', '_blank');
    };

    return (
        <AnimatePresence>
            {store.current !== 'local' && (
                <NextSeo
                    key="seo-overwrite"
                    title={`${store.getNote().title ?? store.current} | Supr-Text`}
                />
            )}
            {$isMenuVisible && true && (
                <motion.div className={styles.menu} {...baseMotionSettings}>
                    <AnimatePresence>{$isExtendedMenuVisible && <Extended />}</AnimatePresence>
                    <AnimatePresence>{$isListVisible && <ListOfNotes />}</AnimatePresence>
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
                                    label="Copy current note url"
                                />
                            )}
                            {store.getNote().fileType === 'markdown' && (
                                <Button
                                    onClick={() => toggleCurrentView()}
                                    icon={ArrowFatDown}
                                    label="Toggle Markdown"
                                    isActive={$currentView === 'Markdown'}
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
                                    onClick={() => toggleExtendedMenuVisibility()}
                                    icon={GearSix}
                                    isActive={$isExtendedMenuVisible}
                                    id="open-config"
                                    label="open menu"
                                />
                            )}
                            {store.current !== 'local' && window && (
                                <Button onClick={openNew} icon={Plus} label="open new note" />
                            )}
                        </HorizontalButtonGroup>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Menu;
