import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  user: process.env.DATABASE_USER_SENATOR_EXPENSES,
  password: process.env.DATABASE_PASSWORD_SENATOR_EXPENSES,
  database: process.env.DATABASE_SENATOR_EXPENSES,
});

const db = drizzle(connection, { schema, mode: 'default' });

export { db, connection };
