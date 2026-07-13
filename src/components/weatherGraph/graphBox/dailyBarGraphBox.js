import { param, todayProgress } from "@/lib/param"
import { useEffect, useState } from "react"

export default function DailyBarGraphBox({ min, max, step, unit, barStart, barEnd, barLength, total, setIndexW, ratio = 1 }) {
  const today = new Date()
  const todayDay = today.getDay()
  const [val, setVal] = useState([])
  const topPos = '48px'
  const isTime = barStart[0].includes('T')
  const borderCnt = (max - min) / step

  useEffect(() => {
    const temp = []

    if (isTime) {
      for (let i = 24; i >= 0; i -= step) {
        temp.push(String(i).padStart(2, '0'))
      }
    } else {
      for (let i = max; i >= min; i -= step) temp.push(i)
    }

    setVal(temp)
  }, [min, max, step])

  function barLength(barStart, barEnd) {
    if (isTime) {
      const start = new Date(barStart)
      const end = new Date(barEnd)
      const diffMs = end - start
      const totalMs = 24 * 60 * 60 * 1000

      return diffMs / totalMs * 100 + '%'
    } else {
      const diff = barEnd - barStart
      return diff / total * 100 + '%'
    }
  }

  return (
    <div className="relative">
      <div className="w-full grid grid-cols-[1fr_24px] relative z-100">
        <div></div>
        <p className="ml-2 py-2 text-sm opacity-70 flex items-center h-12">{unit}</p>
        {/* Graph */}
        <div className="w-full flex relative" style={{ aspectRatio: ratio }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`h-full flex justify-center flex-1`} style={{ alignItems: 'flex-end' }}
              onClick={() => { setIndexW(i) }}
              onMouseOver={() => { setIndexW(i) }}
              onTouchMove={() => { setIndexW(i) }}
            >
              {isTime ?
                <>
                  <div className="relative w-[10px] h-full bg-white/20 rounded-full" />

                  <div className="absolute w-[10px] bg-gradient-to-b from-yellow-500 via-orange-400 to-yellow-500 rounded-full"
                    style={{
                      height: barLength(barStart[i], barEnd[i]),
                      top: 100 - todayProgress(new Date(barEnd[i])) + '%'
                    }}>
                  </div>

                  {i === 0 && <div className="absolute w-[10px] aspect-square rounded-full outline-3 outline-white/80 "
                    style={{ top: (100 - todayProgress(today)) * 0.97 + '%' }} />}
                </>
                :
                <>
                </>
              }
            </div>
          ))}
        </div>

        {/* tick labels */}
        <div className="flex flex-col justify-between text-sm pl-2 h-[105%] -translate-y-[2%]">
          {val.map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </div>

        <div className="flex justify-between text-center mt-2 text-sm">
          {Array.from({ length: 7 }).map((_, i) => (
            <p key={i} className="flex-1">{param.days[(todayDay + i) % 7]}</p>
          ))}
        </div>
      </div>

      {/* Graph grid */}
      <div className="w-[calc(100%-24px)] absolute flex flex-col" style={{ top: topPos, aspectRatio: ratio }}>
        {Array.from({ length: borderCnt }).map((_, i) => (
          <div key={i} className={`w-full opacity-20 border-b flex-1 ${i === 0 && 'border-t'}`} />
        ))}
      </div>
    </div>
  )
}