import { DuckDBConnection, DuckDBInstance } from '@duckdb/node-api';
import { join } from 'path';

async function performUpsert(connection: DuckDBConnection) {
  // Generate a random email
  const randomEmail = `jane_${Math.floor(Math.random() * 1000000)}@example.com`;

  // Use upsert pattern to update the email for user with id=2
  await connection.run(`
    INSERT INTO users (id, username, email) 
    VALUES (2, 'jane_smith', '${randomEmail}')
    ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email
  `);
}

async function performFrequentUpsert(cnt= 1000){

  const dbPath = join(process.cwd(), 'test.db');
  const instance = await DuckDBInstance.create(dbPath);
  const connection = await instance.connect('test.db');
  const tasks = [];
  for(let i = 0; i < cnt; i++){
    tasks.push(performUpsert(connection));
  }
  await Promise.allSettled(tasks);
  connection.closeSync();
}

await performFrequentUpsert(1000);

console.log('Done');
