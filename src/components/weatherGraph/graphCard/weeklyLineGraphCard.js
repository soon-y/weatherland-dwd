import { getWindDirectionArrow, pressureColorList, pressureOffsets, rainColorList, tempColorIndex, tempColorList, todayProgress, sunshineColorList, sunshineOffsets, visibilityColorList, visibilityOffsets, weatherInfo, windColorList, windOffsets } from "@/lib/param"
import { useEffect, useMemo, useState, useId } from "react"

export default function WeeklyLineGraphCard({ display, hourly, indexW, min, max, step, unit, index, code, hourly2, hoverIndex, setHover, ratio = 1, isDay, timezone = null }) {
  const [val, setVal] = useState([])
  const [time, setTime] = useState([])
  const [codes, setCodes] = useState([])
  const graphSize = { w: 300, h: 300 / ratio }
  const borderCnt = (max - min) / step
  const topPos = ratio == 1 ? '54px' : '42px'
  const today = new Date()
  const unitWidth = 'grid-cols-[1fr_24px]'
  const graphWidth = 'w-[calc(100%-24px)]'
  const subtitleStyle = 'text-sm'
  const padding = 6 / ratio
  const maskId = useId()
  let minIndex, maxIndex, colorRange, offset

  if (display === 'dewpoint' || display === 'temperature') {
    minIndex = tempColorIndex(min)
    maxIndex = tempColorIndex(max)
    colorRange = tempColorList.slice(minIndex, maxIndex + 1)

    if (colorRange.length === 1) {
      colorRange = [colorRange[0], colorRange[0]]
    }
  }
  else if (display === 'sunshine') {
    colorRange = sunshineColorList
    offset = sunshineOffsets
  }
  else if (display === 'visibility') {
    colorRange = visibilityColorList
    offset = visibilityOffsets.map(value =>
      Math.min((value * 50000 / max), 100)
    )
  }
  else if (display === 'wind') {
    colorRange = windColorList
    offset = windOffsets.map(value =>
      Math.min((value / max) * 100, 100)
    )
  }
  else if (display === 'pressure') {
    colorRange = pressureColorList
    offset = pressureOffsets
  }
  else if (display === 'humidity' || display === 'probability') {
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
    if (
      !Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(step) || step <= 0 || max <= min
    ) {
      setVal([])
      return
    }

    const ticks = []
    const count = Math.floor((max - min) / step)

    for (let i = 0; i <= count; i++) {
      ticks.push(+(max - i * step).toFixed(6))
    }

    setVal(ticks)
  }, [min, max, step])

  useEffect(() => {
    setHover(index)
  }, [indexW, index, setHover])

  useEffect(() => {
    if (!code) {
      setCodes([])
      return
    }

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
  }, [indexW, code, isDay])

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
      if (hourly2[i] == null) continue
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
        <div className="py-0 flex justify-between items-center">
          {codes && display === 'wind' ?
            codes.map((el, i) => (
              <div key={i} className={`text-sm flex justify-center items-center flex-1 translate-y-4 transform ${i !== hoverIndex - indexW * 24 && 'opacity-60'}`}>
                {getWindDirectionArrow(el.code)}
              </div>))
            :
            codes.map((el, i) => (
              <div key={i} className={`${i !== hoverIndex - indexW * 24 && 'opacity-70'}`}>
                {
                  <img src={weatherInfo(el.code, el.isDay).src} alt={weatherInfo(el.code, el.isDay).type} />
                }
              </div>
            ))
          }
          {display === 'humidity' && (
            <Info
              label="Relative humidity"
              text="It shows how close the air is to saturation at the current temperature. A high percentage does not necessarily mean that the air contains a large amount of moisture."
              subtitleStyle={subtitleStyle}
            />
          )}

          {display === 'dewpoint' && (
            <Info
              label="Dew point / Temperature"
              text="The closer the dew point is to the air temperature, the more likely the air is to reach saturation."
              subtitleStyle={subtitleStyle}
            />
          )}
          {display == 'probability' && <p className={subtitleStyle}>Precipitation probability</p>}
        </div>
        <p className={`py-2 text-xs sm:text-sm opacity-70 flex items-center justify-center h-12`}>{unit}</p>

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
        <div className={`w-full`} style={{ aspectRatio: ratio, transform: `translateY(${28 - 16 * ratio}px)` }}>
          <svg width='100%' height='100%' className="z-10 relative" viewBox={`${-padding} ${-padding} ${graphSize.w + padding * 2} ${graphSize.h + padding * 2}`}>

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

                <mask id={maskId} maskUnits="userSpaceOnUse">
                  <rect
                    x={-padding}
                    y={-padding}
                    width={graphSize.w + padding * 2}
                    height={graphSize.h + padding * 2}
                    fill="white"
                  />

                  {indexW === 0 && (
                    <rect
                      x={-padding}
                      y={-padding}
                      width={(todayProgress(today, timezone) / 100) * (graphSize.w + padding * 2)}
                      height={graphSize.h + padding * 2}
                      fill="rgba(0,0,0,0.5)"
                    />
                  )}
                </mask>
              </defs>
            }

            {hourly2 &&
              <g mask={`url(#${maskId})`}>
                <path
                  d={getSmoothPath(pointsHourly2()).d}
                  stroke={display === 'wind' ? `url(#${gradientId})` : 'gray'}
                  strokeWidth="2"
                  fill="none"
                  className="opacity-50"
                />

                {pointsHourly2().map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill={display === 'wind' ? `url(#${gradientId})` : 'gray'} />
                ))}
              </g>
            }

            {hourly &&
              <g mask={`url(#${maskId})`}>
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
              </g>}

          </svg>
        </div>

        {/* tick labels */}
        <div className="flex flex-col justify-between text-xs sm:text-sm pl-2"
          style={{ height: `calc(${100 + (4 * ratio)}%)`, transform: `translateY(${8 - 12 * ratio}px)` }}
        >
          {val.map((el, i) => (
            display === 'visibility' ?
              <p key={i}>{Math.round(el / 1000)}</p>
              : display === 'sunshine' ?
                <p key={i}>{el / 60}</p>
                :
                <p key={i}>{el}</p>
          ))}
        </div>

        <div className={`flex justify-between text-xs sm:text-sm w-[103%] -translate-x-[1.5%]`} style={{ marginTop: ratio === 1 ? 12 : 0 }}>
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

function Info({ label, text, subtitleStyle }) {
  return (
    <div className="flex items-center gap-1">
      <p className={subtitleStyle}>{label}</p>

      <div className="relative group">
        <button
          type="button"
          className="w-4 h-4 rounded-full border text-xs flex items-center justify-center"
        >
          !
        </button>

        <div className="
          absolute hidden group-hover:block group-focus-within:block
          left-full bottom-0 ml-2
          w-60 p-2 rounded bg-black text-white text-xs z-1000 border
        ">
          {text}
        </div>
      </div>
    </div>
  )
}