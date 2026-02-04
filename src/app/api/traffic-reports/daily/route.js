import { getDb } from '@/lib/db'

/**
 * POST /api/traffic-reports/daily
 * Store incidents for a given day into daily_traffic_incidents.
 * Body: { date: 'YYYY-MM-DD', incidents: incident[] } or { date, ...incident } for single.
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const date = body.date ? String(body.date).slice(0, 10) : null
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json(
        { error: 'Body must include date as YYYY-MM-DD' },
        { status: 400 }
      )
    }

    const list = Array.isArray(body.incidents)
      ? body.incidents
      : body.incidents
        ? [body.incidents]
        : [body]
    const incidents = list.filter((row) => row && row.traffic_report_id != null)

    if (incidents.length === 0) {
      return Response.json({ stored: 0, date, message: 'No incidents to store' })
    }

    const sql = getDb()
    let stored = 0

    for (const row of incidents) {
      const traffic_report_id = String(row.traffic_report_id ?? '')
      const latitude = row.latitude != null ? Number(row.latitude) : null
      const longitude = row.longitude != null ? Number(row.longitude) : null
      if (!traffic_report_id || latitude == null || longitude == null) continue

      await sql`
        INSERT INTO daily_traffic_incidents (
          incident_date, traffic_report_id, issue_reported, address, latitude, longitude,
          traffic_report_status, agency, published_date, status_date_time
        ) VALUES (
          ${date},
          ${traffic_report_id},
          ${row.issue_reported ?? null},
          ${row.address ?? null},
          ${latitude},
          ${longitude},
          ${row.traffic_report_status ?? null},
          ${row.agency ?? null},
          ${row.published_date ?? null},
          ${row.traffic_report_status_date_time ?? null}
        )
        ON CONFLICT (traffic_report_id, incident_date) DO UPDATE SET
          issue_reported = EXCLUDED.issue_reported,
          address = EXCLUDED.address,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          traffic_report_status = EXCLUDED.traffic_report_status,
          agency = EXCLUDED.agency,
          published_date = EXCLUDED.published_date,
          status_date_time = EXCLUDED.status_date_time
      `
      stored += 1
    }

    return Response.json({ stored, total: incidents.length, date })
  } catch (err) {
    console.error('POST /api/traffic-reports/daily error:', err)
    return Response.json(
      { error: err.message || 'Failed to store daily incidents' },
      { status: 500 }
    )
  }
}
