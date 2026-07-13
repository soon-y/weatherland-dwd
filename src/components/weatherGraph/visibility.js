import { useEffect, useState } from "react";
import WeeklyGraphBox from "./graphBox/weeklyLineGraphBox";
import { getAvgArr, param, visibilityInfo } from "@/lib/param";

export default function WeeklyVisibility({ display, hourly, indexW, index }) {
  const [hoverIndex, setHover] = useState(index)
  const [avg, setDailyAvg] = useState([])
  const value = hourly[hoverIndex]
  const current = value == null ? value : Math.floor(value / 1000)
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const maxVal = Math.max(50000, param.max(hourly))
  const unit = 'km'

  useEffect(() => {
    const result = getAvgArr(hourly, 1000)

    for (let i = 0; i < hourly.length; i += 24) {
      const chunk = hourly.slice(i, i + 24)

      if (chunk.some(value => value == null)) {
        result.push(null)
      } else {
        const sum = chunk.reduce((a, b) => a + b, 0)
        result.push(Math.round((sum / chunk.length) / 1000))
      }
    }
    setDailyAvg(result)
  }, [])

  useEffect(() => {
    setHover()
  }, [indexW])

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        {
          validIndex ? <span>{hoverIndex - indexW * 24}:00</span> : <span>Average</span>
        }

        <div className="text-2xl flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <span className="font-bold">{visibilityInfo(current).state}</span>
                <span>{current}
                  <span className={`text-lg ${current == null ? 'opacity-0' : ''}`}>
                    {unit}
                  </span>
                </span>
              </>
              :
              <>
                <span className="font-bold">{visibilityInfo(avg[indexW]).state}</span>
                <span>{avg[indexW]}
                  <span className={`text-lg ${avg[indexW] == null ? 'opacity-0' : ''}`}>
                    {unit}
                  </span>
                </span>
              </>
          }
        </div>
      </div>

      <WeeklyGraphBox
        display={display} unit={unit} min={0} max={maxVal} step={maxVal * 0.2}
        hourly={hourly} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}