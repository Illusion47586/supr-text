import { Editor, Menu } from '@components';
import homeLayout, { HomePage } from '@components/home_layout';
import MarkDownRenderer from '@components/markdown';
import { MenuContextProvider } from '@components/menu/menu-context';
import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';

const API_URL = 'api/note?id=4aDsa';

const Home: HomePage = (props) => {
    return (
        <MenuContextProvider>
            <div>
                <Editor />
                <Menu />
            </div>
        </MenuContextProvider>
    );
};

Home.getLayout = homeLayout;

export default Home;
