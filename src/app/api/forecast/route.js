import { processForecast } from '@/lib/dataProcess'
import { fetchForecast } from '@/lib/api'
import { sql } from '@/lib/db'

export async function GET(req) {
  const { searchParams } = new URL(req.url)

  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))
  const date = searchParams.get('date')
  const timezone = searchParams.get('timezone')
  const offset = searchParams.get('offset')

  try {
    const result = await sql`
      SELECT data
      FROM forecast_cache
      WHERE lat = ${lat}
      AND lon = ${lon}
      AND date = ${date}
      LIMIT 1
    `

    if (result.length > 0) {
      return Response.json(result[0].data)
    }

    const raw = await fetchForecast(lat, lon, timezone)
    

    const processed = processForecast(raw, offset)

    await sql`
    INSERT INTO forecast_cache (
      lat,
      lon,
      date,
      data
    )
    VALUES (
      ${lat},
      ${lon},
      ${date},
      ${JSON.stringify(processed)}
    )
  `

    return Response.json(processed)
  } catch (err) {
    console.error(err)

    return Response.json(
      { error: err.message },
      { status: 500 }
    )
  }
}