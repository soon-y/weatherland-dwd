import Box from "./box"
import { getTimeIndex, param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Tmperature({ hourly, index, setDisplay, setBoxClicked }) {
  const title = 'temperature'
  const temp = hourly.metrics.temperature_2m.forecast[index]
  const unit = hourly.metrics.temperature_2m.unit
  const current = hourly.timestamps[index]
  const timestamp12 = hourly.metrics.temperature_min_12h.timestamps
  const index12 = getTimeIndex(current, timestamp12)
  const min = hourly.metrics.temperature_min_12h.forecast[index12]
  const max = hourly.metrics.temperature_max_12h.forecast[index12]

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <BoxTitle title={title} />
          <p className={param.weatherDescMain}>{temp} {unit}</p>
        </div>
        <div>
          <p className={param.weatherDesc}>within the last 12 hours</p>
          <p className={param.weatherDescSub}>L: {min} {unit}</p>
          <p className={param.weatherDescSub}>H: {max} {unit}</p>
        </div>
      </div>
    </Box>
  )
}