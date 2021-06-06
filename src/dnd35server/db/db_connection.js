import { Pool } from 'pg';
import keys from '../config/keys.js';

let pool;
if (process.env.NODE_ENV == 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    user: keys.PG_CONNECTION.USER,
    host: keys.PG_CONNECTION.HOST,
    database: keys.PG_CONNECTION.DATABASE,
    password: keys.PG_CONNECTION.PASSWORD,
    port: keys.PG_CONNECTION.PORT,
  });
}

export default pool;
