import { useEffect, useState } from "react"
import { getAvgArr, getTotalSumArr, param, precipIntensity, weatherInfo } from "@/lib/param"
import WeeklyBarGraphCard from "./graphCard/weeklyBarGraphCard"
import WeeklyLineGraphCard from "./graphCard/weeklyLineGraphCard"

export default function WeeklyPrecipitation({ display, indexW, index, hourProbability, hourPrecipitation, code }) {
  const [hoverIndex, setHover] = useState(index)
  const [dailyTotal, setDailyTotal] = useState([])
  const [dailyMean, setDailyMean] = useState([])
  const [type, setType] = useState('')
  const probability = hourProbability?.[hoverIndex]
  const precipitation = hourPrecipitation?.[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const maxVal = Math.max(10, param.max(hourPrecipitation, 10))
  let unit = 'mm'

  useEffect(() => {
    const resultTotal = hourPrecipitation && getTotalSumArr(hourPrecipitation)
    const resultMean = probability && getAvgArr(hourProbability)

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
          {validIndex ? (
            <>
              <span>{hoverIndex - indexW * 24}:00</span>
              {precipitation > 0 && (
                <span className="capitalize">{type}</span>
              )}
            </>
          ) : (
            <>
              <span>Probability mean</span>
              <span>Total</span>
            </>
          )}
        </div>

        <div className="text-2xl flex gap-2 justify-between">
          {validIndex ? (
            <>
              {probability != null ? (
                <div>
                  {probability}
                  <span className="text-lg"> %</span>
                </div>
              ) : (
                <p className="text-lg mt-1">N/A</p>
              )}

              {precipitation != null ? (
                <div>
                  <span className="capitalize text-lg">
                    {precipIntensity(type, precipitation)}{' '}
                  </span>

                  {precipitation > 0 && (
                    <>
                      {precipitation}
                      <span className="text-base"> {unit}</span>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-lg mt-1">N/A</p>
              )}
            </>
          ) : (
            <>
              {dailyMean?.[indexW] != null ? (
                <div>
                  {dailyMean[indexW]}
                  <span className="text-base"> %</span>
                </div>
              ) : (
                <p className="text-lg mt-1">N/A</p>
              )}

              {dailyTotal?.[indexW] != null ? (
                <div>
                  {dailyTotal[indexW]}
                  <span className="text-base"> {unit}</span>
                </div>
              ) : (
                <p className="text-lg mt-1">N/A</p>
              )}
            </>
          )}
        </div>
      </div>
      <WeeklyLineGraphCard ratio={2} graphRatio={2}
        display={'probability'} unit={'%'} min={0} max={100} step={20}
        hourly={hourProbability} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />

      <WeeklyBarGraphCard ratio={2}
        display={display} unit={unit} min={0} max={maxVal} step={maxVal * 0.2}
        hourly={hourPrecipitation} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}