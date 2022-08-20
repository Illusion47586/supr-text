import bcrypt from 'bcrypt';
import Cryptr from 'cryptr';

const NUMBER_OF_SALT_ROUNDS = 10;

const encrypt = (text: string) => {
    const salt = bcrypt.genSaltSync(NUMBER_OF_SALT_ROUNDS);
    return bcrypt.hashSync(text, salt);
};

/**
 * Compares two values
 * @param text value to be checked
 * @param hash original value
 * @returns boolean
 */
const compare = (text: string, hash: string) => bcrypt.compareSync(text, hash);

const cryptr = new Cryptr(process.env.CONTENT_KEY!);

export { compare, cryptr, encrypt };
