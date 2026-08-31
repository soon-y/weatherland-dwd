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

    const date = new Intl.DateTimeFormat('sv-SE', { timeZone: timezone }).format(new Date())
    let cancelled = false
    let retryTimer

    const INITIAL_WAIT = 100000
    const RETRY_INTERVAL = 5000
    const MAX_ELAPSED = 5 * 60000
    const startTime = Date.now()
    let attemptCount = 0
    let hasShownData = false

    const fetchInfo = async () => {
      try {
        const res = await fetch(
          `/api/forecast?lat=${lat}&lon=${lon}&date=${date}&timezone=${timezone}&offset=${offset}`
        )
        const data = await res.json()
        if (cancelled) return

        if (!hasShownData || !data.stale) {
          setForecastData(data)
          hasShownData = true
        }

        const elapsed = Date.now() - startTime
        console.log(`[${Math.round(elapsed / 1000)}s]`, data.stale ? 'stale' : 'fresh')

        if (data.stale && elapsed < MAX_ELAPSED) {
          const nextDelay = attemptCount === 0 ? INITIAL_WAIT : RETRY_INTERVAL
          attemptCount += 1
          retryTimer = setTimeout(fetchInfo, nextDelay)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchInfo()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
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