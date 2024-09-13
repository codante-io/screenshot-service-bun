import {
  serial,
  varchar,
  mysqlTable,
  mysqlSchema,
  boolean,
  json,
  bigint,
  text,
} from 'drizzle-orm/mysql-core';

export const senators = mysqlTable('senators', {
  id: serial('id').primaryKey(),
  original_id: varchar('original_id', { length: 256 }),
  name: varchar('name', { length: 256 }),
  full_name: varchar('full_name', { length: 256 }),
  gender: varchar('gender', { length: 256 }),
  UF: varchar('UF', { length: 2 }),
  avatar_url: varchar('avatar_url', { length: 256 }),
  homepage: varchar('homepage', { length: 256 }),
  email: varchar('email', { length: 256 }),
  party: varchar('party', { length: 256 }),
  is_titular: boolean('is_titular'),
  is_active: boolean('is_active'),
});

export const expenses = mysqlTable('expenses', {
  id: serial('id').primaryKey(),
  senator_id: bigint('senator_id', { mode: 'bigint' }),
  party: varchar('party', { length: 256 }),
  uf: varchar('uf', { length: 2 }),
  original_id: varchar('original_id', { length: 256 }).unique(),
  date: varchar('date', { length: 256 }),
  expense_category: varchar('expense_category', { length: 256 }),
  amount: varchar('amount', { length: 256 }),
  description: text('description'),
  supplier: varchar('supplier', { length: 256 }),
  supplier_document: varchar('supplier_document', { length: 256 }),
});

export const summaries = mysqlTable('summaries', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 256 }),
  year: varchar('year', { length: 256 }),
  summary: json('summary'),
});
