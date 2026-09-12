import Box from "./box"
import { visibilityInfo, param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Visibility({ hourly, index, setDisplay, setBoxClicked }) {
  const visibility = (hourly.metrics.visibility?.forecast[index] ?? 10000) / 1000

  const current = visibility < 10 ? visibility : Math.round(visibility)
  const title = 'visibility'

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked} clickable={hourly === undefined ? false : true}>
      <div>
        <BoxTitle title={title} />
        {hourly ?
          <p className={param.weatherDescMain}>{current} k{hourly.metrics.visibility.unit}</p> :
          <p>N/A</p>
        }
      </div>

      {hourly && <div>
        <p className={`${param.weatherDesc}`}>
          {visibilityInfo(current).desc}
        </p>
      </div>}
    </Box>
  )
}