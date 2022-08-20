/* eslint-disable jsx-a11y/label-has-associated-control */
import { Editor, Menu } from '@components';
import homeLayout, { HomePage } from '@components/home_layout';
import Loader from '@components/loader';
import MarkDownRenderer from '@components/markdown';
import { MenuContextProvider } from '@components/menu/menu-context';
import { api } from '@services';
import useStore from '@store';
import styles from '@styles/pages/note_fetch.module.scss';
import { decrypt, encrypt } from '@utils/scripts/crypt-front';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useEffectOnce } from 'react-use';
import { baseMotionSettings } from 'src/utils/base_motion_settings';

const API_URL = 'api/note?id=';

const Note: HomePage = () => {
    const router = useRouter();
    const { code, nokey } = router.query;
    const store = useStore();

    const [note, setNote] = useState<Note | undefined>(undefined);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const fetchNote = async (_code: string, password?: string) => {
        setIsLoading(true);
        try {
            const response = await api.getNote(_code, password);
            if (response.status === 200) {
                const { data } = response;
                if (data.encryptContentWhileSending) data.content = decrypt(data.content);
                data.password = password;
                store.changeNote(data);
                setNote(data);
            } else {
                setError(response.data.message);
            }
        } catch (_error: { message: string } & any) {
            setError(_error.message ?? _error);
        }
        setIsLoading(false);
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
        <MenuContextProvider>
            <div>
                {note.fileType === 'markdown' ? (
                    <MarkDownRenderer />
                ) : (
                    <>
                        <Editor isNotEditable={store.localLock} />
                        <Menu />
                    </>
                )}
            </div>
        </MenuContextProvider>
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
