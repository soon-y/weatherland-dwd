import { useEffect, useState } from "react";
import WeeklyLineGraphCard from "./graphCard/weeklyLineGraphCard";
import { getAvgArr, param, pressure } from "@/lib/param";

export default function WeeklyPressure({ display, hourly, indexW, index }) {
  const [hoverIndex, setHover] = useState(index)
  const [avg, setDailyAvg] = useState([])
  const current = hourly[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const unit = 'hPa'
  const minVal = Math.min(960, param.min(hourly, 100))
  const maxVal = Math.max(1060, param.max(hourly, 100))

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
        {validIndex ? (
          <span>{hoverIndex - indexW * 24}:00 - {(hoverIndex - indexW * 24 + 1) % 24}:00</span>
        ) : (
          <span>Average</span>
        )}

        <div className="text-2xl flex gap-2 justify-between">
          {validIndex ? (
            current != null ? (
              <>
                <span>
                  {current}
                  <span className="text-lg"> {unit}</span>
                </span>
                <span>{pressure(current)}</span>
              </>
            ) : (
              <span className="text-lg mt-1">N/A</span>
            )
          ) : (
            avg[indexW] != null ? (
              <>
                <span>
                  {avg[indexW]}
                  <span className="text-lg"> {unit}</span>
                </span>
                <span>{pressure(avg[indexW])}</span>
              </>
            ) : (
              <span className="text-lg mt-1">N/A</span>
            )
          )}
        </div>
      </div>

      <WeeklyLineGraphCard
        display={display} unit={unit} min={minVal} max={maxVal} step={(maxVal - minVal) * 0.2}
        hourly={hourly} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}