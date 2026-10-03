import Box from "./box"
import { visibilityInfo, param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Visibility({ hourly, index, setDisplay, setBoxClicked }) {
  const visibility = hourly.metrics.visibility?.forecast[index]

  const current = visibility / 1000 < 10 ? visibility : Math.round(visibility / 1000)
  const title = 'visibility'

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked} clickable={visibility === undefined ? false : true}>
      <div>
        <BoxTitle title={title} />
        {visibility ?
          <p className={param.weatherDescMain}>{current} k{hourly?.metrics.visibility.unit}</p> :
          <p className={param.weatherDescMain}>N/A</p>
        }
      </div>

      {visibility && <div>
        <p className={`${param.weatherDesc}`}>
          {visibilityInfo(current).desc}
        </p>
      </div>}
    </Box>
  )
}