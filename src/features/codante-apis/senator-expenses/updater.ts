import { connection } from './db/db';
import { scrapeExpenses } from './expenses/scrapeExpenses';
import { updatePartySummary } from './summaries/updatePartySummary';
import { updateUFSummary } from './summaries/updateUFSummary';

await updater();

async function updater() {
  const YEAR = 2024;

  // update expenses
  console.log('Scraping expenses...');
  await scrapeExpenses();

  // update summaries
  console.log('Updating party summary...');
  await updatePartySummary(YEAR);
  console.log('Updating UF summary...');
  await updateUFSummary(YEAR);

  connection.end();
}
