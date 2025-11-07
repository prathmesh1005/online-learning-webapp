// import { drizzle } from 'drizzle-orm/neon-http';
// const db = drizzle(process.env.DATABASE_URL);

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Configure neon with optimized connection settings
const pg = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store', // Disable caching for real-time data
  },
  fullResults: false, // Return only rows, not full result metadata for better performance
  arrayMode: false, // Use object mode for better readability
  // Add connection timeout
  fetchConnectionTimeoutMillis: 30000, // 30 seconds connection timeout
});

// Initialize drizzle with the client
export const db = drizzle({ client: pg });

// Add a helper function to check database connectivity
export async function checkDatabaseConnection() {
  try {
    // Simple query to check if database is accessible
    const result = await pg`SELECT 1 as test`;
    return { success: true, data: result };
  } catch (error) {
    console.error('Database connection check failed:', error);
    return { success: false, error: error.message };
  }
}

    