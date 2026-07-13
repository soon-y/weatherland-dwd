import Box from "./box"
import { param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Humidity({ hourly, index, setDisplay, setBoxClicked }) {
  const dewpoint = hourly.metrics.dewpoint_2m
  const relativeHumidity = hourly.metrics.relative_humidity
  const title = 'humidity'

  const humidityBar = (val) => {
    let color = 'bg-gradient-to-r'
    let text = ''

    if (val < 10) {
      color = color + ' from-cyan-300 to-cyan-400'
      text = 'dry'
    } else if (val <= 15) {
      color = color + ' from-teal-400 to-emerald-400'
      text = 'Comfortable'
    } else if (val <= 18) {
      color = color + ' from-yellow-400 to-amber-400'
      text = 'Slightly Humid'
    } else if (val <= 21) {
      color = color + ' from-yellow-500 to-amber-500'
      text = 'humid'
    } else if (val <= 24) {
      color = color + ' from-amber-500 to-orange-600'
      text = 'very humid'
    } else {
      color = color + ' from-orange-600 to-red-600'
      text = 'Oppressive'
    }

    return (
      <div>
        <p className={`${param.weatherDesc} absolute top-[-12px] capitalize`}>{text}</p>
        <div className={`${param.weatherBar} ${color} rounded-full max-w-[100%]`}
          style={{ width: val > 0 ? val / 30 * 100 + '%' : '0%' }}
        />
      </div>
    )
  }

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked}>
      <div>
        <BoxTitle title={title} />
        <p className={param.weatherDescMain}>{relativeHumidity.forecast[index]} {relativeHumidity.unit}</p>
        <p className={param.weatherDescSub}>Dew point: <span className="font-semibold">{dewpoint.forecast[index]} {dewpoint.unit}</span></p>
      </div>

      <div className={`${param.weatherBarContainer}`}>
        <div className={`${param.weatherBar} rounded-full bg-black/20`} />
        {humidityBar(dewpoint.forecast[index])}
      </div>
    </Box>
  )
}