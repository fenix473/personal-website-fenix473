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
 * @throws {Error} If DATABASE_URL environment variable is not set
 */
export function getDb() {
  if (!_sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL environment variable is not set. ' +
        'Please create a .env.local file in the project root with: DATABASE_URL=your_neon_connection_string'
      );
    }
    _sql = neon(databaseUrl);
  }
  return _sql;
}

/**
 * Add new columns to dashboard_entries if they don't exist (idempotent).
 * Call this before INSERT to ensure schema is up to date.
 */
export async function migrateDashboardEntries() {
  const sql = getDb();
  await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS type VARCHAR(255)`;
  await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS description TEXT`;
  await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS user_name VARCHAR(255)`;
  await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION`;
  await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`;
  await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
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

    await sql`
      CREATE TABLE IF NOT EXISTS dashboard_entries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        link VARCHAR(255) DEFAULT '',
        type VARCHAR(255),
        description TEXT,
        user_name VARCHAR(255),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS type VARCHAR(255)`;
    await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS description TEXT`;
    await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS user_name VARCHAR(255)`;
    await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION`;
    await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`;
    await sql`ALTER TABLE dashboard_entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;

    // Active traffic incidents (from Austin API), keyed by traffic_report_id
    await sql`
      CREATE TABLE IF NOT EXISTS active_traffic_incidents (
        id SERIAL PRIMARY KEY,
        traffic_report_id VARCHAR(255) UNIQUE NOT NULL,
        issue_reported TEXT,
        address TEXT,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        traffic_report_status VARCHAR(100),
        agency VARCHAR(255),
        published_date TIMESTAMP WITH TIME ZONE,
        status_date_time TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Daily snapshot: incidents by day (for 00:01 UTC cron, yesterday's data), keyed by traffic_report_id + incident_date
    await sql`
      CREATE TABLE IF NOT EXISTS daily_traffic_incidents (
        id SERIAL PRIMARY KEY,
        incident_date DATE NOT NULL,
        traffic_report_id VARCHAR(255) NOT NULL,
        issue_reported TEXT,
        address TEXT,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        traffic_report_status VARCHAR(100),
        agency VARCHAR(255),
        published_date TIMESTAMP WITH TIME ZONE,
        status_date_time TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(traffic_report_id, incident_date)
      )
    `;

    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
