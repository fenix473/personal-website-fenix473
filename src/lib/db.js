/**
 * Database configuration for Neon Postgres
 * 
 * This module exports database utilities for connecting to and querying
 * the Neon serverless Postgres database.
 * 
 * Environment variable required:
 * - DATABASE_URL: Connection string for the Neon database
 */

import { neon } from '@neondatabase/serverless';

// Create the SQL query function using the DATABASE_URL
const sql = neon(process.env.DATABASE_URL);

/**
 * Execute a SQL query using tagged template literals
 * @example
 * const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
 */
export { sql };

/**
 * Initialize the database with required tables
 * Call this once to set up your schema
 */
export async function initializeDatabase() {
  try {
    // Example: Create a messages table for chat history
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
