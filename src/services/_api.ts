import { encrypt } from '@utils/scripts/crypt-front';
import axios$1 from 'axios';
import toast from 'react-hot-toast';

const axios = axios$1.create({
    validateStatus(status) {
        return status < 500;
    },
});

axios.interceptors.request.use((req) => {
    const { data } = req;
    toast.loading('Encrypting...', { id: 'encrypt' });
    if (data && data.encryptContentWhileSending) {
        data.content = encrypt(data.content!);
    }
    if (data.password && data.length > 0) data.password = encrypt(data.password!);
    else delete data.password;
    req.data = data;
    toast.remove('encrypt');
    return req;
});

axios.interceptors.response.use((response) => {
    console.log(response);
    if (response.data && response.data.error) {
        toast.error(response.data.error);
        Promise.reject(response.data.error);
    }
    return response;
});

const getNote = (code: string, password?: string) => {
    const data = password ? { password: encrypt(password) } : undefined;
    return axios.get('/api', { params: { id: code }, data });
};

const uploadNote = (data: Partial<Note>) => {
    return axios.post('/api', data);
};

const updateNote = (code: string, note: Partial<Note>) => {
    return axios.patch('/api', note, { params: { id: code } });
};

export default { getNote, uploadNote, updateNote };
