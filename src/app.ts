import bodyParser from 'body-parser';
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import db from './db/connect';
import routes from './routes';
import { logger } from './utils/logger';
import { timeMiddleware } from './middlewares';
import { environment } from './config';
import { NotFoundError, ApiError, InternalError } from './utils/ApiError';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
db.connect()
    .then(() => logger.info('connected to db'))
    .catch((error: any) => {
        logger.error('Unable to connect to the database:', error);
    });

const app: Application = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '5m' }));
app.use(timeMiddleware);

app.use('/api', routes);

app.all('/', (req, res) => {
    res.json('welcome').status(200);
});

app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        ApiError.handle(err, res);
    } else {
        if (environment === 'development') {
            logger.error(err);
            return res.status(500).send(err.message);
        }
        ApiError.handle(new InternalError(), res);
    }
});

export default app;
// }
