import Card from "./card"
import { getTotalSumArr, param, weatherInfo } from "@/lib/param"
import CardTitle from "./cardTitle"

export default function Precipitation({ hourly, index, indexD, setDisplay, setCardClicked }) {
  const title = 'precipitation'
  const code = hourly.metrics.weather_code?.forecast[index]
  const probability = hourly.metrics.ww_prob_precip_1h
  const precipitation = hourly.metrics.precip_amount_1h
  const totalSum = hourly.metrics.precip_amount_24h
  const firstTimestamp = hourly.timestamps?.[0]
  const startHour = firstTimestamp ? Number(firstTimestamp.slice(11, 13)) : 0
  const alignedPrecipitation = [
    ...Array(startHour).fill(null),
    ...(precipitation?.forecast ?? [])
  ]
  const dailyTotal = getTotalSumArr(alignedPrecipitation).slice(0, 7)
  const uses24hTotal = dailyTotal[0] == null
  dailyTotal[0] ??= totalSum?.forecast?.[0] ?? null


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

      {code &&
        <div className={`${param.weatherDesc}`}>
          {weatherInfo(code).label}
        </div>
      }
    </Card>
  )
}