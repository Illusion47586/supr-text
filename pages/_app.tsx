import '@styles/global.scss';

import { KeyBindingContextProvider } from '@state';
import { enableMapSet } from 'immer';
import { AppProps } from 'next/app';
import { NextPage } from 'next/types';
import { DefaultSeo } from 'next-seo';
import React, { ReactElement } from 'react';

enableMapSet();

type NextPageWithLayout = NextPage & {
    getLayout?: (page: JSX.Element) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(
        <KeyBindingContextProvider>
            <DefaultSeo
                title="Supr-Text"
                defaultTitle="Supr-Text"
                description="A simple safe note sharing application"
                openGraph={{
                    type: 'webapp',
                    url: process.env.NEXT_PUBLIC_VERCEL_URL,
                    site_name: 'Supr-Text',
                    description: 'A simple safe note sharing application',
                }}
                twitter={{
                    cardType: 'app',
                }}
            />
            <Component {...pageProps} />
        </KeyBindingContextProvider>,
    );
}

export default MyApp;
