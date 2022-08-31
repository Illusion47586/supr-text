/* eslint-disable jsx-a11y/label-has-associated-control */
import { ApplicationState, useNoteStore } from '@state';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { Check } from 'phosphor-react';
import { defaultProps, Language } from 'prism-react-renderer';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useClickAway, useKey } from 'react-use';
import { baseMotionSettings } from 'src/utils/base_motion_settings';

import styles from './index.module.scss';

interface ExtendedFormValues {
    title?: string;
    password?: string;
    fileType?: string;
    encryptContentWhileSending?: boolean;
    immutable?: boolean;
}

const Extended = () => {
    const store = useNoteStore();
    const ref = useRef(null);

    const closeExtended = () => {
        ApplicationState.isExtendedMenuVisible.set(false);
    };

    useClickAway(ref, (e: { target?: { tagName?: string; id?: string } } & any) => {
        if (!(e.target?.tagName === 'svg' || e.target?.id === 'open-config')) closeExtended();
    });

    const initialValues: ExtendedFormValues = {
        encryptContentWhileSending: store.getNote()?.encryptContentWhileSending ?? false,
        immutable: store.getNote()?.immutable ?? false,
        fileType: store.getNote()?.fileType ?? 'text',
        title: store.getNote()?.title ?? '',
        password: store.getNote()?.password ?? '',
    };

    const { handleSubmit, handleBlur, handleChange, values, submitForm } = useFormik({
        initialValues,
        validate: (_values) => {
            const _errors: { password?: string } = {};
            if (_values.password && _values.password.length < 5) {
                _errors.password = 'Minimum length 5 required';
                toast.error('Password should be minimum 5 characters long!', { id: 'pass_len' });
            }
            return _errors;
        },
        onSubmit: (_values, { setSubmitting }) => {
            setTimeout(() => {
                store.updateNote(_values);
                toast.success('Config updated!');
                closeExtended();
                setSubmitting(false);
            }, 300);
        },
    });

    useKey((key) => key.key === 'Escape', closeExtended);
    useKey((key) => key.key === ' ' && key.ctrlKey, submitForm);

    return (
        <motion.div className={styles.extended} {...baseMotionSettings} layout ref={ref}>
            <motion.div className={styles.indicator} {...baseMotionSettings}>
                <p>Scroll to bottom to save or press Ctrl+{'<SpaceBar>'}.</p>
                <p>Press Esc to exit this menu.</p>
            </motion.div>
            <motion.form onSubmit={handleSubmit} {...baseMotionSettings}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                />
                {store.current === 'local' && (
                    <>
                        <label htmlFor="password">
                            Password (Applied after sending config to server)
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter top secret pa$$w0rD"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            minLength={5}
                        />
                    </>
                )}
                <label htmlFor="fileType">Enter file type</label>
                <select
                    name="fileType"
                    id="fileType"
                    defaultValue={values.fileType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    {Object.keys(defaultProps.Prism.languages)
                        .filter(
                            (lang) =>
                                typeof defaultProps.Prism.languages[lang as Language] === 'object',
                        )
                        .sort()
                        .map((lang) => (
                            <option value={lang} key={lang}>
                                {lang}
                            </option>
                        ))}
                </select>
                <label>
                    <span>Immutable, no edits allowed once sent to the server.</span>
                    <input
                        type="checkbox"
                        name="immutable"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.immutable}
                    />
                </label>
                <label>
                    <span>
                        End-to-end encryption, consumes more resources as it happens in the browser.
                    </span>
                    <input
                        type="checkbox"
                        id="encryptContentWhileSending"
                        name="encryptContentWhileSending"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.encryptContentWhileSending}
                    />
                </label>
                <button type="submit">
                    <span>Save</span>
                    <Check className={styles.icon} weight="bold" />
                </button>
            </motion.form>
        </motion.div>
    );
};

export default Extended;
