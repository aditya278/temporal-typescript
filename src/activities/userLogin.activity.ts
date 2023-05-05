import fs from 'fs';
import path from 'path';
import { UserData } from '../configs/models';

export async function authenticateUser(userData: UserData): Promise<boolean> {
  const fileData = fs.readFileSync(path.join(__dirname, './mock_data.json')).toString('utf-8');
  if (!fileData) return false;

  const dbData = JSON.parse(fileData);

  if (dbData.users?.some((user: UserData) => user.email === userData.email && user.password === userData.password))
    return true;
  return false;
};

export async function generateAuthToken(email: string): Promise<string> {
  return `${email}-token-1234-abc`;
};

export async function displayMessage(message: string, type: 'error' | 'info'): Promise<string> {
  return `${type}: ${message};`
};