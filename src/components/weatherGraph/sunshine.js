import { useEffect, useState } from "react";
import WeeklyLineGraphCard from "./graphCard/weeklyLineGraphCard";
import { getAvgArrDaytime, sunshineDuration } from "@/lib/param";

export default function WeeklySunshine({ display, hourly, indexW, index, timezone, isDay }) {
  const [hoverIndex, setHover] = useState(index)
  const [avg, setDailyAvg] = useState([])
  const current = hourly[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 24
  const maxVal = 60 * 60
  const unit = 'mins'

  console.log(isDay)
    console.log(hourly)

  useEffect(() => {
    const result = getAvgArrDaytime(hourly, isDay)
    setDailyAvg(result)
  }, [hourly, isDay])

  useEffect(() => {
    setHover(index)
  }, [indexW])

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        {validIndex ? (
          <span>{hoverIndex - indexW * 24}:00 - {(hoverIndex - indexW * 24 + 1) % 24}:00</span>
        ) : (
          <span>Average during daytime</span>
        )}

        <div className="text-2xl flex gap-2 justify-between">
          {validIndex ? (
            current != null ? (
              <>
                <span className="">
                  {current / 60} <span className="text-base"> {unit}</span>
                </span>
                <span className="text-xl mt-1">
                  {sunshineDuration(current).state}
                </span>
              </>
            ) : (
              <span className="mt-1 text-lg">N/A</span>
            )
          ) : (
            avg[indexW] != null ? (
              <span>
                {Math.floor(avg[indexW] / 60)}
                <span className="text-lg"> {unit}</span>
              </span>
            ) : (
              <span className="mt-1 text-lg">N/A</span>
            )
          )}
        </div>
      </div>

      <WeeklyLineGraphCard
        display={display} unit={'mins'} min={0} max={maxVal} step={(maxVal) / 6} timezone={timezone}
        hourly={hourly} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}