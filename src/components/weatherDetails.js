"use client"

import { param } from '@/lib/param'
import { useState } from 'react'
import { X } from 'lucide-react'
import Forecast from './weatherBox/forecast'
import Precipitation from './weatherBox/precipitation'
import Sunrise from './weatherBox/sunrise'
import Visibility from './weatherBox/visibility'
import Wind from './weatherBox/wind'
import Humidity from './weatherBox/humidity'
import Pressure from './weatherBox/pressure'
import WeeklyBox from './weatherGraph/weeklyBox'
import Tmperature from './weatherBox/temperature'
import Irradiance from './weatherBox/irradiance'

export default function WeatherDetails({ open, forecast, daily, index, indexD, setOpen, clicked }) {
  const [display, setDisplay] = useState(null)
  const [boxClicked, setBoxClicked] = useState(false)

  return (
    <div className='relative w-dvw h-dvh'>
      <div className={`scrollbar-hide ${param.weatherBoxheight} ${param.weatherBoxStyles} ${open ? 'opacity-100' : 'opacity-0'}
        flex flex-wrap content-start items-start overflow-scroll gap-3 p-2 pt-[1px] sm:p-4 pb-12 duration-500
        `}>
        <Forecast hourly={forecast} />
        <Tmperature hourly={forecast} index={index} setDisplay={setDisplay} setBoxClicked={setBoxClicked} />
        <Precipitation hourly={forecast} index={index} indexD={indexD} setDisplay={setDisplay} setBoxClicked={setBoxClicked} />
        <Irradiance hourly={forecast.metrics.global_irradiance_1h} index={index} setDisplay={setDisplay} setBoxClicked={setBoxClicked} />
        <Sunrise daily={daily} hourly={forecast} index={index} indexD={indexD} setDisplay={setDisplay} setBoxClicked={setBoxClicked} />
        <Wind hourly={forecast} index={index} setDisplay={setDisplay} setBoxClicked={setBoxClicked} />
        <Visibility hourly={forecast} index={index} setDisplay={setDisplay} setBoxClicked={setBoxClicked} />
        <Humidity hourly={forecast} index={index} setDisplay={setDisplay} setBoxClicked={setBoxClicked} />
        <Pressure hourly={forecast.metrics.surface_pressure} index={index} setDisplay={setDisplay} setBoxClicked={setBoxClicked} />
      </div>

      {open &&
        <button onClick={() => {
          setOpen(false)
          clicked(false)
        }}
          className='absolute right-3 bottom-3 text-white p-2 bg-black/50 outline outline-black rounded-full cursor-pointer'><X />
        </button>}

      <WeeklyBox
        boxClicked={boxClicked} setBoxClicked={setBoxClicked}
        display={display} setDisplay={setDisplay} index={index} indexD={indexD}
        daily={daily} hourly={forecast}
      />
    </div>
  )
}