import { getDb, migrateDashboardEntries } from '@/lib/db';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || '2026-02-01';
  const to = searchParams.get('to') || new Date().toISOString().slice(0, 10);

  const sql = getDb();
  await migrateDashboardEntries();
  const dashboardEntries = await sql`
    SELECT * FROM dashboard_entries ORDER BY created_at DESC NULLS LAST, id DESC
  `;

  // Fetch incident count via /api/traffic-reports for each day in range
  let totalIncidents = 0;
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : new URL(request.url).origin;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  for (let d = new Date(fromDate); d <= toDate; d.setUTCDate(d.getUTCDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    try {
      const res = await fetch(`${base}/api/traffic-reports?date=${dateStr}&limit=2000`);
      if (res.ok) {
        const incidents = await res.json();
        totalIncidents += Array.isArray(incidents) ? incidents.length : 0;
      }
    } catch (err) {
      console.error(`Dashboard: traffic-reports fetch failed for ${dateStr}`, err);
    }
  }

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