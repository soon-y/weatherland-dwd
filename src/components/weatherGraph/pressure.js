import { useEffect, useState } from "react";
import WeeklyGraphBox from "./graphBox/weeklyLineGraphBox";
import { getAvgArr, param, pressure } from "@/lib/param";

export default function WeeklyPressure({ display, hourly, indexW, index }) {
  const [hoverIndex, setHover] = useState(index)
  const [avg, setDailyAvg] = useState([])
  const current = hourly[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const unit = 'hPa'
  const minVal = Math.min(960, param.min(hourly))
  const maxVal = Math.max(1060, param.max(hourly))
  const isNull = current == null

  useEffect(() => {
    const result = getAvgArr(hourly)
    setDailyAvg(result)
  }, [])

  useEffect(() => {
    setHover(index)
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
                {!isNull && <span>{current}<span className="text-lg"> {unit}</span></span>}
                <span className={`${current == null ? 'opacity-0' : ''}`}>
                    {pressure(current)}
                  </span>
              </>
              :
              <>
                <span>{avg[indexW]}<span className="text-lg"> {unit}</span></span>
                <span>{pressure(current)}</span>
              </>
          }
        </div>
      </div>

      <WeeklyGraphBox
        display={display} unit={unit} min={minVal} max={maxVal} step={(maxVal - minVal) * 0.2}
        hourly={hourly} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}