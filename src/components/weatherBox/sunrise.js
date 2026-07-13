import { param } from "@/lib/param"
import Box from "./box"
import BoxTitle from "./boxTitle"

export default function Sunrise({ daily, hourly, index, indexD, setDisplay, setBoxClicked }) {
  const irradiance_1h = hourly.metrics.irradiance_1h
  const sunrise = daily.sunrise[indexD]
  const sunset = daily.sunset[indexD]
  const sunriseNext = daily.sunrise[indexD + 1] ? daily.sunrise[indexD + 1] : daily.sunrise[indexD]
  const sunsetNext = daily.sunset[indexD + 1] ? daily.sunrise[indexD + 1] : daily.sunset[indexD]
  const now = hourly.timestamps[index]
  const nowDate = new Date(now)
  const sunriseDate = new Date(sunrise)
  const sunsetDate = new Date(sunset)
  const startOfDay = new Date(now.split('T')[0] + 'T00:00:00')
  const endOfDay = new Date(now.split('T')[0] + 'T23:59:59')
  const pathSize = { w: 300, h: 100 }
  const pathStart = generateWaveSegment(pathSize.w, pathSize.h, 0, 0.25)
  const pathMiddle = generateWaveSegment(pathSize.w, pathSize.h, 0, 1)
  const pathEnd = generateWaveSegment(pathSize.w, pathSize.h, 0.75, 1)

  const title = () => {
    if (nowDate > sunriseDate) {
      if (nowDate > sunsetDate) {
        return (
          <div>
            <BoxTitle title={'sunrise'} />
            <p className={param.weatherDescMain}>{sunriseNext.split("T")[1]}</p>
            <p className={param.weatherDescSub}>Sunset at {sunsetNext.split("T")[1]}</p>
          </div>
        )
      } else {
        return (
          <div>
            <BoxTitle title={'sunset'} />
            <p className={param.weatherDescMain}>{sunset.split("T")[1]}</p>
            <p className={param.weatherDescSub}>Sunrise at {sunriseNext.split("T")[1]}</p>
          </div>
        )
      }
    } else {
      return (
        <div>
          <BoxTitle title={'sunrise'} />
          <p className={param.weatherDescMain}>{sunrise.split("T")[1]}</p>
          <p className={param.weatherDescSub}>Sunset at {sunset.split("T")[1]}</p>
        </div>
      )
    }
  }

  function getSunProgress() {
    let progress

    if (nowDate < sunriseDate) {
      progress = ((nowDate - startOfDay) / (sunriseDate - startOfDay)) * 0.25
    }
    else if (nowDate <= sunsetDate) {
      progress = 0.25 + ((nowDate - sunriseDate) / (sunsetDate - sunriseDate)) * 0.5
    } else {
      progress = 0.75 + ((nowDate - sunsetDate) / (endOfDay - sunsetDate)) * 0.23
    }
    const { x, y } = getPointOnWave(progress, pathSize.w, pathSize.h)

    return { x, y }
  }

  function getPointOnWave(progress, width, height) {
    const amplitude = height / 2
    const centerY = height / 2
    const xPos = progress * width
    const x = (xPos / width) * 2 * Math.PI - Math.PI / 2
    const yPos = centerY - Math.sin(x) * amplitude
    return { x: xPos, y: yPos }
  }

  function generateWaveSegment(width, height, startT, endT) {
    const points = []
    const amplitude = height / 2
    const centerY = height / 2

    const startX = Math.floor(startT * width)
    const endX = Math.floor(endT * width)

    for (let i = startX; i <= endX; i++) {
      const t = i / width
      const x = t * 2 * Math.PI - Math.PI / 2
      const y = centerY - Math.sin(x) * amplitude

      points.push(`${i},${y}`)
    }
    return "M " + points.join(" L ")
  }

  return (
    <Box style={'square'} setDisplay={setDisplay} title={'daily sun'} setBoxClicked={setBoxClicked}>
      {title()}

      <div className="relative">
        <svg style={{ overflow: "visible" }}
          viewBox={`-10 -10 ${pathSize.w + 20} ${pathSize.h + 20}`} width="100%"
        >
          <defs>
            <linearGradient id="horizonFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </linearGradient>

            <mask id="horizonFadeMask">
              <rect width="100%" height="50%" fill="url(#horizonFade)" x='-10' y={`${pathSize.h / 2}`} />
            </mask>

            <mask id="cropMask">
              <rect width="100%" height="50%" fill="white" y={`-10`} />
              <rect width="100%" height="50%" fill="black" y={`${pathSize.h / 2}`} />
            </mask>

            <filter
              id="glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="6"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="clip">
              <rect
                x="10"
                y="-20"
                width={pathSize.w}
                height={pathSize.h / 2 + 20}
              />
            </clipPath>
          </defs>

          <path className="opacity-50" d={pathStart} stroke="rgba(0,0,0,0.4)" fill="none" strokeWidth="8" mask="url(#horizonFadeMask)" />
          <path className="opacity-50" d={pathEnd} stroke="rgba(0,0,0,0.4)" fill="none" strokeWidth="8" mask="url(#horizonFadeMask)" />
          <path className="opacity-50" d={pathMiddle} stroke="white" fill="none" strokeWidth="8" mask="url(#cropMask)" />

          <g clipPath="url(#clip)">
            <circle
              cx={getSunProgress().x}
              cy={getSunProgress().y}
              r="9"
              fill="white"
              stroke="white"
              strokeWidth="2"
              filter="url(#glow)"
            />
          </g>

          <circle
            cx={getSunProgress().x}
            cy={getSunProgress().y}
            r="9"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute bottom-0 w-full h-[50%] border-t-1 opacity-50 "></div>
      </div>
    </Box>
  )
}