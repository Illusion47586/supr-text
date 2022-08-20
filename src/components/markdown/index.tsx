import useStore from '@store';
import Markdown from 'marked-react';
import React, { useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';

const MarkDownRenderer = () => {
    const store = useStore();
    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(store.getNote().content);
    }, [store.getNote().content]);

    return <Markdown gfm>{content}</Markdown>;
};

export default MarkDownRenderer;
