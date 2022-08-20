import '@styles/global.scss';

import { enableMapSet } from 'immer';
import { AppProps } from 'next/app';
import { NextPage } from 'next/types';
import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

enableMapSet();

type NextPageWithLayout = NextPage & {
    getLayout?: (page: JSX.Element) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
    const queryClient = new QueryClient();
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout(
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <Component {...pageProps} />
            </Hydrate>
        </QueryClientProvider>,
    );
}

export default MyApp;
