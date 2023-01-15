import React from 'react';

import { Menu } from '@components';
import Editor from '@components/editor';
import homeLayout, { HomePage } from '@components/home_layout';

import { KeyBindingContextProvider } from '@state';

const Home: HomePage = () => {
    return (
        <KeyBindingContextProvider>
            <Editor />
            <Menu />
        </KeyBindingContextProvider>
    );
};

Home.getLayout = homeLayout;

export default Home;
