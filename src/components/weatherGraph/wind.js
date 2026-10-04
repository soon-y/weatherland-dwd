import { useEffect, useState } from "react";
import WeeklyGraphBox from "./graphBox/weeklyLineGraphBox";
import { getMaxArr, getWindLevel, param } from "@/lib/param";

export default function WeeklyWind({ display, indexW, index, wind, gusts, code }) {
  const [hoverIndex, setHover] = useState(index)
  const [dailyWind, setDailyWindAvg] = useState([])
  const [dailyGust, setDailyGustAvg] = useState([])
  const current = wind?.[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const maxVal = (wind || gusts) && Math.max(100, param.maxInTwo(wind, gusts))
  let unit = 'km/h'

  useEffect(() => {
    const resultWind = wind && getMaxArr(wind)
    const resultGust = gusts && getMaxArr(gusts)

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
                {gusts && <span className="text-gray-400">Gusts</span>}
              </>
              :
              <>
                <span>Max</span>
                {gusts && <span className="text-gray-400">Gusts Max</span>}
              </>
          }
        </div>

        <div className="text-xl flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <div className="flex gap-2 items-end">
                  {current}
                  <span className='text-base mt-1'>
                    {current ? unit : 'N/A'}
                  </span>
                  <span className="text-base">{getWindLevel(current)}</span>
                </div>

                {gusts?.[hoverIndex] &&
                <div className="flex gap-2 text-lg text-gray-400 items-end">
                  {gusts?.[hoverIndex]}
                  <span className={`text-base ${gusts == null ? 'opacity-0' : ''}`}>
                    {unit}
                  </span>
                  {getWindLevel(gusts[hoverIndex])}
                </div>
                }
              </>
              :
              <>
                {dailyWind?
                  <div className="flex gap-2 items-end">
                  {dailyWind[indexW]} <span> {unit}</span>
                  <span className="text-lg">{getWindLevel(dailyWind[indexW])}</span>
                </div> :
                <div>N/A</div>
                }

                {dailyGust &&
                  <div className="flex gap-2 text-lg text-gray-400 items-end">
                  {dailyGust[indexW]}
                  <span className="text-base"> {unit}</span>
                  {getWindLevel(dailyGust[indexW])}
                </div>
                }
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