import { useEffect, useState } from "react"
import Box from "./box"
import { param, tempColorIndex, tempColorList } from "@/lib/param"
import WeatherIcon from "../weatherIcon"
import BoxTitle from "./boxTitle"

export default function Forecast({ hourly }) {
  const today = new Date()
  const [weekly, setWeedkly] = useState([])
  const tempMin = hourly.metrics.daily_min_temperature.forecast
  const tempMax = hourly.metrics.daily_max_temperature.forecast
  const weatherCode = hourly.metrics.weather_code_priority_24h
  const probability = hourly.metrics.ww_prob_precip_24h.forecast

  useEffect(() => {
    const weeklyArr = []
    for (let i = 0; i < 7; i++) {
      weeklyArr.push({
        day: param.days[(today.getDay() + i + 1) % 7],
        code: weatherCode.forecast[i * 2 + 1],
        min: tempMin[i + 1],
        max: tempMax[i + 1],
        probability: probability[i * 2 + 1],
      })
      setWeedkly(weeklyArr)
    }
  }, [hourly])

  const barRange = (min, max) => {
    const globalMin = Math.min(...tempMin)
    const globalMax = Math.max(...tempMax)
    const range = globalMax - globalMin
    const left = ((min - globalMin) / range) * 100
    const width = ((max - min) / range) * 100
    const minIndex = tempColorIndex(min)
    const maxIndex = tempColorIndex(max)
    let bgColor = ''

    for (let i = minIndex; i <= maxIndex; i++) {
      bgColor += tempColorList[i] + ','
    }

    return {
      left: `${left}%`,
      width: `${width}%`,
      background: `linear-gradient(to right, ${bgColor.replace(/,$/, '')})`
    }
  }

  return (
    <Box style={'forecast'}>
      <BoxTitle title={'7-day forecast'} />
      <div className='grid gap-2 mb-1'>
        {weekly.map((el, i) => (
          <div key={i} className='grid grid-cols-7 sm:grid-cols-8 items-center justify-center h-9'>
            <p className={`col-span-1 text-sm sm:text-base`}>{el.day}</p>
            <div className='flex justify-center items-center'>
              <WeatherIcon code={el.code} probability={el.probability} />
            </div>
            <p className={`col-span-1 text-sm sm:text-base text-center`}>{el.min}°</p>
            <div className={`col-span-3 sm:col-span-4 relative h-2 rounded-full overflow-hidden bg-black/40`}>
              <div
                className="absolute inset-0 rounded-full"
                style={barRange(el.min, el.max)}
              />
            </div>
            <p className={`col-span-1 text-sm sm:text-base text-center`}>{el.max}°</p>
          </div>
        ))}
      </div>
    </Box>
  )
}