import { NextResponse } from 'next/server'

/**
 * GET /api/cron/daily
 * Vercel Cron (23:55 UTC): fetches all incidents published today and stores in daily_traffic_incidents.
 */
export async function GET(request) {
  const auth = request.headers.get('Authorization')
  const secret = process.env.CRON_SECRET
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : new URL(request.url).origin

    const today = new Date().toISOString().slice(0, 10)
    const listRes = await fetch(
      `${base}/api/traffic-reports?date=${today}&limit=2000`
    )
    if (!listRes.ok) {
      throw new Error(`traffic-reports GET failed: ${listRes.status}`)
    }
    const incidents = await listRes.json()
    if (!Array.isArray(incidents) || incidents.length === 0) {
      return NextResponse.json({
        ok: true,
        stored: 0,
        date: today,
        message: 'No incidents for today',
      })
    }

    const postRes = await fetch(`${base}/api/traffic-reports/daily`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, incidents }),
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
      date: today,
    })
  } catch (err) {
    console.error('Cron /api/cron/daily error:', err)
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    )
  }
}
