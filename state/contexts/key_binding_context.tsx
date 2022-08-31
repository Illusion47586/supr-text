import { api } from '@services';
import logger from '@utils/loggers/front';
import { createContext, FC, ReactNode, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCopyToClipboard, useEffectOnce, useKey } from 'react-use';
import useStore from 'state/stores/note';

import {
    currentView,
    toggleCurrentView,
    toggleExtendedMenuVisibility,
    toggleListVisibility,
} from '../stores/toggles';

interface KeyBindingContextInterface {
    copyContentToClipboard?: () => void;
    copyCodeToClipboard?: () => void;
    uploadToServer?: () => Promise<void>;
}

const KeyBindingContext = createContext<KeyBindingContextInterface>({});

interface KeyBindingContextProps {
    children: ReactNode;
}

const KeyBindingContextProvider: FC<KeyBindingContextProps> = ({ children }) => {
    const store = useStore();

    useEffectOnce(() => {
        if (store.getNote().fileType === 'markdown') currentView.set('Markdown');
    });

    const [, copyToClipboard] = useCopyToClipboard();

    const copyContentToClipboard = () => {
        if (store.getNote()?.code) {
            copyToClipboard(store.getNote()?.content);
            toast('Content copied to your clipboard!');
        }
    };

    const copyCodeToClipboard = () => {
        if (store.getNote()?.code) {
            const url = `${process.env.NEXT_PUBLIC_URL}/${store.getNote().code}?nokey=true`;
            copyToClipboard(url);
            toast('URL copied to your clipboard!');
        }
    };

    const uploadToServer = async () => {
        const data = { ...store.getNote() };
        const { code, content } = data;
        const toastid = `server_contact_${code}`;
        if (data.content === '') {
            toast.error("Content can't be empty!");
            return;
        }
        try {
            toast.loading(code !== 'local' ? 'Updating' : 'Uploading', { id: toastid });
            const response =
                code && code !== 'local'
                    ? await api.updateNote(code, data)
                    : await api.uploadNote(data);
            if (response && response.status < 300 && response.status >= 200) {
                store.changeNote({ ...response.data, content });
                toast.success(`Successfully ${code !== 'local' ? 'Updated' : 'Uploaded'}`, {
                    id: toastid,
                });
            }
        } catch (error) {
            logger.error(error);
        }
        toast.remove(toastid);
    };

    useKey((key) => key.key === '/' && key.altKey, toggleExtendedMenuVisibility);
    useKey((key) => key.key === 'o' && key.altKey, toggleListVisibility);
    useKey((key) => key.key === 'c' && key.altKey, copyContentToClipboard);
    useKey((key) => key.key === 'u' && key.altKey, uploadToServer);
    useKey((key) => key.key === 'm' && key.altKey, toggleCurrentView);

    const state = useMemo(() => {
        return {
            copyContentToClipboard,
            copyCodeToClipboard,
            uploadToServer,
        };
    }, []);

    return <KeyBindingContext.Provider value={state}>{children}</KeyBindingContext.Provider>;
};

export { KeyBindingContext, KeyBindingContextProvider };
export type { KeyBindingContextInterface };
