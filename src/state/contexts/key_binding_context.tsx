import { createContext, FC, ReactNode, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCopyToClipboard, useEffectOnce, useKey } from 'react-use';

import { api } from '@services';

import useStore from '@state/stores/note';
import {
    currentView,
    toggleCurrentView,
    toggleExtendedMenuVisibility,
    toggleListVisibility,
} from '@state/stores/toggles';

import logger from '@utils/loggers/front';

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
            let url = `${process.env.NEXT_PUBLIC_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL}/${
                store.getNote().code
            }`;
            if (!store.getNote().password || store.getNote().password?.length === 0)
                url += '?nokey=true';
            copyToClipboard(url);
            toast('URL copied to your clipboard!');
        }
    };

    let timer: string | number | NodeJS.Timeout | undefined;
    const uploadToServer = async () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            const data = { ...store.getNote() };
            const { code, content } = data;
            if (data.content === '') {
                toast.error("Content can't be empty!");
                return;
            }
            const response =
                code && code !== 'local' ? api.updateNote(code, data) : api.uploadNote(data);

            toast.promise(
                response,
                {
                    success: `Successfully ${code !== 'local' ? 'Updated' : 'Uploaded'}`,
                    loading: `${code !== 'local' ? 'Updating' : 'Uploading'}`,
                    error: (e) => e,
                },
                { id: code },
            );

            const res = await response;
            if (res && res.status < 300 && res.status >= 200) {
                store.changeNote({ ...res.data, content });
            } else {
                logger.error(res.data);
            }
        }, 300);
    };

    useKey((key) => key.key === 'k' && key.altKey, toggleExtendedMenuVisibility);
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
