"use client"

import { useState, useEffect } from 'react'
import World from '@/components/World/World'
import Slider from '@/components/Slider'
import InputArea from '@/components/InputLocation'
import WeatherInfo from '@/components/weatherInfo'
import { param } from '@/lib/param'

export default function Home() {
  const [forecastData, setForecastData] = useState(null)
  const [{ lat, lon, timezone, offset }, setGeolocation] = useState({ lat: 53, lon: 10, timezone: null, offset: null })
  const [index, setIndex] = useState(null)
  const [infoClicked, setInfoClicked] = useState(false)

  useEffect(() => {
    if (!(lat && lon && timezone)) return

    const date = new Intl.DateTimeFormat('sv-SE', {
      timeZone: timezone,
    }).format(new Date())

    console.log(date)

    const fetchInfo = async () => {
      try {
        const res = await fetch(
          `/api/forecast?lat=${lat}&lon=${lon}&date=${date}&timezone=${timezone}&offset=${offset}`
        )

        const data = await res.json()
        setForecastData(data)

        console.log(data)

      } catch (err) {
        console.log(err)
      }
    }
    fetchInfo()
  }, [lat, lon, timezone, offset])

  return (
    <div className='w-screen h-dvh overflow-hidden'>
      <World forecast={forecastData} index={index} />

      <div className='fixed bottom-0 w-full p-2'>
        {forecastData ?
          <Slider forecast={forecastData} setIndex={setIndex} index={index} timezone={timezone} />
          :
          <div className={`${param.sliderStyles} bg-white/10 animate-pulse opacity-40`} style={{ height: param.sliderHeight + 'px' }}>
          </div>
        }
      </div>

      <div className='fixed top-0'>
        {(index != null && isFinite(index) && forecastData) ?
          <WeatherInfo forecast={forecastData} index={index} clicked={setInfoClicked} />
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