import { Pool } from 'pg';
import keys from '../config/keys.js';

const pool = new Pool({
  user: keys.PG_CONNECTION.USER,
  host: keys.PG_CONNECTION.HOST,
  database: keys.PG_CONNECTION.DATABASE,
  password: keys.PG_CONNECTION.PASSWORD,
  port: keys.PG_CONNECTION.PORT,
});

export default pool;
