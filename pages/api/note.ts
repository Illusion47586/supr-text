import prisma, { deleteExpired } from '@prisma/prisma';
import prismaUtils from '@prisma/utils';
import GenericError from '@utils/errors/generic_error';
import logger from '@utils/loggers/server';
import { cryptr } from '@utils/scripts/crypt';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method && req.method === 'POST') {
            if (!req.body || !req.body.content)
                return res.status(400).json({ error: 'No content received' });
            if (req.body.immutable === true && !req.body.password && !req.body.limitToIP)
                return res
                    .status(400)
                    .json({ error: 'Mutables notes need to have a password or IP restriction' });
            if (req.body.remainingCalls && req.body.remainingCalls > 5)
                return res.status(400).json({ error: 'Free notes cannot have more than 5 views' });
            const response = await prisma.note.create({ data: req.body });
            return res.status(201).json(prismaUtils.purifyNoteWithoutOwner(response));
        }
        if (req.method && req.method === 'DELETE') {
            if (!req.query.id) return res.status(400).json({ error: 'No ID received' });
            const response = await prisma.note.delete({ where: { code: req.query.id as string } });
            return res.status(200).json(prismaUtils.purifyNoteWithoutOwner(response));
        }
        if (req.method && req.method === 'PATCH') {
            if (!req.query.id) return res.status(400).json({ error: 'No ID received' });
            const note = await prisma.note.findFirst({
                select: { immutable: true, password: true, limitToIP: true },
                where: { code: req.query.id as string },
            });
            if (!note)
                return res.status(404).json({
                    error: `Note ${req.query.id} not found.`,
                });
            if (note.immutable) {
                return res.status(400).json({ error: 'Note is immutable.' });
            }
            if (
                !prismaUtils.authenticate(note, {
                    password: req.body.password as string,
                    ip: req.body.ip as string,
                })
            )
                return res.status(401).json({
                    error: 'Incorrect Auth details.',
                });
            const final = await prisma.note.update({
                where: { code: req.query.id as string },
                select: {
                    code: true,
                    content: true,
                    createdAt: true,
                    encryptContentWhileSending: true,
                    fileType: true,
                    remainingCalls: true,
                    showCreater: true,
                    title: true,
                    immutable: true,
                },
                data: req.body,
            });
            final.content = cryptr.decrypt(final.content);
            return res.status(200).json(final);
        }
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
            // console.log(req.query);
            if (
                !prismaUtils.authenticate(response, {
                    password: req.query.password as string,
                    ip: req.query.ip as string,
                })
            )
                return res.status(401).json({
                    error: `Note ${_id} requires a different password or is locked to a different IP.`,
                });

            const final = await prisma.note.update({
                where: { code: _id },
                select: {
                    code: true,
                    content: true,
                    createdAt: true,
                    encryptContentWhileSending: true,
                    fileType: true,
                    remainingCalls: true,
                    showCreater: true,
                    title: true,
                    immutable: true,
                },
                data: { remainingCalls: { decrement: 1 } },
            });

            final.content = cryptr.decrypt(final.content);

            return res.status(200).json(final);
        }
        return res.status(400).json({ error: 'Invalid method' });
    } catch (error: { message: string } | any) {
        logger.error(error);
        if (error instanceof GenericError) return res.status(error.code).send(error.message);
        return res.status(500).send(error.message);
    }
}
