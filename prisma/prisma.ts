import { Prisma, PrismaClient } from '@prisma/client';
import logger from '@utils/loggers/server';
import { cryptr, encrypt } from '@utils/scripts/crypt';
import { decrypt } from '@utils/scripts/crypt-front';
import RandomString from 'randomstring';

const prisma = new PrismaClient();

const deleteExpired = async () => {
    const THREE_HOURS_IN_MS = 1.08e7;
    const limit = new Date().getMilliseconds() - THREE_HOURS_IN_MS;
    const date = new Date();
    date.setMilliseconds(limit);
    await prisma.note.deleteMany({
        where: {
            AND: [
                { userId: { equals: undefined } },
                {
                    OR: [
                        {
                            createdAt: {
                                lte: date,
                            },
                        },
                        {
                            remainingCalls: {
                                lte: 0,
                            },
                        },
                    ],
                },
            ],
        },
    });
};

prisma.$connect();

prisma.$use(async (params, next) => {
    if (params.model === Prisma.ModelName.Note) {
        if (params.action === 'create' || params.action === 'update') {
            const data = { ...params.args.data };

            if (params.action === 'create')
                data.code = RandomString.generate({
                    length: 5,
                    readable: true,
                    capitalization: 'lowercase',
                });

            if (data.content) {
                data.content = cryptr.encrypt(data.content);
            }

            if (data.password) {
                data.password = encrypt(decrypt(data.password));
            }
            if (data.limit_to_ip) data.limit_to_ip = encrypt(decrypt(data.limit_to_ip));

            // eslint-disable-next-line no-param-reassign
            params.args.data = data;
        }
    }

    return next(params);
});

prisma.$use(async (params, next) => {
    let result = await next(params);
    if ((params.model === Prisma.ModelName.Note && params.action) === 'findFirst') {
        const data = { ...result };
        if (data.content) {
            data.content = cryptr.decrypt(data.content);
        }
        result = data;
    }
    return result;
});

prisma.$use(async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();

    logger.info(`Query ${params.model}.${params.action} took ${after - before}ms`);

    return result;
});

export default prisma;
export { deleteExpired };
