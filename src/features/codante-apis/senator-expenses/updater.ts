import { scrapeExpenses } from './expenses/scrapeExpenses';
import { updatePartySummary } from './summaries/updatePartySummary';
import { updateUFSummary } from './summaries/updateUFSummary';

updater();

export async function updater() {
  const YEAR = 2024;

  // update expenses
  console.log('Scraping expenses...');
  // await scrapeExpenses(YEAR);

  // update summaries
  console.log('Updating party summary...');
  await updatePartySummary(YEAR);
  console.log('Updating UF summary...');
  await updateUFSummary(YEAR);
}
