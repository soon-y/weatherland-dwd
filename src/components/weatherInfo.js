"use client"

import { useState, useEffect } from 'react'
import { getTimeIndex, getWindDirectionArrow, visibilityInfo } from '@/lib/param'
import WeatherDetails from './weatherDetails'
import WeatherIcon from './weatherIcon'
import InfoBox from './weatherInfoBox'
import { motion } from 'framer-motion'

export default function WeatherInfo({ forecast, index, clicked }) {
  const [open, setOpen] = useState(false)
  const [indexD, setIndexD] = useState(0)
  const [index12, setIndex12] = useState(0)
  const daily = forecast.daily
  const temperature = forecast.metrics.temperature_2m
  const windSpeed = forecast.metrics.wind_speed_10m.forecast[index]
  const windDirection = forecast.metrics.wind_direction_10m.forecast[index]
  const prob = forecast.metrics.ww_prob_precip_1h
  const rain = forecast.metrics.precip_amount_1h
  const visibility = forecast.metrics.visibility.forecast[index] / 1000
  const isDay = forecast.metrics.is_day.forecast[index]
  const sunriseToday = indexD < 0 ? daily.sunrise[0] : daily.sunrise[indexD]
  const sunriseNext = indexD === 6 ? daily.sunrise[indexD] : daily.sunrise[indexD + 1]
  const sunsetToday = daily.sunset[indexD]
  const sunriseTimeToday = new Date(sunriseToday)
  const sunsetTimeToday = new Date(sunsetToday)
  const currentHour = String(index % 24).padStart(2, '0')
  const now = new Date(daily.time[indexD] + 'T' + currentHour + ':00')
  const weatherCode12h = forecast.metrics.weather_code_priority_12h

  useEffect(() => {
    const tempIndex = daily.time.findIndex(el => el === forecast.timestamps[index].split("T")[0])
    setIndexD(tempIndex)

    const index24 = getTimeIndex(forecast.timestamps[index], weatherCode12h.timestamps)
    setIndex12(index24)
  }, [index])

  return (
    <div>
      <div
        className={`text-white duration-400 ease-in-out backdrop-blur-xl fixed left-0 bg-black/60 overflow-hidden
        ${open ? "w-[100vw] h-[100vh]" : "w-0 h-0"}
      `}>
        <WeatherDetails
          open={open} forecast={forecast} daily={daily}
          index={index} indexD={indexD} setOpen={setOpen} clicked={clicked}
        />
      </div>

      <div onClick={() => {
        setOpen(true)
        clicked(true)
      }}
        className={`fixed top-0 m-2 px-2 pt-0 pb-2 select-none grid text-white font-semibold gap-1 rounded-xl
          ${open ? "bg-white/0" : "bg-black/20 backdrop-blur-xl"}
          ${!open && "hover:outline cursor-pointer "}
          ${!open && (isDay ? "hover:outline-black/50" : "hover:outline-white/50")}
      `}>
        <div className={`flex w-full gap-2 items-center h-8 duration-500 
        ${!open && 'justify-between'}
          ${isDay && !open ? 'text-black' : 'text-white'}`}
        >
          <p className='font-bold text-base sm:text-lg'>{
            new Date(forecast.timestamps[index]).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short"
            }).replace(",", "")}
          </p>
          <div>
            {!open ?
              <WeatherIcon code={weatherCode12h.forecast[index12]} probability={null} isDay={isDay} background={true} />
              :
              <span className='text-base sm:text-lg'>{forecast.timestamps[index].slice(11, 16)}</span>
            }
          </div>
        </div>

        <motion.div layout className={`grid gap-1 duration-500
          ${open && 'hidden'} 
          ${isDay ? 'text-black' : 'text-white'}`}
        >
          <InfoBox title={'temperature'} isDay={isDay}
            info1={temperature.forecast[index]} unit1={temperature.unit}
          />

          <InfoBox title={'precipitation'} isDay={isDay}
            info1={prob.forecast[index]} unit1={prob.unit}
            info2={rain.forecast[index]} unit2={rain.unit}
            condition={rain[index] > 0}
          />

          <InfoBox title={'wind'} isDay={isDay}
            info1={windSpeed} unit1={'km/h'}
            info2={getWindDirectionArrow(windDirection, 18)}
            condition={windSpeed > 15}
          />

          <InfoBox title={'visibility'} isDay={isDay}
            info1={visibilityInfo(visibility).state}
            info2={visibility} unit2={'km'}
            condition={visibility < 5}
          />

          <InfoBox title={'sunrise'} isDay={isDay}
            info1={sunriseToday.split('T')[1]}
            condition={now < sunriseTimeToday}
          />

          <InfoBox title={'sunset'} isDay={isDay}
            info1={sunsetToday.split('T')[1]}
            condition={sunriseTimeToday <= now && now < sunsetTimeToday}
          />

          <InfoBox title={'sunrise'} isDay={isDay}
            info1={sunriseNext.split('T')[1]}
            condition={sunsetTimeToday <= now}
          />
        </motion.div>
      </div>
    </div>
  )
}
