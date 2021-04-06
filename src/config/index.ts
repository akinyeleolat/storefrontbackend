import dotenv from 'dotenv';

dotenv.config();


export default{
    development: {
        user: process.env.DEV_USER,
        host: process.env.DEV_HOST,
        port: Number(process.env.DEV_PORT),
        database: process.env.DEV_DATABASE,
        password: process.env.DEV_PASSWORD,
    },
    test: {
        user: process.env.TEST_USER,
        host: process.env.TEST_HOST,
        port: Number(process.env.TEST_PORT),
        database: process.env.TEST_DATABASE,
        password: process.env.TEST_PASSWORD,
    }
}

export const port = process.env.PORT ?? 5000;
export const secret = process.env.SECRET ?? '';
export const environment = process.env.NODE_ENV ?? 'development';
