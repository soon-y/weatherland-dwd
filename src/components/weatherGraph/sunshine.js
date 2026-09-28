import { useEffect, useState } from "react";
import WeeklyGraphBox from "./graphBox/weeklyLineGraphBox";
import { getAvgArrDaytime, sunshineDuration } from "@/lib/param";

export default function WeeklySunshine({ display, hourly, indexW, index, }) {
  const [hoverIndex, setHover] = useState(index)
  const [avg, setDailyAvg] = useState([])
  const current = hourly[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const maxVal = 60 * 60
  const unit = 'mins'

  useEffect(() => {
    const result = getAvgArrDaytime(hourly)
    setDailyAvg(result)
  }, [])

  useEffect(() => {
    setHover(index)
  }, [indexW])

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        {
          validIndex ?
            <span>{hoverIndex - indexW * 24}:00</span> :
            <span>Average during daytime</span>
        }

        <div className="text-2xl flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <span className="font-bold">{sunshineDuration(current).state}</span>
                <span>{current / 60}
                  <span className={`text-base ${current == null ? 'opacity-0' : ''}`}> {unit}</span>
                </span>
              </>
              :
              <span>
                <span>{Math.floor(avg[indexW] / 60)}<span className="text-lg"> mins</span></span>
              </span>
          }
        </div>
      </div>

      <WeeklyGraphBox
        display={display} unit={'seconds'} min={0} max={maxVal} step={(maxVal) / 6}
        hourly={hourly} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}