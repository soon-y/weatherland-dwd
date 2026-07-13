import { getWindDirectionArrow, pressureColorList, pressureOffsets, rainColorList, tempColorIndex, tempColorList, todayProgress, uvColorList, uvOffsets, visibilityColorList, visibilityOffsets, weatherInfo, windColorList, windOffsets } from "@/lib/param"
import { useEffect, useMemo, useState } from "react"

export default function WeeklyLineGraphBox({ display, hourly, indexW, min, max, step, unit, index, code, hourly2, hoverIndex, setHover, ratio = 1, isDay }) {
  const [val, setVal] = useState([])
  const [time, setTime] = useState([])
  const [codes, setCodes] = useState([])
  const graphSize = { w: 300, h: 300 / ratio }
  const borderCnt = (max - min) / step
  const topPos = ratio == 1 ? '54px' : '42px'
  const today = new Date()
  const unitWidth = 'grid-cols-[1fr_24px]'
  const graphWidth = 'w-[calc(100%-24px)]'
  let minIndex, maxIndex, colorRange, offset

  if (display === 'feels like' || display === 'temperature') {
    minIndex = tempColorIndex(min)
    maxIndex = tempColorIndex(max)
    colorRange = tempColorList.slice(minIndex, maxIndex + 1)
  }
  else if (display === 'solar energy') {
    colorRange = uvColorList
    offset = uvOffsets
  }
  else if (display === 'visibility') {
    colorRange = visibilityColorList
    offset = visibilityOffsets
  }
  else if (display === 'wind') {
    colorRange = windColorList
    offset = windOffsets
  }
  else if (display === 'pressure') {
    colorRange = pressureColorList
    offset = pressureOffsets
  }
  else if (display === 'probability') {
    colorRange = rainColorList
  }
  else colorRange = ['white']

  const gradientId = useMemo(
    () => `color-${crypto.randomUUID()}`,
    [colorRange]
  )

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

    if (!code) return

    const start = indexW * 24
    const temp = []

    for (let i = start; i < start + 24; i++) {
      if (code[i] == null) {
        temp.push({ code: null, isDay: 0 })
      } else if (isDay) {
        temp.push({ code: code[i], isDay: isDay[i] })
      } else {
        temp.push({ code: code[i] })
      }
    }
    setCodes(temp)
  }, [indexW])

  const points = () => {
    let x, y
    let temp = []
    const start = indexW * 24

    for (let i = start; i < start + 24; i++) {
      if (hourly[i] == null) continue

      const localIndex = i - start
      x = (localIndex / 23) * graphSize.w
      y = graphSize.h - ((hourly[i] - min) / (max - min)) * graphSize.h
      temp.push({ x, y })
    }
    return temp
  }

  const pointsHourly2 = () => {
    if (!hourly2) return

    let x, y
    let temp = []
    const start = indexW * 24

    for (let i = start; i < start + 24; i++) {
      if (hourly[i] == null) continue
      const localIndex = i - start
      x = (localIndex / 23) * graphSize.w
      y = graphSize.h - ((hourly2[i] - min) / (max - min)) * graphSize.h
      temp.push({ x, y })
    }
    return temp
  }

  const getSmoothPath = (points) => {
    if (!points || points.length < 2) return { d: '', stroke: 'white' }

    let d = `M ${points[0].x} ${points[0].y}`
    let stroke = 'white'

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      d += ` Q ${p0.x} ${p0.y}, ${p1.x} ${p1.y}`
      stroke = p0.color
    }
    return { d, stroke }
  }

  return (
    <div className="relative">
      <div className={`w-full grid ${unitWidth}`}>
        <div className="py-2 -translate-x-2 flex justify-between items-center">
          {codes && display === 'wind' ?
            codes.map((el, i) => (
              <div key={i} className={`text-xs text-center flex-1 translate-y-2 transform ${i !== hoverIndex - indexW * 24 && 'opacity-60'}`}>
                {getWindDirectionArrow(el.code)}
              </div>))
            :
            codes.map((el, i) => (
              <div key={i} className={`${i !== hoverIndex - indexW * 24 && 'opacity-70'}`}>
                {
                  <img src={weatherInfo(el.code, el.isDay).src} alt={weatherInfo(el.code, el.isDay).type} />
                }
              </div>
            ))}
        </div>
        <p className={`py-2 text-xs sm:text-sm opacity-70 flex items-center justify-center h-12`}>{unit}</p>

        {/* Graph grid */}
        <div className={`${graphWidth} absolute flex`} style={{ top: topPos, aspectRatio: ratio }}>
          {indexW === 0 && <div className="absolute h-full bg-black/70" style={{ width: todayProgress(today) + '%' }} />}

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
        <div className={`w-full`} style={{ aspectRatio: ratio, transform: `translateX(-1.5%) translateY(${6 - 4 * ratio}%)` }}>
          <svg width='98%' height='101%' className="z-10 relative" viewBox={`-5 -5 ${graphSize.w + 10} ${graphSize.h + 10}`}>

            {colorRange &&
              <defs>
                <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="100%" x2="0" y2="0">
                  {colorRange.map((color, i) => (
                    <stop
                      key={i}
                      offset={`${offset ? offset[i] : (i / (colorRange.length - 1)) * 100}%`}
                      stopColor={color}
                    />
                  ))}
                </linearGradient>

                <mask id="graphMask" maskUnits="userSpaceOnUse">
                  <rect x="-5" y="-5" width={graphSize.w + 10} height={graphSize.h + 10} fill="white" />
                  {indexW == 0 && <rect x="-5" y="-5" width={(todayProgress(today) / 100) * (graphSize.w + 10)} height={graphSize.h + 10} fill="rgba(0,0,0,0.5)" />}
                </mask>
              </defs>
            }

            {hourly2 &&
              <g mask="url(#graphMask)">
                <path
                  d={getSmoothPath(pointsHourly2()).d}
                  stroke="gray"
                  strokeWidth="2"
                  fill="none"
                  className="opacity-50"
                />

                {pointsHourly2().map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="gray" />
                ))}
              </g>
            }

            <g mask="url(#graphMask)">
              <path
                d={getSmoothPath(points()).d}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="2"
                className="opacity-50"
              />

              {points().map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill={`url(#${gradientId})`} />
              ))}
            </g>

          </svg>
        </div>

        {/* tick labels */}
        <div className="flex flex-col justify-between text-xs sm:text-sm pl-1"
          style={{ height: `calc(${100 + (2.5 * ratio)}%)`, transform: `translateY(${-ratio * 1.5 * ratio}%)` }}
        >
          {val.map((el, i) => (
            display === 'visibility' ?
              <p key={i}>{Math.round(el / 1000)}</p> :
              <p key={i}>{el}</p>
          ))}
        </div>

        <div className={`flex justify-between text-xs sm:text-sm w-[103%] -translate-x-[2%] ${ratio == 1 && 'mt-2'}`}>
          {time.map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </div>
      </div>

      <div className={`absolute flex ${graphWidth}`} style={{ top: topPos, aspectRatio: ratio }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className={`flex-1 h-full ${i === hoverIndex - indexW * 24 && 'border-l'}`}
            onClick={() => { setHover(indexW * 24 + i) }}
            onMouseOver={() => { setHover(indexW * 24 + i) }}
            onTouchMove={() => { setHover(indexW * 24 + i) }}
          />
        ))}
      </div>
    </div>
  )
}