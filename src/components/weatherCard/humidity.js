import Card from "./card"
import { param } from "@/lib/param"
import CardTitle from "./cardTitle"

export default function Humidity({ hourly, index, setDisplay, setCardClicked }) {
  const dewpoint = hourly?.metrics?.dewpoint_2m
  const relativeHumidity = hourly?.metrics?.relative_humidity
  const title = 'humidity'

  return (
    <Card style={'square'} setDisplay={setDisplay} title={title} setCardClicked={setCardClicked} clickable={hourly.metrics.dewpoint_2m === undefined ? false : true}>
      <div>
        <CardTitle title={title} />
        {dewpoint && relativeHumidity ?
          <>
            <p className={param.weatherDescMain}>{relativeHumidity.forecast[index]} {relativeHumidity.unit}</p>
            <p className={param.weatherDescSub}>Dew point: <span className="font-semibold">{dewpoint.forecast[index]} {dewpoint.unit}</span></p>
          </>
          :
          <p className={param.weatherDescMain}>N/A</p>}
      </div>
    </Card>
  )
}