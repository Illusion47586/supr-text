import { encrypt } from '@utils/scripts/crypt-front';
import axios$1 from 'axios';
import toast from 'react-hot-toast';

const axios = axios$1.create({
    validateStatus(status) {
        return status < 500;
    },
});

axios.interceptors.request.use(async (req) => {
    // console.log(req.url);
    const { data } = req;
    if (data) {
        // const id = toast.loading('Encrypting...');
        if (data.encryptContentWhileSending) {
            data.content = encrypt(data.content!);
        }
        if (data.password) data.password = encrypt(data.password);
        // toast.dismiss(id);
    }
    req.data = data;
    // console.log(data);
    return req;
});

axios.interceptors.response.use((response) => {
    // console.log(response);
    if (response.data && response.data.error) {
        toast.error(response.data.error);
        Promise.reject(response.data.error);
    }
    return response;
});

const getNote = async (code: string, password?: string) => {
    const params: { id: string; password?: string } = { id: code };
    if (password) params.password = encrypt(password);
    return axios.get('/api/note', { params });
};

const uploadNote = (data: Partial<Note>) => {
    return axios.post('/api/note', data);
};

const updateNote = (code: string, note: Partial<Note>) => {
    return axios.patch('/api/note', note, { params: { id: code } });
};

export default { getNote, uploadNote, updateNote };
