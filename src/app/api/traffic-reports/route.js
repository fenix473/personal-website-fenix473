import { getDb } from '@/lib/db'

const AUSTIN_BASE =
  'https://data.austintexas.gov/resource/dx9v-zd7x.json'

/**
 * GET /api/traffic-reports
 * Fetches Austin traffic reports with server-side SoQL filtering.
 * Query params:
 *   status - 'active' | 'archived' | 'all' (default: 'active')
 *   date   - YYYY-MM-DD: incidents published on this day (UTC); ignores status
 *   limit  - max rows (default: 500)
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? 'active'
  const dateParam = searchParams.get('date')
  const limit = Math.min(Number(searchParams.get('limit')) || 500, 2000)

  const conditions = [
    'latitude is not null',
    'longitude is not null',
  ]

  if (dateParam) {
    // All incidents published on this day (UTC)
    const dayStart = `${dateParam}T00:00:00.000`
    const dayEnd = `${dateParam}T23:59:59.999`
    conditions.push(`published_date >= '${dayStart}' and published_date <= '${dayEnd}'`)
  } else {
    if (status === 'active') {
      conditions.push("upper(traffic_report_status) = 'ACTIVE'")
    } else if (status === 'archived') {
      conditions.push("upper(traffic_report_status) = 'ARCHIVED'")
    }
  }

  const where = conditions.join(' and ')
  const params = new URLSearchParams({
    $limit: String(limit),
    $where: where,
  })

  const url = `${AUSTIN_BASE}?${params.toString()}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    return Response.json(
      { error: 'Failed to fetch traffic reports' },
      { status: res.status }
    )
  }
  const data = await res.json()
  return Response.json(Array.isArray(data) ? data : [])
}

/**
 * POST /api/traffic-reports
 * Store ACTIVE incidents in the database.
 * Body: single incident object or { incidents: incident[] }
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const list = Array.isArray(body) ? body : body.incidents ? body.incidents : [body]
    if (list.length === 0) {
      return Response.json({ stored: 0, message: 'No incidents to store' })
    }

    const sql = getDb()
    let stored = 0

    for (const row of list) {
      const traffic_report_id = String(row.traffic_report_id ?? '')
      const latitude = row.latitude != null ? Number(row.latitude) : null
      const longitude = row.longitude != null ? Number(row.longitude) : null
      if (!traffic_report_id || latitude == null || longitude == null) continue

      await sql`
        INSERT INTO active_traffic_incidents (
          traffic_report_id, issue_reported, address, latitude, longitude,
          traffic_report_status, agency, published_date, status_date_time
        ) VALUES (
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
        ON CONFLICT (traffic_report_id) DO UPDATE SET
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

    return Response.json({ stored, total: list.length })
  } catch (err) {
    console.error('POST /api/traffic-reports error:', err)
    return Response.json(
      { error: err.message || 'Failed to store incidents' },
      { status: 500 }
    )
  }
}
