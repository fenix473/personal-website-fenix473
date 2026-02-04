import { NextResponse } from 'next/server'

/**
 * GET /api/cron
 * Vercel Cron: fetches active traffic reports and stores them in the DB.
 * Secure with CRON_SECRET: set in Vercel env and add to vercel.json crons.
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

    const listRes = await fetch(`${base}/api/traffic-reports?status=active&limit=500`)
    if (!listRes.ok) {
      throw new Error(`traffic-reports GET failed: ${listRes.status}`)
    }
    const incidents = await listRes.json()
    if (!Array.isArray(incidents) || incidents.length === 0) {
      return NextResponse.json({ ok: true, stored: 0, message: 'No active incidents' })
    }

    const postRes = await fetch(`${base}/api/traffic-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidents),
    })
    if (!postRes.ok) {
      const err = await postRes.text()
      throw new Error(`traffic-reports POST failed: ${postRes.status} ${err}`)
    }
    const { stored } = await postRes.json()

    return NextResponse.json({ ok: true, stored, total: incidents.length })
  } catch (err) {
    console.error('Cron /api/cron error:', err)
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    )
  }
}
