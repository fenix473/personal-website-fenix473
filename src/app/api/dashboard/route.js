import { getDb, migrateDashboardEntries } from '@/lib/db';
import { withAuth } from '@workos-inc/authkit-nextjs';

const AUSTIN_BASE = 'https://data.austintexas.gov/resource/dx9v-zd7x.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || '2026-02-01';
  const to = searchParams.get('to') || new Date().toISOString().slice(0, 10);

  const sql = getDb();
  await migrateDashboardEntries();
  const dashboardEntries = await sql`
    SELECT * FROM dashboard_entries ORDER BY created_at DESC NULLS LAST, id DESC
  `;

  // Single Austin API call with count(*) — avoids Vercel timeout from N self-calls
  let totalIncidents = 0;
  try {
    const dayStart = `${from}T00:00:00.000`;
    const dayEnd = `${to}T23:59:59.999`;
    const where = `latitude is not null and longitude is not null and published_date >= '${dayStart}' and published_date <= '${dayEnd}'`;
    const params = new URLSearchParams({
      $select: 'count(*)',
      $where: where,
    });
    const res = await fetch(`${AUSTIN_BASE}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      const count = data?.[0]?.count;
      totalIncidents = typeof count === 'string' ? parseInt(count, 10) : Number(count) || 0;
    }
  } catch (err) {
    console.error('Dashboard: Austin API count failed', err);
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