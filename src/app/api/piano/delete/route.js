/**
 * API route to delete a melody from Neon database
 * DELETE /api/piano/delete
 * Body: { id: number }
 * Returns: { success: true, id: number }
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function DELETE(request) {
  try {
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
