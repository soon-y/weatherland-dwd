import Card from "./card"
import { getTimeIndex, param } from "@/lib/param"
import CardTitle from "./cardTitle"

export default function Temperature({ hourly, index, setDisplay, setCardClicked }) {
  const title = 'temperature'
  const temp = hourly.metrics.temperature_2m?.forecast[index]
  const unit = hourly.metrics.temperature_2m?.unit ?? ''
  const current = hourly.timestamps[index]
  const minMetric = hourly.metrics.temperature_min_12h
  const maxMetric = hourly.metrics.temperature_max_12h
  const minIndex = getTimeIndex(current, minMetric?.timestamps)
  const maxIndex = getTimeIndex(current, maxMetric?.timestamps)
  const min = minMetric?.forecast?.[minIndex]
  const max = maxMetric?.forecast?.[maxIndex]

  return (
    <Card style={'square'} setDisplay={setDisplay} title={title} setCardClicked={setCardClicked} clickable={hourly.metrics.temperature_2m === undefined ? false : true}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <CardTitle title={title} />
          {temp != null ?
            <p className={param.weatherDescMain}>{temp} {unit}</p> :
            <p className={param.weatherDescMain}>N/A</p>}
        </div>
        <div>
          {(min != null || max != null) && (
            <p className={param.weatherDesc}>12-hour forecast range</p>
          )}
          {min != null && (
            <p className={param.weatherDescSub}>L: {min} {unit}</p>
          )}
          {max != null && (
            <p className={param.weatherDescSub}>H: {max} {unit}</p>
          )}
        </div>
      </div>
    </Card>
  )
}