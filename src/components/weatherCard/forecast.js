import { useEffect, useState } from "react"
import Card from "./card"
import { param, tempColorIndex, tempColorList } from "@/lib/param"
import WeatherIcon from "../weatherIcon"
import CardTitle from "./cardTitle"
import { getNextDayEndUTC } from '@/lib/time'

export default function Forecast({ hourly }) {
  const [weekly, setWeedkly] = useState([])
  const tempMin = hourly.metrics.daily_min_temperature?.forecast
  const tempMax = hourly.metrics.daily_max_temperature?.forecast
  const weatherCode = hourly.metrics.weather_code_priority_24h
  const isValid = tempMin && tempMax && weatherCode

  useEffect(() => {
    const dates = hourly.daily.time.slice(1, 8)
    const probabilityMetric = hourly.metrics.ww_prob_precip_24h

    const temperatureDates = [
      ...new Set(hourly.timestamps.map(timestamp => timestamp.slice(0, 10)))
    ]

    const weeklyArr = dates.map(date => {
      const dayIndex = new Date(`${date}T00:00:00Z`).getUTCDay()
      const temperatureIndex = temperatureDates.indexOf(date)

      // The 24-hour period ending at midnight UTC the next day.
      const endUTC = getNextDayEndUTC(date)

      const weatherIndex =
        weatherCode?.timestampsUTC?.indexOf(endUTC) ?? -1

      const probabilityIndex =
        probabilityMetric?.timestampsUTC?.indexOf(endUTC) ?? -1

      return {
        day: param.days[dayIndex],
        code: weatherIndex >= 0
          ? weatherCode.forecast[weatherIndex]
          : null,
        probability: probabilityIndex >= 0
          ? probabilityMetric.forecast[probabilityIndex]
          : null,
        min: tempMin?.[temperatureIndex],
        max: tempMax?.[temperatureIndex],
      }
    })

    setWeedkly(weeklyArr)
  }, [hourly, weatherCode, tempMin, tempMax])

  const barRange = (min, max) => {
    const validMin = (tempMin ?? []).filter(Number.isFinite)
    const validMax = (tempMax ?? []).filter(Number.isFinite)

    if (
      !Number.isFinite(min) || !Number.isFinite(max) || min > max ||
      !validMin.length || !validMax.length
    ) {
      return { display: 'none' }
    }

    const globalMin = Math.min(...validMin)
    const globalMax = Math.max(...validMax)
    const range = globalMax - globalMin

    const colors = tempColorList.slice(
      tempColorIndex(min), tempColorIndex(max) + 1
    )

    const background = colors.length === 1
      ? colors[0] : `linear-gradient(to right, ${colors.join(', ')})`

    // Equal temperatures are represented by a small marker.
    if (range <= 0 || min === max) {
      const position = range > 0 ? ((min - globalMin) / range) * 100 : 50

      return {
        left: `${position}%`,
        right: 'auto',
        width: '4px',
        transform: `translateX(${position <= 0 ? '0%' : position >= 100 ? '-100%' : '-50%'
          })`,
        background
      }
    }

    return {
      left: `${((min - globalMin) / range) * 100}%`,
      right: 'auto',
      width: `${((max - min) / range) * 100}%`,
      background
    }
  }

  return (
    <>
      {isValid &&
        <Card style={'forecast'} clickable={false}>
          <CardTitle title={'7-day forecast'} />
          <div className='grid gap-2 mb-1'>
            {weekly.map((el, i) => (
              <div key={i} className='grid grid-cols-7 sm:grid-cols-8 items-center justify-center h-9'>
                <p className={`col-span-1 text-sm sm:text-base`}>{el.day}</p>
                <div className='flex justify-center items-center'>
                  {el.code != null && <WeatherIcon code={el.code} probability={el.probability} />}
                </div>
                {el.min != null && el.max != null && (<>
                  <p className={`col-span-1 text-sm sm:text-base text-center`}>{el.min}°</p>
                  <div className={`col-span-3 sm:col-span-4 relative h-2 rounded-full overflow-hidden bg-black/40`}>
                    <div
                      className="absolute inset-0 rounded-full"
                      style={barRange(el.min, el.max)}
                    />
                  </div>
                  <p className={`col-span-1 text-sm sm:text-base text-center`}>{el.max}°</p>
                </>)}
              </div>
            ))}
          </div>
        </Card>}
    </>
  )
}