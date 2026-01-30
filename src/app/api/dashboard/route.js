import { getDb } from '@/lib/db';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET() {
    const sql = getDb();
    const dashboardEntries = await sql`
        SELECT * FROM dashboard_entries
    `;
    return Response.json(dashboardEntries);
}

export async function POST(request) {
    const sql = getDb();
    const {title, status, link} = await request.json();
    const result = await sql`
    INSERT INTO dashboard_entries (title, status, link)
    VALUES (${title}, ${status}, ${link})
    RETURNING *
    `
    return Response.json({ entry: result[0] });
}

export async function DELETE(request) {
    const { user } = await withAuth();
    if (!user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sql = getDb();
    const {id} = await request.json();
    await sql`
    DELETE FROM dashboard_entries
    WHERE id = ${id}
    `;
    return Response.json({ success: true });
}