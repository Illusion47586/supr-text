import { api } from '@services';
import useStore from '@store';
import logger from '@utils/loggers/front';
import devtool from '@utils/scripts/devtool';
import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useCopyToClipboard, useKey } from 'react-use';

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
        if (data.content === '') {
            toast.error("Content can't be empty!");
            return;
        }
        try {
            const condn = code && code !== 'local';
            const promise = condn ? api.updateNote(code, data) : api.uploadNote(data);
            toast.promise(promise, {
                success: `Successfully ${condn ? 'Updated' : 'Uploaded'}`,
                loading: condn ? 'Updating' : 'Uploading',
                error: (e) => e.message,
            });
            const response = await promise;
            if (response && response.status < 300 && response.status >= 200) {
                store.changeNote({ ...response.data, content });
            }
        } catch (error) {
            logger.error(error);
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
