import Box from "./box"
import { airQuality, param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function AirQuality({ air, index, setDisplay, setBoxClicked }) {
  const current = air.european_aqi[index]
  const title = 'air quality'

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked}>
      <div>
        <BoxTitle title={title} />
        <p className={param.weatherDescMain}>{airQuality(current).state}</p>
        <p className={param.weatherDescSub}>{current}</p>
      </div>

      <div className={`${param.weatherBarContainer}`}>
        <div className={`${param.weatherBar} rounded-full bg-gradient-to-r from-cyan-400 from-0% via-amber-400 via-50% to-red-500 to-90%`} />
        <div
          className={`${param.weatherBarDisc}`}
          style={{ left: `${airQuality(current).pos}%` }}
        />
      </div>
    </Box>
  )
}