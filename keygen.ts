import Cryptr from 'cryptr';

const frontCryptr = new Cryptr(process.env.NEXT_PUBLIC_CONTENT_KEY!);
const serverCryptr = new Cryptr(process.env.CONTENT_KEY!);

const keygen = (key: string) => {
    const fe = frontCryptr.encrypt(key);
    console.log('FRONTEND ONLY CRYPT');
    console.log(fe);
    console.log();
    const se = serverCryptr.encrypt(key);
    console.log('SERVER ONLY CRYPT');
    console.log(se);
    console.log();
    const fse = serverCryptr.encrypt(fe);
    console.log('FRONTEND + SERVER CRYPT');
    console.log(fse);
};

keygen(process.argv[2]);
