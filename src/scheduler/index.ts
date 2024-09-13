import { CronJob } from 'cron';
import { exec } from 'child_process';

// Schedule the task to run every day at 2am
new CronJob(
  '0 2 * * *',
  () => {
    console.log('Running the npm script every day at 2am');
    runNpmScript('codante-apis:update-senator-expenses');
  },
  null,
  true,
  'America/Sao_Paulo'
);

function runNpmScript(scriptName: string): void {
  exec(`npm run ${scriptName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing npm script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`npm script stderr: ${stderr}`);
    }
    console.log(`npm script output: ${stdout}`);
  });
}
