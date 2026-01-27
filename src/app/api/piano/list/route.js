/**
 * API route to list all saved melodies from Neon database
 * GET /api/piano/list
 * Returns: array of { id, name, tempo, notes, created_at }
 */

import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const sql = getDb();
    const melodies = await sql`
      SELECT id, name, tempo, notes, created_at
      FROM melodies
      ORDER BY created_at DESC
    `;

    return Response.json(melodies);
  } catch (error) {
    console.error('Error fetching melodies:', error);
    return Response.json(
      { error: 'Failed to fetch melodies' },
      { status: 500 }
    );
  }
}
