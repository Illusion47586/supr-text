import Cryptr from 'cryptr';

const { encrypt, decrypt } = new Cryptr(process.env.NEXT_PUBLIC_CONTENT_KEY!);

export { decrypt, encrypt };
