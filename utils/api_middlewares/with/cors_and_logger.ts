import { label } from 'next-api-middleware';

import cors from '../middleware/cors';
import logger from '../middleware/logger';

const withCorsAndLoggerMiddleware = label({ cors, logger }, ['logger']);

export default withCorsAndLoggerMiddleware;
