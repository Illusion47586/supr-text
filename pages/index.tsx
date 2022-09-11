import { Menu } from '@components';
import Editor from '@components/editor';
import homeLayout, { HomePage } from '@components/home_layout';
import React from 'react';

const Home: HomePage = (props) => {
    return (
        <>
            <Editor />
            <Menu />
        </>
    );
};

Home.getLayout = homeLayout;

export default Home;
