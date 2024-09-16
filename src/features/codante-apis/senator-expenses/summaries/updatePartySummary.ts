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

  const groupedByParty: Record<string, string[]> = {};

  result.forEach((item) => {
    const { party, senator_id } = item;
    if (party) {
      if (!groupedByParty[party]) {
        groupedByParty[party] = [];
      }
      groupedByParty[party].push(String(senator_id));
    }
  });

  const expensesByParty = await db
    .select({
      party: expenses.party,
      total: sum(expenses.amount),
    })
    .from(expenses)
    .where(like(expenses.date, `${year}%`))
    .groupBy(expenses.party);

  const sanitized = expensesByParty.map((row) => {
    const party = row.party; // Type is string | null
    const total = parseFloat(row.total || '0'); // handle null by defaulting to '0'

    // Ensure party is a string before accessing groupedByParty
    const senatorCount = party ? groupedByParty[party]?.length || 0 : 0; // Prevent division by zero

    return {
      party: party,
      total_expenses: parseFloat(total.toFixed(2)),
      total_per_senator:
        senatorCount > 0 ? parseFloat((total / senatorCount).toFixed(2)) : 0, // prevents division by zero
      senator_ids: party ? groupedByParty[party] || [] : [], // Access only if party is not null
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
