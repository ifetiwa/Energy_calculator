import { MySQLStorage, createMySQLConfig } from './mysql-storage';
import { storage as memStorage } from './storage';
import { IStorage } from './storage';

let databaseStorage: MySQLStorage | null = null;

export async function getDatabaseStorage(): Promise<IStorage> {
  // If DATABASE_URL is not set, use in-memory storage
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not found, using in-memory storage');
    return memStorage;
  }

  try {
    if (!databaseStorage) {
      const config = createMySQLConfig();
      databaseStorage = new MySQLStorage(config);
      await databaseStorage.connect();
      console.log('Connected to MySQL database');
    }
    return databaseStorage;
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error);
    console.log('Falling back to in-memory storage');
    return memStorage;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  if (databaseStorage) {
    await databaseStorage.disconnect();
    databaseStorage = null;
  }
}

// Graceful shutdown
process.on('SIGINT', closeDatabaseConnection);
process.on('SIGTERM', closeDatabaseConnection);