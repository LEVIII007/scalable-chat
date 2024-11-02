import {Redis} from 'iovalkey';
import dotenv from 'dotenv';
dotenv.config();


const redisHost = process.env.REDIS_URI;
if (!redisHost) {
    throw new Error('REDIS_HOST environment variable is not defined');
}

export const pub = new Redis(redisHost);
export const sub = new Redis(redisHost);
