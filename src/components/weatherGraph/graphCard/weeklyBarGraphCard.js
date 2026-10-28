import { rainColorList, todayProgress } from "@/lib/param"
import { useEffect, useState } from "react"

export default function WeeklyBarGraphCard({ display, hourly, indexW, min, max, step, unit, index, hoverIndex, setHover, ratio = 1, timezone = null }) {
  const [val, setVal] = useState([])
  const [time, setTime] = useState([])
  const borderCnt = (max - min) / step
  const topPos = ratio == 1 ? '54px' : '42px'
  const today = new Date()
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(today)
  )
  const graphWidth = 'w-[calc(100%-24px)]'
  const subtitleStyle = 'text-sm ml-2'

  useEffect(() => {
    const temp = []

    for (let i = 0; i <= 24; i += 4) {
      if (i < 10) temp.push('0' + i)
      else temp.push(i)
    }

    setTime(temp)
  }, [])

  useEffect(() => {
    const temp = []
    for (let i = max; i >= min; i -= step) {
      temp.push(i)
    }
    setVal(temp)
  }, [min, max, step])

  useEffect(() => {
    setHover(index)
  }, [indexW])


  const barColor = (max) => {
    if (display === 'precipitation') {
      let bgColor = ''
      let maxIndex = rainColorIndex(max)

      for (let i = 0; i <= maxIndex; i++) bgColor += rainColorList[i] + ','
      return `linear-gradient(to top, ${bgColor.replace(/,$/, '')})`
    } else {
      return 'white'
    }
  }

  const rainColorIndex = (i) => {
    if (i < 1) return 0
    else if (i < 10) return 1
    else if (i < 30) return 2
    else return 3
  }

  return (
    <div className="relative">
      <div className="w-full grid grid-cols-[1fr_24px]">

        <div className="py-2 -translate-x-2 flex justify-between items-center h-10">
          {display == 'precipitation' && <p className={subtitleStyle}>Precipitation</p>}
        </div>
        <p className={`py-2 text-xs sm:text-sm opacity-70 flex items-center justify-center h-11`}>{unit}</p>

        {/* Graph grid */}
        <div className={`${graphWidth} absolute flex`} style={{ top: topPos, aspectRatio: ratio }}>
          {indexW === 0 && <div className="absolute h-full bg-black/70" style={{ width: todayProgress(today, timezone) + '%' }} />}

          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`w-full h-full opacity-20 border-r ${i === 0 && 'border-l'}`} />
          ))}
        </div>

        <div className={`${graphWidth} absolute flex flex-col`} style={{ top: topPos, aspectRatio: ratio }}>
          {Array.from({ length: borderCnt }).map((_, i) => (
            <div key={i} className={`w-full opacity-20 border-b flex-1 ${i === 0 && 'border-t'}`} />
          ))}
        </div>

        {/* Graph */}
        <div className="w-full flex" style={{ aspectRatio: ratio }}>
          {hourly && Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={`flex-1 h-full flex justify-center items-end pb-[2px] `}>
              <div className={`rounded-t-sm w-[50%] flex justify-center ${(indexW === 0 && i < hour) ? 'opacity-50' : 'opacity-100'}`}
                style={{ height: hourly?.[i + indexW * 24] / max * 100 + '%', background: barColor(hourly[i + indexW * 24]) }}
              />
            </div>

          ))}
        </div>

        {/* tick labels */}
        <div className="flex flex-col justify-between text-xs sm:text-sm pl-2"
          style={{ height: `calc(${100 + (4 * ratio)}%)`, transform: `translateY(${8 - 12 * ratio}px)` }}
        >
          {val.map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </div>

        <div className="flex justify-between text-xs sm:text-sm w-[103%] -translate-x-[1.5%] mt-1">
          {time.map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </div>
      </div>

      <div className={`absolute flex ${graphWidth}`} style={{ top: topPos, aspectRatio: ratio }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className={`flex-1 h-full ${i === hoverIndex - indexW * 24 && 'bg-white/10'}`}
            onClick={() => { setHover(indexW * 24 + i) }}
            onMouseOver={() => { setHover(indexW * 24 + i) }}
            onTouchMove={() => { setHover(indexW * 24 + i) }}
          />
        ))}
      </div>
    </div>
  )
}