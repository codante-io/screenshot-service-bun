import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

declare global {
  var _db: ReturnType<typeof drizzle> | undefined;
}

const poolConnection = mysql.createPool({
  user: process.env.DATABASE_USER_SENATOR_EXPENSES,
  password: process.env.DATABASE_PASSWORD_SENATOR_EXPENSES,
  database: process.env.DATABASE_SENATOR_EXPENSES,
});

const db = globalThis._db || drizzle(poolConnection);

if (process.env.NODE_ENV !== 'production') {
  globalThis._db = db;
}

export { db, poolConnection };
