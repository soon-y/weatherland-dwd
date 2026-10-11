import Card from "./card"
import { getTimeIndex, param } from "@/lib/param"
import CardTitle from "./cardTitle"

export default function Temperature({ hourly, index, setDisplay, setCardClicked }) {
  const title = 'temperature'
  const temp = hourly.metrics.temperature_2m?.forecast[index]
  const unit = hourly.metrics.temperature_2m?.unit ?? ''
  const current = hourly.timestamps[index]
  const timestamp12 = hourly.metrics.temperature_min_12h?.timestamps
  const index12 = getTimeIndex(current, timestamp12)
  const min = hourly.metrics.temperature_min_12h?.forecast[index12]
  const max = hourly.metrics.temperature_max_12h?.forecast[index12]

  return (
    <Card style={'square'} setDisplay={setDisplay} title={title} setCardClicked={setCardClicked} clickable={hourly.metrics.temperature_2m === undefined ? false : true}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <CardTitle title={title} />
          {temp ?
            <p className={param.weatherDescMain}>{temp} {unit}</p> :
            <p className={param.weatherDescMain}>N/A</p>}
        </div>
        <div>
          {(min || max) && <p className={param.weatherDesc}>within the last 12 hours</p>}
          {min && <p className={param.weatherDescSub}>L: {min} {unit}</p>}
          {max && <p className={param.weatherDescSub}>H: {max} {unit}</p>}
        </div>
      </div>
    </Card>
  )
}