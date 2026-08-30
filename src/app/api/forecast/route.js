import { processForecast } from '@/lib/dataProcess'
import { fetchForecast } from '@/lib/api'
import { sql } from '@/lib/db'

const TIMEOUT_MS = 4000

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms)),
  ])
}

async function getCached(lat, lon, date) {
  const result = await sql`
    SELECT data FROM forecast_cache
    WHERE lat = ${lat} AND lon = ${lon} AND date = ${date}
    LIMIT 1
  `
  return result[0]?.data ?? null
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)

  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))
  const date = searchParams.get('date')
  const timezone = searchParams.get('timezone')
  const offset = searchParams.get('offset')

  try {
    let raw

    try {
      raw = await withTimeout(fetchForecast(lat, lon, timezone), TIMEOUT_MS)
    } catch (err) {
      if (err.message !== 'TIMEOUT') throw err

      const cached = await getCached(lat, lon, date)
      if (cached) {
        return Response.json({ ...cached, stale: true })
      }

      raw = await fetchForecast(lat, lon, timezone)
    }

    const processed = processForecast(raw, offset)

    await sql`
      INSERT INTO forecast_cache (lat, lon, date, data)
      VALUES (${lat}, ${lon}, ${date}, ${JSON.stringify(processed)})
      ON CONFLICT (lat, lon)
      DO UPDATE SET date = EXCLUDED.date, data = EXCLUDED.data
    `

    return Response.json({ ...processed, stale: false })
  } catch (err) {
    console.error(err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}