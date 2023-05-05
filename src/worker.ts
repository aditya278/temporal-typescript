import { Worker } from '@temporalio/worker';
import * as appActivities from './activities/App.activity';
import * as userRegistrationActivities from './activities/UserRegistration.activity';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities: appActivities,
    taskQueue: 'app-setup',
  });

  await worker.run();

  const worker2 = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities: userRegistrationActivities,
    taskQueue: 'user-registration',
  });

  await worker2.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
