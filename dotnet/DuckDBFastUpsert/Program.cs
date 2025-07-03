// See https://aka.ms/new-console-template for more information

using DuckDB.NET.Data;

// Mirror of the TypeScript performUpsert function
async Task PerformUpsert(DuckDBConnection connection)
{
  // Generate a random email
  var random = new Random();
  var randomEmail = $"jane_{random.Next(1000000)}@example.com";

  // Use upsert pattern to update the email for user with id=2
  var cmd = connection.CreateCommand();
  cmd.CommandText = """
                    INSERT INTO users (id, username, email) 
                    VALUES (2, 'jane_smith', $email)
                    ON CONFLICT (id) DO UPDATE 
                    SET email = EXCLUDED.email
                    """;
  cmd.Parameters.Add(new DuckDBParameter("email", randomEmail));

  await cmd.ExecuteNonQueryAsync();
}

async Task PerformFrequentUpsert(int cnt = 1000)
{
  var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "../../test.db");

  // Create connection to DuckDB
  await using var connection = new DuckDBConnection($"Data Source={dbPath}");
  await connection.OpenAsync();

  // Create tasks for parallel execution
  var tasks = new List<Task>();
  for (int i = 0; i < cnt; i++)
  {
    tasks.Add(PerformUpsert(connection));
  }

  // Wait for all tasks to complete
  await Task.WhenAll(tasks);
}

// Main execution
await PerformFrequentUpsert(2000);

Console.WriteLine("Done");
