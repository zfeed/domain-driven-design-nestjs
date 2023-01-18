import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as path from 'path';

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
    ),
    override: true
});

export * from './kafka.config';
export * from './mikro-orm.config';
export * from './swagger.config';
export * from './prometheus.config';
