import Box from "./box"
import { irradiance, param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Irradiance({ hourly, index, setDisplay, setBoxClicked }) {
  const current = hourly.forecast[index]
  const title = 'solar energy'

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked}>
      <div>
        <BoxTitle title={title} />
        <p className={param.weatherDescMain}>{irradiance(current).state}</p>
        <p className={param.weatherDescSub}>{current} kJ/m<sup>2</sup></p>
      </div>
      <div className={`${param.weatherBarContainer}`}>
        <div className={`${param.weatherBar} rounded-full bg-gradient-to-r from-lime-500 from-5% via-yellow-300 via-30% to-red-500 to-90%`} />
        <div
          className={`${param.weatherBarDisc}`}
          style={{ left: `${irradiance(current).pos}%` }}
        />
      </div>
    </Box>
  )
}