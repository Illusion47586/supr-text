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
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { baseMotionSettings } from 'src/utils/base_motion_settings';

const API_URL = 'api/note?id=';

interface AuthInput {
    password?: string;
}

const Note: HomePage = () => {
    const router = useRouter();
    const { code } = router.query;
    const store = useStore();

    const [note, setNote] = useState<Note | undefined>(undefined);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const fetchNote = async (password?: string) => {
        setIsLoading(true);
        try {
            const res = api.getNote(code as string, password);
            // toast.promise(res, { loading: 'Loading', success: 'Fetched!', error: (e) => e });
            const response = await res;
            if (response.status === 200) {
                const { data } = response;
                if (data.encryptContentWhileSending) data.content = decrypt(data.content);
                console.log(data);
                store.changeNote(response.data);
                setNote(response.data);
            } else {
                setError(response.data.message);
            }
        } catch (_error: { message: string } & any) {
            setError(_error.message ?? _error);
        }
        setIsLoading(false);
    };

    const initialValues: AuthInput = { password: '' };

    const { handleSubmit, handleBlur, handleChange, values } = useFormik({
        initialValues,
        onSubmit: (_values, { setSubmitting }) => {
            setTimeout(async () => {
                await fetchNote(_values.password);
            }, 300);
        },
    });

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
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="password">
                        Password (This note may or may not require a password)
                    </label>
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
