import { and, eq, like, sum } from 'drizzle-orm';
import { db } from '../db/db';
import { expenses, summaries } from '../db/schema';

export async function updateUFSummary(year: number) {
  console.log('pegando todos as UFs');

  const data = await db
    .select({
      uf: expenses.uf,
      total: sum(expenses.amount),
    })
    .from(expenses)
    .where(like(expenses.date, `${year}%`))
    .groupBy(expenses.uf);
  // get unique parties from the expenses table

  await db
    .delete(summaries)
    .where(and(eq(summaries.year, year.toString()), eq(summaries.type, 'uf')));

  await db.insert(summaries).values({
    type: 'uf',
    year: year.toString(),
    summary: data,
  });
}
