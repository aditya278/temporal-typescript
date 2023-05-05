import fs from 'fs';
import path from 'path';
import { MockData } from '../configs/mockdata';

export async function setupDatabase(env: string): Promise<string> {
  fs.writeFileSync(path.join(__dirname, './mock_data.json'), JSON.stringify(MockData), {encoding:'utf8',flag:'w'});
  return `Database setup on ${env} has completed!`;
};