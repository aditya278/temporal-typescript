import path from "path";
import { UserData } from "../configs/models";
import fs from 'fs';

// const dbData = {
//   users: [
//     { email: 'aditya@gmail.com', password: 'Test1234!' }
//   ]
// }

export async function validateUserDetails(userData: UserData): Promise<boolean> {
  const fileData = fs.readFileSync(path.join(__dirname, './mock_data.json')).toString('utf-8');
  if (!fileData) return false;
  const dbData = JSON.parse(fileData);
  if (dbData.users?.some((user: UserData) => user.email === userData.email))
    return false;
  if (userData.password?.length < 5)
    return false;
  return true;
};

export async function createUserAccount(userData: UserData): Promise<boolean> {
  const fileData = fs.readFileSync(path.join(__dirname, './mock_data.json')).toString('utf-8');
  if (!fileData) return false;
  const dbData = JSON.parse(fileData);
  
  dbData.users?.push(userData);
  fs.writeFileSync(path.join(__dirname, './mock_data.json'), JSON.stringify(dbData), {encoding:'utf8',flag:'w'});
  return true;
};

export async function sendWelcomeEmail(email: string): Promise<void> {
  console.log(`Email sent to ${email}! Welcome to the Application!`);
};

export async function DisplayMessage(message: string, type: 'error' | 'info'): Promise<string> {
  return `${type.toUpperCase}: ${message};`
};