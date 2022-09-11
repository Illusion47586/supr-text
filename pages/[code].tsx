/* eslint-disable jsx-a11y/label-has-associated-control */
import { Loader, Menu } from '@components';
import homeLayout, { HomePage } from '@components/home_layout';
import { api } from '@services';
import { useNoteStore } from '@state';
import styles from '@styles/pages/note_fetch.module.scss';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { Suspense, useEffect, useState } from 'react';
import { baseMotionSettings } from 'src/utils/base_motion_settings';

const DynamicEditor = dynamic(
    () => {
        return import('@components/editor');
    },
    { loading: () => <Loader /> },
);

const Note: HomePage = () => {
    const router = useRouter();
    const { code, nokey } = router.query;
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
        if (nokey === 'true') fetchNote(code as string);
        if (code) setValues({ code: code as string, password: '' });
    }, [code, nokey]);

    return note ? (
        <motion.div {...baseMotionSettings}>
            <Suspense fallback={<Loader />}>
                <DynamicEditor isNotEditable={store.localLock} />
            </Suspense>
            <Menu />
        </motion.div>
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
    );
};

Note.getLayout = homeLayout;

export default Note;
