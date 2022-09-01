import { Menu } from '@components';
import Editor from '@components/editor';
import homeLayout, { HomePage } from '@components/home_layout';
import { KeyBindingContextProvider } from '@state';
import React from 'react';

const Home: HomePage = (props) => {
    return (
        <KeyBindingContextProvider>
            <Editor />
            <Menu />
        </KeyBindingContextProvider>
    );
};

Home.getLayout = homeLayout;

export default Home;
