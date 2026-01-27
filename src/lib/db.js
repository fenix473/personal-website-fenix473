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

// Lazy initialization to avoid build-time errors
let _sql = null;

/**
 * Get the SQL query function (lazy initialized)
 * @returns {Function} Neon SQL tagged template function
 */
export function getDb() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

/**
 * Initialize the database with required tables
 * Call this once to set up your schema
 */
export async function initializeDatabase() {
  const sql = getDb();
  try {
    // Create messages table for chat history
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create melodies table for piano saved melodies
    await sql`
      CREATE TABLE IF NOT EXISTS melodies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tempo INTEGER NOT NULL DEFAULT 300,
        notes TEXT NOT NULL,
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
