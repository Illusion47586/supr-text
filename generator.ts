import Cryptr from 'cryptr';
import RandomString from 'randomstring';

const getRandomText = () =>
    RandomString.generate({
        length: 5,
        readable: true,
        capitalization: 'lowercase',
        charset: 'alphabetic',
    });

const generateCryptoVersion = (key = getRandomText()) => {
    console.log('KEY');
    console.log(key);
    console.log();

    const frontCryptr = new Cryptr(process.env.NEXT_PUBLIC_CONTENT_KEY!);
    const fe = frontCryptr.encrypt(key);
    console.log('FRONTEND ONLY CRYPT');
    console.log(fe);
    console.log();

    const serverCryptr = new Cryptr(process.env.CONTENT_KEY!);
    const se = serverCryptr.encrypt(key);
    console.log('SERVER ONLY CRYPT');
    console.log(se);
    console.log();

    const fse = serverCryptr.encrypt(fe);
    console.log('FRONTEND + SERVER CRYPT');
    console.log(fse);
};

const keygen = () => {
    const FE_CONTENT_KEY = RandomString.generate({
        length: 16,
        capitalization: 'uppercase',
        charset: 'alphanumeric',
    });

    const BE_CONTENT_KEY = RandomString.generate({
        length: 16,
        capitalization: 'uppercase',
        charset: 'alphanumeric',
    });

    console.log('HERE ARE RANDOMLY GENERATED KEYS');
    console.table({
        FE_CONTENT_KEY: { 'ENV VAR': 'NEXT_PUBLIC_CONTENT_KEY', KEY: FE_CONTENT_KEY },
        BE_CONTENT_KEY: { 'ENV VAR': 'CONTENT_KEY', KEY: BE_CONTENT_KEY },
    });
};

if (process.argv[2] === 'keygen') keygen();
else if (process.argv[2] === 'cryptogen') {
    if (process.argv[3]) generateCryptoVersion(process.argv[3]);
    else generateCryptoVersion();
}
