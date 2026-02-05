import { getDb, migrateDashboardEntries } from '@/lib/db';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET() {
  const sql = getDb();
  await migrateDashboardEntries();
  const dashboardEntries = await sql`
    SELECT * FROM dashboard_entries ORDER BY created_at DESC NULLS LAST, id DESC
  `;
  const countResult = await sql`
    SELECT COUNT(*)::int AS count FROM daily_traffic_incidents
  `;
  const totalIncidents = countResult[0]?.count ?? 0;
  return Response.json({ dashboardEntries, totalIncidents });
}

export async function POST(request) {
  const sql = getDb();
  await migrateDashboardEntries();
  const {
    title,
    status,
    link,
    type,
    description,
    user: userName,
    latitude,
    longitude,
  } = await request.json();
  const result = await sql`
    INSERT INTO dashboard_entries (title, status, link, type, description, user_name, latitude, longitude, created_at)
    VALUES (${title}, ${status ?? ''}, ${link ?? ''}, ${type ?? null}, ${description ?? null}, ${userName ?? null}, ${latitude ?? null}, ${longitude ?? null}, CURRENT_TIMESTAMP)
    RETURNING *
  `;
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