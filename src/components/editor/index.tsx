/* eslint-disable react/jsx-key */
import { MenuContext } from '@components/menu/menu-context';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import React, { useContext, useState } from 'react';
import PrismEditor from 'react-simple-code-editor';
import { useDebounce, useEffectOnce } from 'react-use';
import useStore from 'store';

import editorTheme from './code_style';
import styles from './index.module.scss';

interface Props {
    isNotEditable?: boolean;
}

const Editor: React.FC<Props> = (props) => {
    const store = useStore();
    const [code, setCode] = useState<string>('');
    const [allowDebounce, setAllowDebounce] = useState(false);

    useEffectOnce(() => {
        if (store.getNote()?.content) setCode(store.getNote()?.content);
        setAllowDebounce(true);
    });

    const [, cancel] = useDebounce(
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
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
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

    return (
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
