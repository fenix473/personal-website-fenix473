/**
 * API route to delete a melody from Neon database
 * DELETE /api/piano/delete
 * Body: { id: number }
 * Returns: { success: true, id: number }
 */

import { getDb } from '@/lib/db';

export async function DELETE(request) {
  try {
    const sql = getDb();
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM melodies
      WHERE id = ${id}
    `;

    return Response.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting melody:', error);
    return Response.json(
      { error: 'Failed to delete melody' },
      { status: 500 }
    );
  }
}
