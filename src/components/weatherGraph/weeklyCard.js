import { param, weeklyArr } from "@/lib/param"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import WeeklyVisibility from "./visibility"
import WeeklyHumidity from "./humidity"
import WeeklyPressure from "./pressure"
import WeeklySunshine from "./sunshine"
import WeeklyWind from "./wind"
import WeeklyTemperature from "./temperature"
import WeeklyPrecipitation from "./precipitation"
import DailySun from "./dailySun"
import CardTitle from "../weatherCard/cardTitle"

export default function WeeklyCard({ cardClicked, setCardClicked, display, setDisplay, daily, hourly, indexD, index, timezone }) {
  const [weekly, setWeekly] = useState([])
  const [indexW, setIndexW] = useState(Math.max(0, indexD))
  const firstDay = daily.time[0]

  const startIndex = hourly.timestamps.findIndex(
    timestamp => timestamp.slice(0, 10) >= firstDay
  )

  const firstTimestamp = startIndex >= 0
    ? hourly.timestamps[startIndex]
    : `${firstDay}T00:00:00`

  const selectedTimestamp = hourly.timestamps[index]
  const selectedDayIndex = daily.time.indexOf(
    selectedTimestamp?.slice(0, 10)
  )

  const firstIndex = selectedDayIndex >= 0
    ? selectedDayIndex * 24 +
    Number(selectedTimestamp.slice(11, 13))
    : -1

  const alignHourly = values =>
    weeklyArr(
      startIndex >= 0 ? values?.slice(startIndex) : [],
      firstTimestamp
    )

  useEffect(() => {
    const days = (daily.time ?? []).slice(0, 7).map(date => {
      const dayIndex = new Date(`${date}T00:00:00Z`).getUTCDay()

      return {
        day: param.daysShort[dayIndex],
        day3: param.days[dayIndex],
        date: Number(date.slice(8, 10))
      }
    })

    setWeekly(days)
  }, [daily.time])

  useEffect(() => {
    setIndexW(indexD)
  }, [display, indexD])

  return (
    <>
      <div className={`${param.weatherCardheight} ${param.weatherCardStyles} z-1000 px-2 duration-500 ease-in-out ${cardClicked ? 'top-12 opacity-100' : 'top-[100%] opacity-0'}`}>
        {cardClicked && <div className='fixed left-0 w-full h-full z-0' onClick={() => {
          setCardClicked(false)
          setTimeout(() => {
            setDisplay(null)
            setIndexW(indexD)
          }, 300)
        }}></div>
        }
        <div className={`h-full w-full rounded-t-xl backdrop-blur-2xl bg-black/80 overflow-y-auto select-none scrollbar-hide`}>
          <div className="px-4 py-4 sm:py-6 sm:px-16">
            <div className="mb-4 flex justify-center">
              <CardTitle title={display} />
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-4">
              {weekly.map((el, i) => (
                <div key={i} onClick={() => setIndexW(i)} className="cursor-pointer">
                  <p className="flex items-center justify-center mb-1 sm:mb-2">{el.day}</p>
                  <p className={`text-sm sm:text-base flex items-center justify-center aspect-square outline outline-white/50 rounded-full duration-500 
                ${i == indexW && 'font-bold bg-white/80 text-black'}`
                  }>
                    {el.date}
                  </p>
                </div>
              ))}
            </div>

            {display === 'visibility' &&
              <WeeklyVisibility
                display={display} indexW={indexW} index={firstIndex} timezone={timezone}
                hourly={alignHourly(hourly.metrics.visibility.forecast, firstTimestamp)}
              />
            }
            {display === 'humidity' &&
              <WeeklyHumidity
                indexW={indexW} index={firstIndex} timezone={timezone}
                humidity={alignHourly(hourly.metrics.relative_humidity.forecast, firstTimestamp)}
                dewPoint={alignHourly(hourly.metrics.dewpoint_2m.forecast, firstTimestamp)}
                temp={alignHourly(hourly.metrics.temperature_2m.forecast, firstTimestamp)}
              />
            }
            {display === 'pressure' &&
              <WeeklyPressure
                display={display} indexW={indexW} index={firstIndex} timezone={timezone}
                hourly={alignHourly(hourly.metrics.surface_pressure.forecast, firstTimestamp)}
              />
            }
            {display === 'sunshine' &&
              <WeeklySunshine
                display={display} indexW={indexW} index={firstIndex} timezone={timezone}
                hourly={alignHourly(hourly.metrics.sunshine_duration_1h.forecast, firstTimestamp)}
                isDay={alignHourly(hourly.metrics.is_day?.forecast)}
              />
            }
            {display === 'wind' &&
              <WeeklyWind
                display={display} indexW={indexW} index={firstIndex} timezone={timezone}
                wind={alignHourly(hourly.metrics.wind_speed_10m?.forecast, firstTimestamp)}
                gusts={alignHourly(hourly.metrics.wind_gust_max_1h?.forecast, firstTimestamp)}
                code={alignHourly(hourly.metrics.wind_direction_10m?.forecast, firstTimestamp)} />
            }
            {display === 'temperature' &&
              <WeeklyTemperature
                display={'temperature'} indexW={indexW} index={firstIndex} timezone={timezone}
                hourly={alignHourly(hourly.metrics.temperature_2m?.forecast, firstTimestamp)}
                code={alignHourly(hourly.metrics.weather_code?.forecast, firstTimestamp)}
                isDay={alignHourly(hourly.metrics.is_day?.forecast, firstTimestamp)} />
            }
            {display === 'precipitation' &&
              <WeeklyPrecipitation display={'precipitation'}
                hourProbability={alignHourly(hourly.metrics.ww_prob_precip_1h?.forecast, firstTimestamp)}
                hourPrecipitation={alignHourly(hourly.metrics.precip_amount_1h?.forecast, firstTimestamp)}
                code={alignHourly(hourly.metrics.weather_code?.forecast, firstTimestamp)}
                indexW={indexW} index={firstIndex} timezone={timezone}
              />
            }
            {display === 'daily sun' &&
              <DailySun
                display={display} indexW={indexW} setIndexW={setIndexW} timezone={timezone}
                sunrise={daily.sunrise} sunset={daily.sunset} weekly={weekly}/>
            }
          </div>
        </div>
      </div>

      {cardClicked && <button onClick={() => {
        setCardClicked(false)
        setTimeout(() => {
          setDisplay(null)
          setIndexW(indexD)
        }, 300)
      }}
        className='z-10000 fixed right-3 bottom-3 text-white p-2 bg-black/50 outline outline-black rounded-full cursor-pointer'><X />
      </button>}
    </>
  )
}