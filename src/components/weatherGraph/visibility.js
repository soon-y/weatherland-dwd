import { useEffect, useState } from "react";
import WeeklyLineGraphCard from "./graphCard/weeklyLineGraphCard";
import { getAvgArr, param, visibilityInfo } from "@/lib/param";

export default function WeeklyVisibility({ display, hourly, indexW, index, timezone }) {
  const [hoverIndex, setHover] = useState(index)
  const [avg, setDailyAvg] = useState([])
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 24
  const maxVal = Math.max(50000, param.max(hourly, 1000))
  const value = hourly?.[hoverIndex]
  const isless4k = value / 1000 < 4
  const current = isless4k ? value : (value / 1000).toFixed(1)
  const unit = isless4k ? 'm' : 'km'

  useEffect(() => {
    setDailyAvg(getAvgArr(hourly))
  }, [hourly])

  useEffect(() => {
    setHover(index)
  }, [indexW])

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        {
          validIndex ? <span>{hoverIndex - indexW * 24}:00 - {(hoverIndex - indexW * 24 + 1) % 24}:00</span> : <span>Average</span>
        }

        <div className="text-2xl flex gap-2 justify-between">
          {
            validIndex ? (
              <>
                {current != null ? (
                  <>
                    <span className="font-bold">
                      {visibilityInfo(value).state}
                    </span>
                    <span>
                      {current}
                      <span className="ml-1 text-lg">
                        {unit}
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="text-lg mt-1">N/A</span>
                )}
              </>
            ) : (
              avg[indexW] != null ? (
                <>
                  <span className="font-bold">
                    {visibilityInfo(avg[indexW]).state}
                  </span>
                  <span>
                    {avg[indexW] < 4000
                      ? Math.round(avg[indexW])
                      : (avg[indexW] / 1000).toFixed(1)}
                    <span className="ml-1 text-lg">
                      {avg[indexW] < 4000 ? 'm' : 'km'}
                    </span>
                  </span>
                </>
              ) : (
                <span className="text-lg mt-1">N/A</span>
              )
            )
          }
        </div>
      </div>

      <WeeklyLineGraphCard
        display={display} unit={'km'} min={0} max={maxVal} step={maxVal * 0.2} timezone={timezone}
        hourly={hourly} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}