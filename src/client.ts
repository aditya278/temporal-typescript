import { Connection, Client } from '@temporalio/client';
import { applicationSetup, userRegisterWorkflow } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
  // Connect to the default Server location (localhost:7233)
  const connection = await Connection.connect();

  const client = new Client({
    connection,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  });

  // Application Setup Workflow
  // const appSetup = await client.workflow.start(applicationSetup, {
  //   args: ['dev'],
  //   taskQueue: 'app-setup',
  //   workflowId: 'app-setup-' + nanoid(),
  // });
  // console.log(`Started workflow ${appSetup.workflowId}`);

  // // optional: wait for client result
  // console.log(await appSetup.result());

  const handle = await client.workflow.start(userRegisterWorkflow, {
    args: [{ email: 'aditya@gmail.com', password: 'Test1234!' }],
    taskQueue: 'user-registration',
    workflowId: 'user-registration-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
