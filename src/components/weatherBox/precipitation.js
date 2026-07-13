import Box from "./box"
import { param, weatherInfo } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Precipitation({ hourly, index, indexD, setDisplay, setBoxClicked }) {
  const title = 'precipitation'
  const code = hourly.metrics.weather_code.forecast[index]
  const probability = hourly.metrics.ww_prob_precip_1h
  const precipitation = hourly.metrics.precip_amount_1h
  const totalSum = hourly.metrics.precip_amount_24h

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked}>
      <div>
        <BoxTitle title={title} />
        <p className={param.weatherDescMain}>{probability.forecast[index]} {probability.unit}</p>
        {totalSum.forecast[indexD] != 0 &&
          <p className={param.weatherDescSub}>
            {precipitation.forecast[index]}
            <span className="text-sm"> mm / {totalSum.forecast[indexD]} mm  in total</span>
          </p>
        }
      </div>

      <div className={`${param.weatherDesc}`}>
        {weatherInfo(code).label}
      </div>
    </Box>
  )
}