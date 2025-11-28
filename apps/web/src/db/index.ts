import { useEnvironment } from 'src/lib/environment';
import { getDatabase } from 'drizzle-db';

const { serverEnv } = useEnvironment();

const db_url = `postgres://${serverEnv!.DB_USER}:${serverEnv!.DB_PASSWORD}@${serverEnv!.DB_HOST}:${serverEnv!.DB_PORT}/${serverEnv!.DB_NAME}`;

export const db = getDatabase(db_url);
