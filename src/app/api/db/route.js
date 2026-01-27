/**
 * Database API Route
 * 
 * Endpoints:
 * - GET: Test database connection and return status
 * - POST: Initialize database tables
 */

import { getDb, initializeDatabase } from '@/lib/db';

/**
 * GET /api/db
 * Test database connection
 */
export async function GET() {
  try {
    const sql = getDb();
    // Simple query to test connection
    const result = await sql`SELECT NOW() as current_time`;
    
    return Response.json({
      status: 'connected',
      timestamp: result[0].current_time,
      message: 'Neon database connection successful'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return Response.json({
      status: 'error',
      message: error.message,
      hint: 'Make sure DATABASE_URL is set in your environment variables'
    }, { status: 500 });
  }
}

/**
 * POST /api/db
 * Initialize database tables
 */
export async function POST() {
  try {
    await initializeDatabase();
    
    return Response.json({
      status: 'success',
      message: 'Database tables initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    
    return Response.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
