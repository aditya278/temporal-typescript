import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as userRegistrationActivities from './activities/UserRegistration.activity';
import type * as appActivities from './activities/App.activity';
import { UserData } from './configs/models';

const { validateUserDetails, createUserAccount, sendWelcomeEmail, DisplayMessage } = proxyActivities<typeof userRegistrationActivities>({
  startToCloseTimeout: '1 minute',
});

const { setupDatabase: SetupDatabase } = proxyActivities<typeof appActivities>({ startToCloseTimeout: '1 minute' });

/** A workflow that simply calls an activity */
export async function applicationSetup(env: string): Promise<string> {
  // Setup Database
  return await SetupDatabase(env);
}

export async function userRegisterWorkflow(userData: UserData): Promise<string> {
  try {
    const isValid = await validateUserDetails(userData);
    if (!isValid) return await DisplayMessage('Please provide proper data', 'error');

    await createUserAccount(userData);
    await sendWelcomeEmail(userData.email);

    return await DisplayMessage('User Registered Successfully', 'info');
  }
  catch(err: any) {
    return await DisplayMessage(err.message, 'error');
  }
};