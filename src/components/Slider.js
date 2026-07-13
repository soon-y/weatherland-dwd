"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import WeatherIcon from "./weatherIcon"
import { isMobile, param, tempColorIndex, tempColorList } from "@/lib/param"

export default function Slider({ forecast, setIndex, index, timezone }) {
  const ref = useRef(null)
  const [boxWidth, setBoxWidth] = useState(0)
  const [graphWidth, setGraphWidth] = useState(0)
  const [hourlyData, setHourlyData] = useState(null)
  const [timeIndex, setTimeIndex] = useState(null)
  const [hover, setHover] = useState(null)
  const [sliderHeight, setSliderHeight] = useState(150)
  const graphSize = { w: graphWidth, h: sliderHeight * 0.3 }
  const temperature = forecast.metrics.temperature_2m.forecast
  const weatherCode = forecast.metrics.weather_code.forecast
  const probability = forecast.metrics.ww_prob_precip_1h.forecast
  const isDay = forecast.metrics.is_day.forecast
  const max = Math.max(...temperature) + 5
  const min = Math.min(...temperature) - 5
  const minIndex = tempColorIndex(min)
  const maxIndex = tempColorIndex(max)
  const colorRange = tempColorList.slice(minIndex, maxIndex + 1)
  const length = forecast.timestamps.length

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth - 16
      const divide = windowWidth > 1000 ? 10 : isMobile(windowWidth) ? 6 : 4
      const box = windowWidth / divide

      setBoxWidth(box)
      setGraphWidth(box * length)
      setSliderHeight(windowWidth >= 640 ? param.sliderHeight : 120)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!ref.current || index > length - 6) return

    ref.current.scrollTo({
      left: boxWidth * index,
    })
  }, [index])

  useEffect(() => {
    if (!forecast || !timezone) return

    const tempArr = []

    for (let i = 0; i < forecast.timestamps.length; i++) {
      tempArr.push({
        index: i,
        time: forecast.timestamps[i].split('T')[1].slice(0, 2),
        code: weatherCode[i],
        temp: temperature[i],
        probability: probability[i],
        isDay: isDay[i],
      })
    }

    const currentHour = Number(
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: timezone,
      }).format(new Date())
    )

    const hourIndex = tempArr.findIndex(item => Number(item.time) === currentHour)

    setTimeIndex(hourIndex)
    setIndex(hourIndex)
    setHourlyData(tempArr)
  }, [forecast])

  const gradientId = useMemo(
    () => `color-${crypto.randomUUID()}`,
    [colorRange]
  )

  const points = (data) => {
    let x, y
    let result = []

    for (let i = 0; i < data.length; i++) {
      x = i / (data.length - 1) * graphSize.w
      y = graphSize.h - ((data[i] - min) / (max - min)) * graphSize.h

      if (i == 0) x = x + 5
      if (i == data.length - 1) x = x - 5
      result.push({ x, y })
    }
    return result
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

  const handleScroll = () => {
    const el = ref.current
    const scrollLeft = Math.round(el.scrollLeft / boxWidth)
    setIndex(scrollLeft)
  }

  const handleClick = e => {
    const rect = e.currentTarget.getBoundingClientRect()

    const x = e.clientX - rect.left
    setIndex(Math.round(x / boxWidth))
  }

  const handleHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()

    const x = e.clientX - rect.left
    setHover(Math.round(x / boxWidth))
  }

  const ptsTemp = points(temperature)

  if (!hourlyData) return
  return (
    <>
      <div ref={ref} onScrollEnd={handleScroll}
        className={`${param.sliderStyles} flex overflow-y-hidden overflow-x-auto snap-x snap-mandatory scroll-smooth select-none  scrollbar-hide`}>
        {hourlyData.map((el, i) => (
          <div key={i} onClick={() => setIndex(i)}
            className={`flex-shrink-0 snap-start flex flex-col relative cursor-pointer duration-500 hover:bg-white/10 text-white
              ${i === index && "font-bold"} ${i === hover && "bg-white/10"}`}
            style={{ width: `${boxWidth}px`, height: sliderHeight + 'px' }}
          >
            <div className="grid grid-rows-[42px_35%_15%_20%] h-full">
              <div className={`flex justify-center`}>
                <WeatherIcon code={el.code} isDay={el.isDay} probability={el.probability} />
              </div>
              <div />

              <div className={`leading-none opacity-80 flex items-center justify-center text-[11px] text-xs sm:text-sm`}>
                {el.temp}°
              </div>

              <div className="flex items-start justify-center text-xs sm:text-base">
                {i === timeIndex ? 'Now' : el.time + 'h'}
              </div>
            </div>
          </div>
        ))}

        {/* graph */}
        <div className="absolute cursor-pointer" onClick={handleClick} onMouseMove={handleHover} onMouseLeave={() => setHover(null)} style={{
          top: '44px', left: boxWidth / 2,
          height: sliderHeight * 0.35 + 'px',
          width: boxWidth * (length - 1),
        }}>
          <svg width='100%' height='100%' className="relative overflow-visible" viewBox={`0 0 ${graphSize.w} ${graphSize.h}`}>
            <defs>
              <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="100%" x2="0" y2="0">
                {colorRange.map((color, i) => (
                  <stop
                    key={i}
                    offset={`${(i / (colorRange.length - 1)) * 100}%`}
                    stopColor={color}
                  />
                ))}
              </linearGradient>
            </defs>

            <g mask="url(#sliderMask)">
              <path
                d={getSmoothPath(ptsTemp).d}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="2"
                className="opacity-50"
              />

              {ptsTemp.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={`url(#${gradientId})`} />
              ))}
            </g>
          </svg>
        </div>
      </div>

      <div className="fixed left-2 bottom-2 select-none">
        <div className={`shadow-l2g outline rounded-lg duration-500 ${isDay ? 'outline-black/50' : 'outline-white/30'}`}
          style={{ width: boxWidth, height: sliderHeight + 'px' }}
        />
      </div>

      <button className={`cursor-pointer absolute top-[-26px] right-2 text-sm text-white bg-black/40 py-1 px-3 rounded-full backdrop-blur-lg duration-500`}
        style={{ display: index === timeIndex ? 'none' : 'block' }}
        onClick={() => setIndex(timeIndex)}>
        back to NOW
      </button>
    </>
  )
}
