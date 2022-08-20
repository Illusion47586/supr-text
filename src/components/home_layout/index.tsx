import { MenuContextProvider } from '@components/menu/menu-context';
import { NextPage } from 'next/types';
import React, { ReactElement, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { Header } from '..';
import styles from './index.module.scss';

type Props = {
    children: ReactNode;
};

const BaseLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className={styles.page}>
            <Header />
            <Toaster
                position="bottom-center"
                gutter={20}
                toastOptions={{ duration: 3000, className: 'toast' }}
                containerStyle={{
                    bottom: 35,
                }}
            />
            <main>{children}</main>
        </div>
    );
};

type HomePage = NextPage & {
    getLayout?: (page: JSX.Element) => ReactElement;
};

const homeLayout = (page: JSX.Element) => <BaseLayout>{page}</BaseLayout>;

export default homeLayout;
export type { HomePage };
