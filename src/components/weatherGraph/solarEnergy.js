import { useEffect, useState } from "react";
import WeeklyGraphBox from "./graphBox/weeklyLineGraphBox";
import { param, irradiance } from "@/lib/param";

export default function WeeklySolarEnergy({ display, hourly, indexW, index, }) {
  const [hoverIndex, setHover] = useState(index)
  const current = hourly[hoverIndex]
  const validIndex = hoverIndex - indexW * 24 >= 0 && hoverIndex - indexW * 24 < 25
  const maxVal = Math.ceil(Math.max(...hourly) / 100) * 100

  useEffect(() => {
    setHover(index)
  }, [indexW])

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        {
          validIndex ?
            <span>{hoverIndex - indexW * 24}:00</span> :
            <span className="opacity-0">Average</span>
        }

        <div className="text-2xl flex gap-2 justify-between">
          {
            validIndex ?
              <>
                <span className="font-bold">{irradiance(current).state}</span>
                <span>{current}
                  <span className={`text-base ${current == null ? 'opacity-0' : ''}`}> kJ/m<sup>2</sup></span>
                </span>
              </>
              :
              <>
                <span className={`opacity-0`}> kJ/m<sup>2</sup></span>
              </>
          }
        </div>
      </div>

      <WeeklyGraphBox
        display={display} unit={'index'} min={0} max={maxVal} step={(maxVal) * 0.2}
        hourly={hourly} indexW={indexW} index={index} hoverIndex={hoverIndex} setHover={setHover}
      />
    </div>
  )
}