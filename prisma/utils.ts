import { compare, cryptr } from '@utils/scripts/crypt';
import { decrypt } from '@utils/scripts/crypt-front';
import Cryptr from 'cryptr';

const authenticate = (data: any, security?: { password?: string; ip?: string }) => {
    try {
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
    updatedData.content = cryptr.decrypt(data.content);
    delete updatedData.password;
    delete updatedData.restriced;
    delete updatedData.User;
    delete updatedData.userId;
    delete updatedData.limitToIP;
    return updatedData;
};

export default { authenticate, purifyNoteWithoutOwner };
