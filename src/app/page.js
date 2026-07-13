"use client"

import { useState, useEffect } from 'react'
import World from '@/components/World/World'
import Slider from '@/components/Slider'
import { fetchForecast } from '@/app/api/weather/fetchWeatherForecast'
import InputArea from '@/components/InputLocation'
import WeatherInfo from '@/components/weatherInfo'
import { param } from '@/lib/param'
import { processForecast } from '@/lib/dataProcess'

export default function Home() {
  const [dailyData, setDailyData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [{ lat, lon, timezone, offset }, setGeolocation] = useState({ lat: 53, lon: 10, timezone: null, offset: null })
  const [index, setIndex] = useState(null)
  const [infoClicked, setInfoClicked] = useState(false)

  useEffect(() => {
    if (!(lat && lon && timezone)) return

    const fetchInfo = async () => {
      try {
        const data = await fetchForecast(lat, lon, timezone)
        if (data) {
          if (data.daily !== null) {
            setDailyData(data.daily.daily)
            if (data.forecast !== null) {
              setForecastData(processForecast(data.forecast.data, offset, data.daily.daily))
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchInfo()
  }, [lat, lon, timezone, offset])

  return (
    <div className='w-screen h-dvh overflow-hidden'>
      <World hourly={forecastData} daily={dailyData} index={index} />

      <div className='fixed bottom-0 w-full p-2'>
        {forecastData && dailyData ?
          <Slider forecast={forecastData} daily={dailyData} setIndex={setIndex} index={index} timezone={timezone} />
          :
          <div className={`${param.sliderStyles} bg-white/10 animate-pulse opacity-40`} style={{ height: param.sliderHeight + 'px' }}>
          </div>
        }
      </div>

      <div className='fixed top-0'>
        {(index != null && isFinite(index) && forecastData && dailyData) ?
          <WeatherInfo forecast={forecastData} daily={dailyData} index={index} clicked={setInfoClicked} />
          :
          <div className={`m-2 animate-pulse w-36 h-36 rounded-xl bg-white/10`}></div>
        }
      </div>

      {<div className='fixed top-0 right-0'>
        <InputArea setGeolocation={setGeolocation} hide={!infoClicked} />
      </div>}
    </div>
  )
}