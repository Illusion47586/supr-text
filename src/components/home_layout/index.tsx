import React, { ReactElement, ReactNode, useState } from 'react';
import { Toaster, ToastPosition } from 'react-hot-toast';
import { useEffectOnce } from 'react-use';

import { NextPage } from 'next/types';

import { Header } from '..';

import styles from './index.module.scss';

type Props = {
    children: ReactNode;
};

type ToastPositionType = {
    postion: ToastPosition;
    offset: {
        top?: number;
        bottom?: number;
    };
};

const toastPostionDesktop: ToastPositionType = {
    postion: 'bottom-center',
    offset: { bottom: 35 },
};

const toastPostionMobile: ToastPositionType = {
    postion: 'top-center',
    offset: { top: 35 },
};

const BaseLayout: React.FC<Props> = ({ children }) => {
    const [toastPosition, setToastPosition] = useState<ToastPositionType>(toastPostionMobile);

    useEffectOnce(() => {
        if (window && window.innerWidth > 800) setToastPosition(toastPostionDesktop);
        else setToastPosition(toastPostionMobile);
    });

    return (
        <div className={styles.page}>
            <Header />
            <Toaster
                position={toastPosition.postion}
                gutter={20}
                toastOptions={{ duration: 3000, className: 'toast' }}
                containerStyle={{
                    ...toastPosition.offset,
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
