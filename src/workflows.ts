import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as userRegistrationActivities from './activities/userRegistration.activity';
import type * as appActivities from './activities/app.activity';
import type * as userLoginActivities from './activities/userLogin.activity';
import { UserData } from './configs/models';


const { setupDatabase } = proxyActivities<typeof appActivities>({ startToCloseTimeout: '1 minute' });

const { validateUserDetails, createUserAccount, sendWelcomeEmail, displayMessage } = proxyActivities<typeof userRegistrationActivities>({
  startToCloseTimeout: '1 minute',
});

const { authenticateUser, generateAuthToken, displayMessage: authDisplayMessage } = proxyActivities<typeof userLoginActivities>({ startToCloseTimeout: '1 minute' });

/** 
 * A workflow that sets up the application
 * Database connection, Redis connection, Data Seeding, etc
 * @param env 
 * @returns 
 */
export async function applicationSetup(env: string): Promise<string> {
  // Setup Database
  return await setupDatabase(env);
}

/**
 * Workflow to Register a user. Activities involved:
 * ValidateUserDetails, CreateUserAccount, SendWelcomeEmail, DisplayMessage
 * @param userData 
 * @returns 
 */
export async function userRegisterWorkflow(userData: UserData): Promise<string> {
  try {
    console.log(`Validating User: ${userData.email}`);
    const isValid = await validateUserDetails(userData);
    if (!isValid) return await displayMessage('Please provide proper data', 'error');
    console.log(`User ${userData.email} validated!`);

    await createUserAccount(userData);
    console.log(`New Account created for user ${userData.email}`);
    await sendWelcomeEmail(userData.email);
    console.log(`Email sent to ${userData.email}`);

    return await displayMessage('User Registered Successfully', 'info');
  }
  catch(err: any) {
    return await displayMessage(err.message, 'error');
  }
};

/**
 * Workflow to Authenticate a user. Activities involved:
 * AuthenticateUser, GenerateAuthToken, DisplayMessage
 * @param userData 
 * @returns 
 */
export async function userAuthenticationWorkflow(userData: UserData): Promise<string>{
  try {
    const isValid = await authenticateUser(userData);
    if (!isValid) return await authDisplayMessage('', 'error');

    const generatedToken = await generateAuthToken(userData.email);
    return await authDisplayMessage(JSON.stringify({ token: generatedToken }), 'info');
  }
  catch (err: any) {
    return await authDisplayMessage(err.message, 'error');
  }
};