import { join } from 'path';
import { DuckDBInstance } from '@duckdb/node-api';

// Create a persistent database file
async function setupDatabase() {
  try {
    const dbPath = join(process.cwd(), 'test.db');
    const instance = await DuckDBInstance.create(dbPath);
    // Connect to the instance
    const connection = await instance.connect();

    // Create users table with different data types
    await connection.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL,
        age TINYINT,
        height FLOAT,
        weight DOUBLE,
        is_active BOOLEAN DEFAULT true,
        registration_date DATE,
        last_login TIMESTAMP,
        profile BLOB,
        salary DECIMAL(10, 2),
        preferences JSON
      )
    `);

    console.log('Table created successfully');

    // Insert sample data into users table
    await connection.run(`
      INSERT INTO users (id, username, email, age, height, weight, is_active, registration_date, last_login, salary, preferences)
      VALUES 
        (1, 'john_doe', 'john@example.com', 28, 175.5, 70.2, true, '2023-01-15', '2023-06-20 08:30:00', 75000.50, '{"theme":"dark","notifications":true}'),
        (2, 'jane_smith', 'jane@example.com', 34, 162.3, 55.0, true, '2023-02-20', '2023-06-19 14:45:00', 82500.75, '{"theme":"light","notifications":false}'),
        (3, 'bob_johnson', 'bob@example.com', 45, 180.0, 85.7, false, '2023-03-10', '2023-05-28 11:20:00', 65000.00, '{"theme":"system","notifications":true}')
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('Sample data inserted successfully');

    // Query to verify data
    const userCount = await connection.runAndReadAll('SELECT COUNT(*) as count FROM users');
    console.log(`Total users: ${userCount.getRowObjects()[0].count}`);

    // Display all users
    console.log('\nAll users:');
    const allUsers = await connection.runAndReadAll('SELECT * FROM users');
    console.table(allUsers.getRowObjectsJS());

    // Explicitly disconnect
    connection.disconnectSync();

    console.log(`Database persisted to: ${dbPath}`);

  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run the setup
setupDatabase().then(() => {
  console.log('Database setup completed');
}).catch(err => {
  console.error('Failed to set up database:', err);
});
