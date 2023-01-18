import React from 'react';

import { Menu } from '@components';
import Editor from '@components/editor';
import homeLayout, { HomePage } from '@components/home_layout';

const Home: HomePage = () => {
    return (
        <>
            <Editor />
            <Menu />
        </>
    );
};

Home.getLayout = homeLayout;

export default Home;
