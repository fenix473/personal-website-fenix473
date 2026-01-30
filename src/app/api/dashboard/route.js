import { getDb } from '@/lib/db';

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
    const sessionCookie = request.cookies.get('wos_session')?.value;
    if (!sessionCookie) {
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