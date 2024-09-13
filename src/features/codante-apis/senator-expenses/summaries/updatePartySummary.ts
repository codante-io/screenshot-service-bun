import { and, eq, like, sum } from 'drizzle-orm';
import { db } from '../db/db';
import { expenses, summaries } from '../db/schema';

export async function updatePartySummary(year: number) {
  console.log('pegando todos os partidos...');

  const result = await db
    .selectDistinct({ party: expenses.party, senator_id: expenses.senator_id })
    .from(expenses)
    .where(like(expenses.date, `${year}%`))
    .groupBy(expenses.party, expenses.senator_id);
  // get unique parties from the expenses table

  const groupedByParty = result.reduce((acc, item) => {
    const { party, senator_id } = item;
    if (!acc[party]) {
      acc[party] = [];
    }
    acc[party].push(String(senator_id));
    return acc;
  }, {});

  // console.log(groupedByParty);

  // pegando a soma dos gastos por partido

  const expensesByParty = await db
    .select({
      party: expenses.party,
      total: sum(expenses.amount),
    })
    .from(expenses)
    .where(like(expenses.date, `${year}%`))
    .groupBy(expenses.party);

  const sanitized = expensesByParty.map((row) => {
    return {
      party: row.party,
      total_expenses: row.total,
      total_per_senator: row.total / groupedByParty[row.party].length,
      senator_ids: groupedByParty[row.party],
    };
  });

  await db
    .delete(summaries)
    .where(
      and(eq(summaries.year, year.toString()), eq(summaries.type, 'party'))
    );

  await db.insert(summaries).values({
    type: 'party',
    year: year.toString(),
    summary: sanitized,
  });
}
