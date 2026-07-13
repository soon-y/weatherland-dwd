import { useEffect, useState } from "react";
import WeeklyGraphBox from "./graphBox/weeklyLineGraphBox";
import { getAvgArr, param } from "@/lib/param";

export default function WeeklyHumidity({ humidity, indexW, index, dewPoint, temp }) {
  const [hoverIndex, setHover] = useState(index)
  const [avg, setDailyAvg] = useState([])
  const current = humidity[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const minVal = Math.min(param.minInTwo(dewPoint, temp))
  const maxVal = Math.max(param.maxInTwo(dewPoint, temp))
  const isNull = current == null
  let unit = '%'

  useEffect(() => {
    const result = getAvgArr(humidity)
    setDailyAvg(result)
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
                {!isNull && <span>Dew point / Temperature</span>}
              </>
              :
              <span>Average</span>
          }
        </div>

        <div className="text-2xl flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <div>
                  {current}
                  <span className={`text-lg ${current == null ? 'opacity-0' : ''}`}>
                    {unit}
                  </span>
                </div>

                {!isNull && <p>
                  {dewPoint[hoverIndex]} <span className="text-base">°C</span> /
                  <span> {temp[hoverIndex]}
                    <span className="text-base"> °C</span>
                  </span>
                </p>}
              </>
              :
              <>
                <span>{avg[indexW]}{unit}</span>
              </>
          }
        </div>
      </div>

      <WeeklyGraphBox ratio={2} graphRatio={2}
        display={'probability'} unit={unit} min={0} max={100} step={20}
        hourly={humidity} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />

      <WeeklyGraphBox ratio={2} graphRatio={2}
        display={'temperature'} unit={'°C'} min={minVal} max={maxVal} step={5} hourly2={temp}
        hourly={dewPoint} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}