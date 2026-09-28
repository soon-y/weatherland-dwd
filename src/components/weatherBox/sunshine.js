import Box from "./box"
import { sunshineDuration, param } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Sunshine({ hourly, index, setDisplay, setBoxClicked }) {
  const current = hourly?.forecast[index]
  const title = 'sunshine'

  return (
    <Box style={'square'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked} clickable={hourly === undefined ? false : true}>
      <div>
        <BoxTitle title={title} />
        {hourly !== null ?
          <>
            <p className={param.weatherDescMain}>{current/60} mins</p>
            <p className={param.weatherDescSub}>{sunshineDuration(current).state}</p>
          </>
          :
          <p>N/A</p>
        }
      </div>
      {hourly !== null &&
        <div className={`${param.weatherBarContainer}`}>
          <div className={`${param.weatherBar} rounded-full bg-gradient-to-r from-gray-500 from-10% via-yellow-300 via-40% to-red-500 to-90%`} />
          <div
            className={`${param.weatherBarDisc}`}
            style={{ left: `${sunshineDuration(current).pos}%` }}
          />
        </div>
      }
    </Box >
  )
}