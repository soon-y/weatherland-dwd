import { useEffect, useState } from "react"
import WeeklyGraphBox from "./graphBox/weeklyLineGraphBox"
import { getMaxArr, getMinArr, param } from "@/lib/param"

export default function WeeklyTemperature({ display, hourly, indexW, index, code, isDay }) {
  const [hoverIndex, setHover] = useState(index)
  const [dailyMin, setDailyMin] = useState([])
  const [dailyMax, setDailyMax] = useState([])
  const current = hourly[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const maxVal = param.max(hourly)
  const minVal = param.min(hourly)
  let unit = '°C'

  useEffect(() => {
    const resultMin = getMinArr(hourly)
    const resultMax = getMaxArr(hourly)

    setDailyMin(resultMin)
    setDailyMax(resultMax)
  }, [])

  useEffect(() => {
    setHover(index)
  }, [indexW])

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        <div className="flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <span>{hoverIndex - indexW * 24}:00</span>
              </>
              :
              <>
                <span>Min</span>
                <span>Max</span>
              </>
          }
        </div>

        <div className="text-2xl flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <div>
                  {current}
                  <span className={`text-base ${current == null ? 'opacity-0' : ''}`}>
                    {unit}
                  </span>
                </div>
              </>
              :
              <>
                <div>
                  {dailyMin[indexW]} <span className="text-base">{unit}</span>
                </div>

                <div>
                  {dailyMax[indexW]} <span className="text-base">{unit}</span>
                </div>
              </>
          }
        </div>
      </div>
      <WeeklyGraphBox
        display={display} unit={unit} min={minVal} max={maxVal} step={(maxVal - minVal) * 0.2}
        hourly={hourly} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover} code={code} isDay={isDay}
      />
    </div>
  )
}