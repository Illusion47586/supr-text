import { Middleware } from 'next-api-middleware';

import logger from '../../loggers/server';

const loggerMiddleware: Middleware = async (req, res, next) => {
    logger.info(`${req.method} ${req?.url}`);
    return next();
};

export default loggerMiddleware;
