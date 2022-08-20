import { compare } from '@utils/scripts/crypt';
import Cryptr from 'cryptr';

const authenticate = (data: any, security?: { password?: string; ip?: string }) => {
    try {
        const { decrypt } = new Cryptr(process.env.NEXT_PUBLIC_CONTENT_KEY!);

        const passwordDoesNotMatch =
            data.password &&
            data.password.length > 0 &&
            (!security ||
                !security.password ||
                !compare(decrypt(security.password), data.password));

        const ipDoesNotMatch =
            data.limit_to_ip &&
            data.limit_to_ip.length > 0 &&
            (!security || !security.ip || !compare(decrypt(security.ip), data.limit_to_ip));

        if (passwordDoesNotMatch || ipDoesNotMatch) return false;
        return true;
    } catch (error) {
        return false;
    }
};

const purifyNoteWithoutOwner = (data: any) => {
    const updatedData = { ...data };
    delete updatedData.password;
    delete updatedData.id;
    delete updatedData.restriced;
    delete updatedData.User;
    delete updatedData.userId;
    delete updatedData.limitToIP;
    return updatedData;
};

export default { authenticate, purifyNoteWithoutOwner };
