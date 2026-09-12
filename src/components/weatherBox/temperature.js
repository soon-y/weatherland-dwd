import Box from "./box"
import { getTimeIndex, param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Tmperature({ hourly, index, setDisplay, setBoxClicked }) {
  const title = 'temperature'
  const temp = hourly.metrics.temperature_2m?.forecast[index] ?? 0
  const unit = hourly.metrics.temperature_2m?.unit ?? ''
  const current = hourly.timestamps[index]
  const timestamp12 = hourly.metrics.temperature_min_12h?.timestamps ?? 0
  const index12 = getTimeIndex(current, timestamp12)
  const min = hourly.metrics.temperature_min_12h?.forecast[index12] ?? 0
  const max = hourly.metrics.temperature_max_12h?.forecast[index12] ?? 0

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked} clickable={hourly.metrics.temperature_2m === undefined ? false : true}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <BoxTitle title={title} />
          {temp ? <p className={param.weatherDescMain}>{temp} {unit}</p> : <p>N/A</p>}
        </div>
        {temp !== null &&
          <div>
            <p className={param.weatherDesc}>within the last 12 hours</p>
            <p className={param.weatherDescSub}>L: {min} {unit}</p>
            <p className={param.weatherDescSub}>H: {max} {unit}</p>
          </div>}
      </div>
    </Box>
  )
}