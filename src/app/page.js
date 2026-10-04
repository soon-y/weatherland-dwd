"use client"

import { useState, useEffect } from 'react'
import World from '@/components/World/World'
import Slider from '@/components/Slider'
import InputArea from '@/components/InputLocation'
import WeatherInfo from '@/components/weatherInfo'
import { param } from '@/lib/param'
import Image from 'next/image'

export default function Home() {
  const [forecastData, setForecastData] = useState(null)
  const [{ lat, lon, timezone, offset }, setGeolocation] = useState({ lat: 53, lon: 10, timezone: null, offset: null })
  const [index, setIndex] = useState(null)
  const [infoClicked, setInfoClicked] = useState(false)
  const [resOk, setResOk] = useState(true)
  const [isStale, setIsStale] = useState(true)

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
          `/api/forecast?lat=${lat}&lon=${lon}&date=${date}&timezone=${encodeURIComponent(timezone)}&offset=${offset}`
        )
        if (!res.ok) {
          setResOk(false)
          throw new Error("Unable to load weather data. Please try again later.")
        }

        const data = await res.json()
        if (cancelled) return

        if (!hasShownData || !data.stale) {
          setIsStale(data.stale)
          setForecastData(data)
          hasShownData = true
        }

        const elapsed = Date.now() - startTime
        //console.log(`[${Math.round(elapsed / 1000)}s]`, data.stale ? 'stale' : 'fresh')

        if (data.stale && elapsed < MAX_ELAPSED) {
          const nextDelay = attemptCount === 0 ? INITIAL_WAIT : RETRY_INTERVAL
          attemptCount += 1
          retryTimer = setTimeout(fetchInfo, nextDelay)
        }
      } catch (err) {
        if (cancelled) return
        setResOk(false)
        console.error(err)
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
          <Slider forecast={forecastData} setIndex={setIndex} index={index} timezone={timezone} isStale={isStale}/>
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

      {!resOk && (
        <div className="border animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md flex flex-col items-center gap-1 p-4 backdrop-blur-sm rounded-lg select-none">
          <Image
            className="w-[50px] h-auto"
            src="/textures/face/sad.svg"
            width={100}
            height={100}
            alt="freeze face"
          />
          <p className="text-center text-white">
            Unable to load weather data. Please try again later.
          </p>
        </div>
      )}
    </div>
  )
}