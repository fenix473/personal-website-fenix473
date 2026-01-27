/**
 * API route to save a melody to Neon database
 * POST /api/piano/save
 * Body: { name: string, tempo: number, notes: array }
 * Returns: { id, name, tempo, notes, created_at }
 */

import { getDb } from '@/lib/db';

export async function POST(request) {
  try {
    const sql = getDb();
    const { name, tempo, notes } = await request.json();

    // Validate required fields
    if (!name || !tempo || !notes || !Array.isArray(notes)) {
      return Response.json(
        { error: 'Missing required fields: name, tempo, notes' },
        { status: 400 }
      );
    }

    // Insert melody into database (notes is JSONB, pass as JSON string for Neon)
    const result = await sql`
      INSERT INTO melodies (name, tempo, notes)
      VALUES (${name}, ${tempo}, ${JSON.stringify(notes)}::jsonb)
      RETURNING id, name, tempo, notes, created_at
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error('Error saving melody:', error);
    return Response.json(
      { error: 'Failed to save melody' },
      { status: 500 }
    );
  }
}
