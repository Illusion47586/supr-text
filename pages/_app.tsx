import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { enableMapSet } from 'immer';

import { AppProps } from 'next/app';
import { NextPage } from 'next/types';
import { DefaultSeo } from 'next-seo';

import '@styles/global.scss';

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
                <DefaultSeo
                    title="Supr-Text"
                    defaultTitle="Supr-Text"
                    description="A simple safe note sharing application"
                    openGraph={{
                        type: 'webapp',
                        url: process.env.NEXT_PUBLIC_URL,
                        site_name: 'Supr-Text',
                        description: 'A simple safe note sharing application',
                        images: [
                            {
                                url: `${process.env.NEXT_PUBLIC_URL}/api/og`,
                                secureUrl: `${process.env.NEXT_PUBLIC_URL}/api/og`,
                            },
                        ],
                    }}
                    twitter={{
                        cardType: 'app',
                    }}
                />
                <Component {...pageProps} />
            </Hydrate>
        </QueryClientProvider>,
    );
}

export default MyApp;
