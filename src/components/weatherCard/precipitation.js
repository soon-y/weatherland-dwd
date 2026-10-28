import Card from "./card"
import { param, weatherInfo } from "@/lib/param"
import CardTitle from "./cardTitle"

export default function Precipitation({ hourly, index, indexD, setDisplay, setCardClicked }) {
  const title = 'precipitation'
  const code = hourly.metrics.weather_code?.forecast[index]
  const probability = hourly.metrics.ww_prob_precip_1h
  const precipitation = hourly.metrics.precip_amount_1h
  const totalSum = hourly.metrics.precip_amount_24h
  const timestamps = hourly.timestamps ?? []
  const values = precipitation?.forecast ?? []

  const dailyTotal = (hourly.daily.time ?? []).slice(0, 7).map(date => {
    const dayValues = Array(24).fill(null)

    timestamps.forEach((timestamp, i) => {
      if (timestamp.slice(0, 10) !== date) return

      const hour = Number(timestamp.slice(11, 13))
      dayValues[hour] = values[i] ?? null
    })

    // Only calculate a daily total when all 24 hours are available.
    if (!dayValues.every(Number.isFinite)) return null

    const sum = dayValues.reduce((total, value) => total + value, 0)
    return +sum.toFixed(1)
  })

  // Keep the existing 24-hour fallback for the first forecast day.
  const uses24hTotal = dailyTotal[0] == null

  if (dailyTotal.length > 0) {
    dailyTotal[0] ??= totalSum?.forecast?.[0] ?? null
  }


  return (
    <Card style={'square'} setDisplay={setDisplay} title={title} setCardClicked={setCardClicked}
      clickable={precipitation != null || probability != null}>
      <div>
        <CardTitle title={title} />

        {probability?.forecast?.[index] == null &&
          precipitation?.forecast?.[index] == null ? (
          <p className={param.weatherDescMain}>N/A</p>
        ) : (
          <>
            {probability?.forecast?.[index] != null && (
              <p className={param.weatherDescMain}>
                {probability.forecast[index]} {probability.unit ?? '%'}
              </p>
            )}

            {precipitation?.forecast?.[index] != null && (
              <div className={param.weatherDescSub}>
                <p>
                  {precipitation.forecast[index]}
                  <span className="text-sm"> mm</span>
                </p>

                {dailyTotal[indexD] != null && (
                  <p className="text-sm">
                    {dailyTotal[indexD]} mm (
                    {indexD === 0 && uses24hTotal ? '24-hour total' : 'daily total'})
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {code != null && (
        <div className={param.weatherDesc}>
          {weatherInfo(code).label}
        </div>
      )}
    </Card>
  )
}