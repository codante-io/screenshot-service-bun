import { Cron } from 'croner';
import { updater } from '../features/codante-apis/senator-expenses/updater';

const job = Cron('0 2 * * *', async () => {
  console.log('Running ');
  await updater();
});
