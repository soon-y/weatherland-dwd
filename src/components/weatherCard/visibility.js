import Card from "./card"
import { visibilityInfo, param } from "@/lib/param"
import CardTitle from "./cardTitle"

export default function Visibility({ hourly, index, setDisplay, setCardClicked }) {
  const visibility = hourly.metrics.visibility?.forecast[index]
  const isless4k = visibility / 1000 < 4
  const current = isless4k ? visibility : Math.round(visibility / 1000)
  const title = 'visibility'

  return (
    <Card style={'square'} setDisplay={setDisplay} title={title} setCardClicked={setCardClicked} clickable={visibility === undefined ? false : true}>
      <div>
        <CardTitle title={title} />
        {visibility ?
          <p className={param.weatherDescMain}>{current} {!isless4k && 'k'}{hourly?.metrics.visibility.unit}</p> :
          <p className={param.weatherDescMain}>N/A</p>
        }
      </div>

      {visibility && <div>
        <p className={`${param.weatherDesc}`}>
          {visibilityInfo(visibility).desc}
        </p>
      </div>}
    </Card>
  )
}