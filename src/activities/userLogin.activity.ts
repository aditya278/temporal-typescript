export async function authenticateUser(email: string, password: string): Promise<{ token?: string; error?: string}> {
  if (email === 'aditya@gmail.com' && password === 'Test1234!')
    return { token: 'token' };
  return { error: 'Error'};
};

export async function generateAuthToken(email: string, password: string): Promise<{ token?: string; error?: string}> {
  if (email === 'aditya@gmail.com' && password === 'Test1234!')
    return { token: 'token' };
  return { error: 'Error'};
};