import { useEffect, useState } from "react";
import WeeklyGraphBox from "./graphBox/weeklyLineGraphBox";
import { getMaxArr, getWindLevel, param } from "@/lib/param";

export default function WeeklyWind({ display, indexW, index, wind, gusts, code }) {
  const [hoverIndex, setHover] = useState(index)
  const [dailyWind, setDailyWindAvg] = useState([])
  const [dailyGust, setDailyGustAvg] = useState([])
  const current = wind[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const maxVal = Math.max(100, param.maxInTwo(wind, gusts))
  const isNull = current == null
  let unit = 'km/h'

  useEffect(() => {
    const resultWind = getMaxArr(wind)
    const resultGust = getMaxArr(gusts)

    setDailyWindAvg(resultWind)
    setDailyGustAvg(resultGust)
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
                {!isNull && <span className="text-gray-400">Gusts</span>}
              </>
              :
              <>
                <span>Max</span>
                <span className="text-gray-400">Gusts Max</span>
              </>
          }
        </div>

        <div className="text-2xl flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <div className="flex gap-2 items-end">
                  {current}
                  <span className={`${current == null ? 'opacity-0' : ''}`}>
                    {unit}
                  </span>
                  <span className="text-lg">{getWindLevel(current)}</span>
                </div>

                <div className="flex gap-2 text-lg text-gray-400 items-end">
                  {gusts[hoverIndex]}
                  <span className={`text-lg ${current == null ? 'opacity-0' : ''}`}>
                    {unit}
                  </span>
                  {getWindLevel(gusts[hoverIndex])}
                </div>
              </>
              :
              <>
                <div className="flex gap-2 items-end">
                  {dailyWind[indexW]} <span> {unit}</span>
                  <span className="text-lg">{getWindLevel(dailyWind[indexW])}</span>
                </div>

                <div className="flex gap-2 text-lg text-gray-400 items-end">
                  {dailyGust[indexW]}
                  <span className="text-base"> {unit}</span>
                  {getWindLevel(dailyGust[indexW])}
                </div>
              </>
          }
        </div>
      </div>
      <WeeklyGraphBox
        display={display} unit={unit} min={0} max={maxVal} step={maxVal * 0.1} hourly2={gusts}
        hourly={wind} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover} code={code}
      />
    </div>
  )
}