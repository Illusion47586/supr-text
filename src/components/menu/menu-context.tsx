import { api } from '@services';
import useStore from '@store';
import logger from '@utils/loggers/front';
import { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useCopyToClipboard, useEffectOnce, useKey } from 'react-use';

interface MenuContextInterface {
    visible: boolean;
    extendedVisible: boolean;
    listVisible: boolean;
    openExtended?: () => void;
    closeExtended?: () => void;
    toggleExtended?: () => void;
    openList?: () => void;
    closeList?: () => void;
    toggleList?: () => void;
    closeAll?: () => void;
    show?: () => void;
    hide?: () => void;
    copyContentToClipboard?: () => void;
    copyCodeToClipboard?: () => void;
    uploadToServer?: () => Promise<void>;
}

const MenuContext = createContext<MenuContextInterface>({
    visible: true,
    extendedVisible: false,
    listVisible: false,
});

interface MenuContextProps {
    children: ReactNode;
}

const MenuContextProvider: FC<MenuContextProps> = ({ children }) => {
    const [visible, setVisible] = useState(true);
    const [extendedVisible, setExtendedVisible] = useState(false);
    const [listVisible, setListVisible] = useState(false);

    useEffectOnce(() => {
        if (window.innerWidth < 800) setVisible(false);
    });

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const openExtended = () => {
        setListVisible(false);
        setExtendedVisible(true);
    };
    const closeExtended = () => {
        if (extendedVisible) setExtendedVisible(false);
    };
    const toggleExtended = () => {
        if (extendedVisible) closeExtended();
        else openExtended();
    };

    const openList = () => {
        setExtendedVisible(false);
        setListVisible(true);
    };
    const closeList = () => setListVisible(false);
    const toggleList = () => {
        if (listVisible) closeList();
        else openList();
    };

    const closeAll = () => {
        closeList();
        closeExtended();
    };

    // useEffect(() => {
    //     console.log('Extended', extendedVisible);
    //     console.log('List', listVisible);
    //     console.log('.');
    // }, [extendedVisible, listVisible]);

    const [, copyToClipboard] = useCopyToClipboard();
    const store = useStore();

    const copyContentToClipboard = () => {
        if (store.getNote()?.code) {
            copyToClipboard(store.getNote()?.content);
            toast('Content copied to your clipboard!');
        }
    };

    const copyCodeToClipboard = () => {
        if (store.getNote()?.code) {
            copyToClipboard(store.getNote().code!);
            toast('Code copied to your clipboard!');
        }
    };

    const uploadToServer = async () => {
        const data = { ...store.getNote() };
        const { code, content } = data;
        const toastid = `server_contact_${code}`;
        console.log(data);
        if (data.content === '') {
            toast.error("Content can't be empty!");
            return;
        }
        try {
            toast.loading(code ? 'Updating' : 'Uploading', { id: toastid });
            const response =
                code && code !== 'local'
                    ? await api.updateNote(code, data)
                    : await api.uploadNote(data);
            if (response && response.status < 300 && response.status >= 200) {
                store.changeNote({ ...response.data, content });
                toast.remove(toastid);
                toast.success(`Successfully ${code ? 'Updated' : 'Uploaded'}`);
            }
        } catch (error) {
            logger.error(error);
        } finally {
            toast.remove(toastid);
        }
    };

    useKey((key) => key.key === '/' && key.altKey, toggleExtended);
    useKey((key) => key.key === 'o' && key.altKey, toggleList);
    useKey((key) => key.key === 'c' && key.altKey, copyContentToClipboard);
    useKey((key) => key.key === 'u' && key.altKey, uploadToServer);

    const state = useMemo(() => {
        return {
            visible,
            extendedVisible,
            listVisible,
            openExtended,
            closeExtended,
            toggleExtended,
            openList,
            closeList,
            toggleList,
            closeAll,
            show,
            hide,
            copyContentToClipboard,
            copyCodeToClipboard,
            uploadToServer,
        };
    }, [visible, extendedVisible]);

    return <MenuContext.Provider value={state}>{children}</MenuContext.Provider>;
};

export { MenuContext, MenuContextProvider };
export type { MenuContextInterface };
