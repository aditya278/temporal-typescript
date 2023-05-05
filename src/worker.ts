import { Worker } from '@temporalio/worker';
import * as appActivities from './activities/app.activity';
import * as userRegistrationActivities from './activities/userRegistration.activity';
import * as userLoginActivities from './activities/userLogin.activity';

async function run() {
  const workflowsPath = require.resolve('./workflows');

  const workers = await Promise.all([
    Worker.create({
      workflowsPath,
      activities: appActivities,
      taskQueue: 'app-setup',
    }),
    Worker.create({
      workflowsPath,
      activities: userRegistrationActivities,
      taskQueue: 'user-registration',
    }),
    Worker.create({
      workflowsPath,
      activities: userLoginActivities,
      taskQueue: 'user-authentication',
    }),
  ]);

  await Promise.all(workers.map(w => w.run()));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
