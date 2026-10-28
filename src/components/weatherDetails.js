"use client"

import { param } from '@/lib/param'
import { useState } from 'react'
import { X } from 'lucide-react'
import Forecast from './weatherCard/forecast'
import Precipitation from './weatherCard/precipitation'
import Sunrise from './weatherCard/sunrise'
import Visibility from './weatherCard/visibility'
import Wind from './weatherCard/wind'
import Humidity from './weatherCard/humidity'
import Pressure from './weatherCard/pressure'
import WeeklyCard from './weatherGraph/weeklyCard'
import Temperature from './weatherCard/temperature'
import Sunshine from './weatherCard/sunshine'

export default function WeatherDetails({ open, forecast, daily, index, indexD, setOpen, clicked, timezone }) {
  const [display, setDisplay] = useState(null)
  const [cardClicked, setCardClicked] = useState(false)

  return (
    <div className='relative w-dvw h-dvh'>
      <div className={`scrollbar-hide ${param.weatherCardheight} ${param.weatherCardStyles} ${open ? 'opacity-100' : 'opacity-0'}
        flex flex-wrap content-start items-start overflow-scroll gap-3 p-2 pt-[1px] sm:p-4 pb-12 duration-500
        `}>
        {open && <div className='fixed left-0 w-full h-full z-0' onClick={() => {
          setOpen(false)
          clicked(false)
        }}></div>
        }
        <Forecast hourly={forecast} />
        <Temperature hourly={forecast} index={index} setDisplay={setDisplay} setCardClicked={setCardClicked} />
        <Precipitation hourly={forecast} index={index} indexD={indexD} setDisplay={setDisplay} setCardClicked={setCardClicked} />
        <Sunshine hourly={forecast.metrics.sunshine_duration_1h} index={index} setDisplay={setDisplay} setCardClicked={setCardClicked} />
        <Sunrise daily={daily} hourly={forecast} index={index} indexD={indexD} setDisplay={setDisplay} setCardClicked={setCardClicked} />
        <Wind hourly={forecast} index={index} setDisplay={setDisplay} setCardClicked={setCardClicked} />
        <Visibility hourly={forecast} index={index} setDisplay={setDisplay} setCardClicked={setCardClicked} />
        <Humidity hourly={forecast} index={index} setDisplay={setDisplay} setCardClicked={setCardClicked} />
        <Pressure hourly={forecast.metrics.surface_pressure} index={index} setDisplay={setDisplay} setCardClicked={setCardClicked} />
      </div>

      {open &&
        <button onClick={() => {
          setOpen(false)
          clicked(false)
        }}
          className='absolute right-3 bottom-3 text-white p-2 bg-black/50 outline outline-black rounded-full cursor-pointer'><X />
        </button>}

      <WeeklyCard
        cardClicked={cardClicked} setCardClicked={setCardClicked}
        display={display} setDisplay={setDisplay} index={index} indexD={indexD}
        daily={daily} hourly={forecast} timezone={timezone}
      />
    </div>
  )
}