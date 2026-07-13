import Box from "./box"
import { visibilityInfo, param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Visibility({ hourly, index, setDisplay, setBoxClicked }) {
  const visibility = hourly.metrics.visibility.forecast[index] / 1000
  const prob = hourly.metrics.visibility_prob_below_1000m

  // console.log(prob)
  
  const current = visibility < 10 ? visibility : Math.round(visibility)
  const title = 'visibility'

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked}>
      <div>
        <BoxTitle title={title} />
        <p className={param.weatherDescMain}>{current} k{hourly.metrics.visibility.unit}</p>
      </div>

      <div>
        <p className={`${param.weatherDesc}`}>
          {visibilityInfo(current).desc}
        </p>
      </div>
    </Box>
  )
}