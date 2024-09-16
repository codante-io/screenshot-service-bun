import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const poolConnection = mysql.createPool({
  user: process.env.DATABASE_USER_SENATOR_EXPENSES,
  password: process.env.DATABASE_PASSWORD_SENATOR_EXPENSES,
  database: process.env.DATABASE_SENATOR_EXPENSES,
});

const db = drizzle(poolConnection, { schema, mode: 'default' });

export { db, poolConnection };
