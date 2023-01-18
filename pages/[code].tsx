/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Suspense, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

import dynamic from 'next/dynamic';
import { NextSeo } from 'next-seo';

import { Loader, Menu } from '@components';
import homeLayout, { HomePage } from '@components/home_layout';

import styles from '@styles/pages/note_fetch.module.scss';

import { api } from '@services';

import { KeyBindingContextProvider, useNoteStore } from '@state';

import { baseMotionSettings } from '@fe-utils/base_motion_settings';

const DynamicEditor = dynamic(
    () => {
        return import('@components/editor');
    },
    { loading: () => <Loader /> },
);

type Props = {
    code?: string;
    noKey: boolean;
};

const Note: HomePage<Props> = ({ code, noKey }: Props) => {
    console.log(code, noKey);
    const store = useNoteStore();

    const [note, setNote] = useState<Note | undefined>(undefined);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const fetchNote = async (_code: string, _password?: string) => {
        setIsLoading(true);
        try {
            const response = await api.getNote(_code, _password);
            if (response.status === 200) {
                const { data } = response;
                if (data.encryptContentWhileSending) {
                    const { decrypt } = await import('@utils/scripts/crypt-front');
                    data.content = decrypt(data.content);
                }
                data.password = _password;
                store.changeNote(data);
                setNote(data);
            } else {
                setError(response.data.error);
            }
        } catch (_error: { message: string } & any) {
            setError(_error.message ?? _error);
        } finally {
            setIsLoading(false);
        }
    };

    const { handleSubmit, handleBlur, handleChange, values, setValues } = useFormik({
        initialValues: { code: '', password: '' },
        onSubmit: (_values) => {
            setTimeout(async () => {
                await fetchNote(_values.code, _values.password);
            }, 300);
        },
    });

    useEffect(() => {
        if (code) {
            if (noKey) fetchNote(code);
            setValues({ code, password: '' });
        }
    }, [code, noKey]);

    const title = store.getNote().title ?? store.getNote().code ?? store.current ?? code;

    return (
        <>
            <NextSeo
                key="seo-overwrite"
                title={`${title ? `${title} | ` : ''}Supr-Text`}
                openGraph={{
                    images: [
                        {
                            url: `${process.env.NEXT_PUBLIC_URL}/api/og?code=${code}`,
                            secureUrl: `${process.env.NEXT_PUBLIC_URL}/api/og?code=${code}`,
                        },
                    ],
                }}
            />
            {note ? (
                <KeyBindingContextProvider>
                    <motion.div {...baseMotionSettings}>
                        <Suspense fallback={<Loader />}>
                            <DynamicEditor isNotEditable={store.localLock} />
                        </Suspense>
                        <Menu />
                    </motion.div>
                </KeyBindingContextProvider>
            ) : (
                <div className={styles.box}>
                    {isLoading && !error ? (
                        <div className={styles.loader}>
                            <Loader />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} {...baseMotionSettings}>
                            <label htmlFor="code">Code (Required)</label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                placeholder={values.code}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.code}
                                maxLength={5}
                                required
                            />
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Leave blank if not needed"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                            {error && <p>{error}</p>}
                            <button type="submit">
                                <span>Submit</span>
                            </button>
                        </form>
                    )}
                </div>
            )}
        </>
    );
};

Note.getLayout = homeLayout;

Note.getInitialProps = ({ query }) => {
    const { code, nokey } = query;
    const noKey = nokey === 'true';
    return { code: code as string, noKey };
};

export default Note;
