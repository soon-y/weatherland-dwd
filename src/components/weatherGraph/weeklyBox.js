import { param, weeklyArr } from "@/lib/param"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import WeeklyVisibility from "./visibility"
import WeeklyHumidity from "./humidity"
import WeeklyPressure from "./pressure"
import WeeklySolarEnergy from "./solarEnergy"
import WeeklyWind from "./wind"
import WeeklyTemperature from "./temperature"
import WeeklyPrecipitation from "./precipitation"
import DailySun from "./dailySun"
import BoxTitle from "../weatherBox/boxTitle"

export default function WeeklyBox({ boxClicked, setBoxClicked, display, setDisplay, daily, hourly, indexD }) {
  const [weekly, setWeekly] = useState([])
  const [indexW, setIndexW] = useState(indexD)
  const today = new Date()
  const firstTimestamp = hourly.timestamps[0]
  const firstIndex = new Date(firstTimestamp).getHours()

  useEffect(() => {
    const weeklyArr = []

    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() + i)

      weeklyArr.push({
        day: param.daysShort[date.getDay()],
        date: date.getDate()
      })
    }

    setWeekly(weeklyArr)
  }, [])

  useEffect(() => {
    setIndexW(indexD)
  }, [display])

  return (
    <div className={`${param.weatherBoxheight} ${param.weatherBoxStyles} px-2 duration-500 ease-in-out ${boxClicked ? 'top-12 opacity-100' : 'top-[100%] opacity-0'}`}>
      <div className={`h-full w-full rounded-t-xl backdrop-blur-2xl bg-black/80 overflow-y-scroll select-none scrollbar-hide`}>
        <div className="px-4 py-4 sm:py-6 sm:px-16">
          <div className="mb-4 flex justify-center">
            <BoxTitle title={display} />
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
              display={display} indexW={indexW} index={firstIndex}
              hourly={weeklyArr(hourly.metrics.visibility.forecast, firstTimestamp)}
            />
          }
          {display === 'humidity' &&
            <WeeklyHumidity
              indexW={indexW} index={firstIndex}
              humidity={weeklyArr(hourly.metrics.relative_humidity.forecast, firstTimestamp)}
              dewPoint={weeklyArr(hourly.metrics.dewpoint_2m.forecast, firstTimestamp)}
              temp={weeklyArr(hourly.metrics.temperature_2m.forecast, firstTimestamp)}
            />
          }
          {display === 'pressure' &&
            <WeeklyPressure
              display={display} indexW={indexW} index={firstIndex}
              hourly={weeklyArr(hourly.metrics.surface_pressure.forecast, firstTimestamp)}
            />
          }
          {display === 'solar energy' &&
            <WeeklySolarEnergy
              display={display} indexW={indexW} index={firstIndex}
              hourly={weeklyArr(hourly.metrics.global_irradiance_1h.forecast, firstTimestamp)}
            />
          }
          {display === 'wind' &&
            <WeeklyWind
              display={display} indexW={indexW} index={firstIndex}
              wind={weeklyArr(hourly.metrics.wind_speed_10m.forecast, firstTimestamp)}
              gusts={weeklyArr(hourly.metrics.wind_gust_max_1h.forecast, firstTimestamp)}
              code={weeklyArr(hourly.metrics.wind_direction_10m.forecast, firstTimestamp)} />
          }
          {display === 'temperature' &&
            <WeeklyTemperature
              display={'temperature'} indexW={indexW} index={firstIndex}
              hourly={weeklyArr(hourly.metrics.temperature_2m.forecast, firstTimestamp)}
              code={weeklyArr(hourly.metrics.weather_code.forecast, firstTimestamp)}
              isDay={weeklyArr(hourly.metrics.is_day.forecast, firstTimestamp)} />
          }
          {display === 'precipitation' &&
            <WeeklyPrecipitation display={'precipitation'}
              hourProbability={weeklyArr(hourly.metrics.ww_prob_precip_1h.forecast, firstTimestamp)}
              hourPrecipitation={weeklyArr(hourly.metrics.precip_amount_1h.forecast, firstTimestamp)}
              code={weeklyArr(hourly.metrics.weather_code.forecast, firstTimestamp)}
              indexW={indexW} index={firstIndex}
            />
          }
          {display === 'daily sun' &&
            <DailySun
              display={display} indexW={indexW} setIndexW={setIndexW}
              sunrise={daily.sunrise} sunset={daily.sunset} daylight={daily.daylight_duration} />
          }
        </div>
      </div>

      <button onClick={() => {
        setBoxClicked(false)
        setTimeout(() => {
          setDisplay(null)
          setIndexW(indexD)
        }, 300)
      }}
        className='absolute right-3 bottom-5 text-white p-2 bg-black/50 outline outline-black rounded-full cursor-pointer'><X />
      </button>
    </div>
  )
}