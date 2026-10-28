import { useEffect, useState } from "react";
import WeeklyLineGraphCard from "./graphCard/weeklyLineGraphCard";
import { getAvgArr, param } from "@/lib/param";

export default function WeeklyHumidity({ humidity, indexW, index, dewPoint, temp, timezone }) {
  const [hoverIndex, setHover] = useState(index)
  const [avg, setDailyAvg] = useState([])
  const current = humidity[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 24
  const minVal = Math.min(param.minInTwo(dewPoint, temp, 10))
  const maxVal = Math.max(param.maxInTwo(dewPoint, temp, 10))
  const isNull = current == null
  let unit = '%'

  useEffect(() => {
    const result = getAvgArr(humidity)
    setDailyAvg(result)
  }, [humidity])

  useEffect(() => {
    setHover(index)
  }, [indexW])

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        <div className="flex gap-2 justify-between">
          {validIndex ? (
            <>
              <span>{hoverIndex - indexW * 24}:00 - {(hoverIndex - indexW * 24 + 1) % 24}:00</span>
              {!isNull && <span>Dew point / <span className="text-gray-400">Temperature</span></span>}
            </>
          ) : (
            <span>Average</span>
          )}
        </div>

        <div className="text-2xl flex gap-2 justify-between">
          {validIndex ? (
            <>
              {current != null ? (
                <div>
                  {current}
                  <span className="text-lg"> {unit}</span>
                </div>
              ) : (
                <span className="text-lg mt-1">N/A</span>
              )}

              {!isNull && (
                <p>
                  {dewPoint[hoverIndex]}
                  <span className="text-base"> °C</span>
                  {' / '}
                  <span className="text-gray-400">
                    {temp[hoverIndex]}
                    <span className="text-base"> °C</span>
                  </span>
                </p>
              )}
            </>
          ) : (
            avg[indexW] != null ? (
              <span>
                {avg[indexW]}
                <span className="text-lg"> {unit}</span>
              </span>
            ) : (
              <span className="text-lg mt-1">N/A</span>
            )
          )}
        </div>
      </div>

      <WeeklyLineGraphCard ratio={2} graphRatio={2} timezone={timezone}
        display={'humidity'} unit={unit} min={0} max={100} step={20}
        hourly={humidity} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />

      <div className="w-full h-2"></div>

      <WeeklyLineGraphCard ratio={2} graphRatio={2} timezone={timezone}
        display={'dewpoint'} unit={'°C'} min={minVal} max={maxVal} step={5} hourly2={temp}
        hourly={dewPoint} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}