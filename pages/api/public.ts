import prisma, { deleteExpired } from '@prisma/prisma';
import prismaUtils from '@prisma/utils';
import withCorsAndLoggerMiddleware from '@utils/api_middlewares/with/cors_and_logger';
import GenericError from '@utils/errors/generic_error';
import NoteError from '@utils/errors/note_error';
import logger from '@utils/loggers/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withCorsAndLoggerMiddleware('cors')(async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        if (req.method && req.method === 'GET') {
            await deleteExpired();
            if (!req.query.id) throw new Error('Note Id not passed as query');
            const _id = req.query.id as string;
            const response = await prisma.note.findFirst({
                where: { code: _id },
            });
            if (!response || !response.code)
                return res.status(404).json({
                    error: `Note ${_id} not found.`,
                });
            if (
                !prismaUtils.authenticate(response, {
                    password: req.body.password as string,
                    ip: req.body.ip as string,
                })
            )
                return res.status(401).json({
                    error: `Note ${_id} requires a different password or is locked to a different IP.`,
                });

            const final = await prisma.note.update({
                where: { code: _id },
                select: {
                    content: true,
                },
                data: { remainingCalls: { decrement: 1 } },
            });

            return res.status(200).json(final.content);
        }
        return res.status(400).json({ error: 'Invalid method' });
    } catch (error: { message: string } | any) {
        logger.error(error);
        if (error instanceof GenericError) return res.status(error.code).send(error.message);
        return res.status(500).send(error.message);
    }
});
