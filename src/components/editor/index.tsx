/* eslint-disable react/jsx-key */
import Loader from '@components/loader';
import { useStore } from '@nanostores/react';
import dynamic from 'next/dynamic';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import React, { Suspense, useState } from 'react';
import toast from 'react-hot-toast';
import PrismEditor from 'react-simple-code-editor';
import { useDebounce, useEffectOnce } from 'react-use';
import { ApplicationState, useNoteStore } from 'src/state';

import editorTheme from './code_style';
import styles from './index.module.scss';

const DynamicMarkdownRenderer = dynamic(() => import('@components/markdown'), {
    suspense: true,
    loading: () => <Loader />,
});

interface Props {
    isNotEditable?: boolean;
}

const Editor: React.FC<Props> = (props) => {
    const store = useNoteStore();
    const [code, setCode] = useState<string>('');
    const [allowDebounce, setAllowDebounce] = useState(false);

    const $currentView = useStore(ApplicationState.currentView);

    useEffectOnce(() => {
        if (store.getNote()?.content) setCode(store.getNote()?.content);
        setAllowDebounce(true);

        if (store.current && store.current !== 'local')
            toast(
                `Currently notes expire in 24 hours from creating, or 25 reads, whichever comes first :)\nAs of now this note is left with ${
                    store.getNote()?.remainingCalls
                } calls.`,
                { duration: 6000, position: 'top-center' },
            );
    });

    useDebounce(
        () => {
            if (allowDebounce) store.updateNote({ content: code });
        },
        300,
        [code],
    );

    const onValueChange = (c: string) => {
        setCode(c);
    };

    const highlight = (c: string) => (
        <Highlight
            {...defaultProps}
            theme={editorTheme}
            code={c}
            language={(store.getNote()?.fileType as Language) ?? 'markdown'}
        >
            {({ tokens, getLineProps, getTokenProps }) => (
                <>
                    {tokens.map((line, i) => (
                        <div
                            {...getLineProps({
                                line,
                                key: i,
                                className: styles.hightlightLine,
                            })}
                        >
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </>
            )}
        </Highlight>
    );

    return $currentView === 'Markdown' ? (
        <Suspense fallback={<Loader />}>
            <DynamicMarkdownRenderer content={store.getNote().content} />
        </Suspense>
    ) : (
        <PrismEditor
            value={code}
            onValueChange={onValueChange}
            highlight={highlight}
            style={editorTheme.plain}
            padding={25}
            className={styles.root}
            textareaClassName={styles.textbox}
            preClassName={styles.pre}
            maxLength={10000}
            tabSize={4}
            placeholder="Enter any text here"
            disabled={props.isNotEditable ?? store.localLock}
        />
    );
};

export default Editor;
