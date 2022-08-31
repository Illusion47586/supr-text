/* eslint-disable react/jsx-key */
import editorTheme from '@components/editor/code_style';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import React from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import styles from './index.module.scss';

const ReactMarkdownOptions: Partial<Options> = {
    remarkPlugins: [remarkGfm],
    components: {
        table(props) {
            return <table {...props} className={styles.table} />;
        },
        html(props) {
            console.log(props);
            return <div />;
        },
        img(props) {
            // eslint-disable-next-line jsx-a11y/alt-text
            return <img {...props} />;
        },
        a(props) {
            // eslint-disable-next-line jsx-a11y/anchor-has-content
            return <a {...props} />;
        },
        code(props) {
            const lang = props.className?.replace('language-', '') as Language;
            return props.inline === true ? (
                <code className={props.className} {...props}>
                    {props.children}
                </code>
            ) : (
                <Highlight
                    {...defaultProps}
                    key="Render"
                    theme={editorTheme}
                    code={String(props.children).replace(/\n$/, '')}
                    language={lang ?? 'markdown'}
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
        },
    },
};

interface MarkDownRendererProps {
    content: string;
}

const MarkDownRenderer = (props: MarkDownRendererProps) => {
    return (
        <ReactMarkdown {...ReactMarkdownOptions} className={styles.renderer}>
            {props.content}
        </ReactMarkdown>
    );
};

export default MarkDownRenderer;
