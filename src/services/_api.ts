import toast from 'react-hot-toast';
import axios$1 from 'axios';

const axios = axios$1.create({
    validateStatus(status) {
        return status < 500;
    },
});

axios.interceptors.request.use(async (req) => {
    const { data } = req;
    if (data && (data.encryptContentWhileSending || data.password)) {
        const { encrypt } = await import('@utils/scripts/crypt-front');
        if (data.encryptContentWhileSending) {
            data.content = encrypt(data.content!);
        }
        if (data.password) data.password = encrypt(data.password);
    }
    req.data = data;
    console.log(data);
    return req;
});

axios.interceptors.response.use((response) => {
    if (response.data && response.data.error) {
        toast.error(response.data.error);
        Promise.reject(response.data.error);
    }
    return response;
});

const getNote = async (code: string, password?: string) => {
    const params: { id: string; password?: string } = { id: code };
    if (password) {
        const { encrypt } = await import('@utils/scripts/crypt-front');
        params.password = encrypt(password);
    }
    return axios.get('/api/note', { params });
};

const uploadNote = (data: Partial<Note>) => {
    return axios.post('/api/note', data);
};

const updateNote = (code: string, note: Partial<Note>) => {
    return axios.patch('/api/note', note, { params: { id: code } });
};

export default { getNote, uploadNote, updateNote };
