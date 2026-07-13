import { useEffect, useState } from "react"
import { getAvgArr, getTotalSumArr, param, precipIntensity, weatherInfo } from "@/lib/param"
import WeeklyBarGraphBox from "./graphBox/weeklyBarGraphBox"
import WeeklyLineGraphBox from "./graphBox/weeklyLineGraphBox"

export default function WeeklyPrecipitation({ display, indexW, index, hourProbability, hourPrecipitation, code }) {
  const [hoverIndex, setHover] = useState(index)
  const [dailyTotal, setDailyTotal] = useState()
  const [dailyMean, setDailyMean] = useState()
  const [type, setType] = useState('')
  const probability = hourProbability[hoverIndex]
  const precipitation = hourPrecipitation[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const maxVal = Math.max(10, param.max(hourPrecipitation))
  let unit = 'mm' 

  useEffect(() => {
    const resultTotal = getTotalSumArr(hourPrecipitation)
    const resultMean = getAvgArr(hourProbability)

    setDailyTotal(resultTotal)
    setDailyMean(resultMean)
  }, [])

  useEffect(() => {
    setHover(index)
  }, [indexW])

  useEffect(() => {
    setHover(index)

    let weatherType = weatherInfo(code[indexW]).type
    let type =
      weatherType.includes('snow') ? 'snow' :
        weatherType.includes('shower') ? 'shower' :
          weatherType.includes('drizzle') ? 'drizzle' :
            'rain'

    setType(type)
  }, [indexW])

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        <div className="flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <span>{hoverIndex - indexW * 24}:00</span>
                {precipitation > 0 && <span className="capitalize">{type}</span>}
              </>
              :
              <>
                <span>Probability mean</span>
                <span>Total</span>
              </>
          }
        </div>

        <div className="text-2xl flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <div>
                  {probability}
                  <span className={`text-lg ${probability == null ? 'opacity-0' : ''}`}> %</span>
                </div>

                {
                  <div>
                    <span className="capitalize text-lg">{precipIntensity(type, precipitation)} </span>
                    {precipitation > 0 && <>{precipitation} <span className="text-base"> {unit}</span></>
                    }
                  </div>
                }
              </>
              :
              <>
                <div>
                  {dailyMean[indexW]} <span className="text-base">%</span>
                </div>

                <div>
                  {dailyTotal[indexW]}<span className="text-base"> {unit}</span>
                </div>
              </>
          }
        </div>
      </div>
      <WeeklyLineGraphBox ratio={2} graphRatio={2}
        display={'probability'} unit={'%'} min={0} max={100} step={20}
        hourly={hourProbability} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />

      <WeeklyBarGraphBox ratio={2}
        display={display} unit={unit} min={0} max={maxVal} step={maxVal * 0.2}
        hourly={hourPrecipitation} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}