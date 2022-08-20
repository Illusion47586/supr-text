import { Middleware } from 'next-api-middleware';
import NextCors from 'nextjs-cors';

const corsMiddleWare: Middleware = async (req, res, next) => {
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
    });
    next();
};

export default corsMiddleWare;
