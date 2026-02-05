import { NextResponse } from 'next/server'

/**
 * GET /api/cron/daily
 *
 * Vercel Cron job (schedule: 1 0 * * * = 00:01 UTC daily).
 * Fetches all traffic incidents published on the previous UTC day (yesterday)
 * from the Austin API (via /api/traffic-reports), then stores them in
 * daily_traffic_incidents via POST /api/traffic-reports/daily.
 * Requires Authorization: Bearer <CRON_SECRET> when CRON_SECRET is set.
 */
export async function GET(request) {
  // Require Bearer token when CRON_SECRET is configured (Vercel sends it automatically).
  const auth = request.headers.get('Authorization')
  const secret = process.env.CRON_SECRET
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Use VERCEL_URL in production so internal fetch hits the same deployment.
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : new URL(request.url).origin

    // Yesterday in UTC (YYYY-MM-DD); matches Austin API published_date filter.
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - 1)
    const yesterday = d.toISOString().slice(0, 10)
    const listRes = await fetch(
      `${base}/api/traffic-reports?date=${yesterday}&limit=2000`
    )
    if (!listRes.ok) {
      throw new Error(`traffic-reports GET failed: ${listRes.status}`)
    }
    const incidents = await listRes.json()

    // No incidents for this day: succeed without writing to DB.
    if (!Array.isArray(incidents) || incidents.length === 0) {
      return NextResponse.json({
        ok: true,
        stored: 0,
        date: yesterday,
        message: 'No incidents for yesterday',
      })
    }

    // Persist yesterday's incidents into daily_traffic_incidents (upsert by traffic_report_id + date).
    const postRes = await fetch(`${base}/api/traffic-reports/daily`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: yesterday, incidents }),
    })
    if (!postRes.ok) {
      const err = await postRes.text()
      throw new Error(`traffic-reports/daily POST failed: ${postRes.status} ${err}`)
    }
    const { stored } = await postRes.json()

    return NextResponse.json({
      ok: true,
      stored,
      total: incidents.length,
      date: yesterday,
    })
  } catch (err) {
    console.error('Cron /api/cron/daily error:', err)
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    )
  }
}
