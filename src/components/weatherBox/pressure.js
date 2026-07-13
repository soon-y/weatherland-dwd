import Image from "next/image"
import Box from "./box"
import { param, pressure } from "@/lib/param"
import BoxTitle from "./boxTitle"

export default function Pressure({ hourly, index, setDisplay, setBoxClicked }) {
  const current = Math.round(hourly.forecast[index])
  const before = index > 1 ? hourly.forecast[index - 1] : current
  const title = 'pressure'
  let flag = ''

  function angle() {
    let angle
    if (current <= 980) {
      angle = 0
      flag = 'lower'
    } else if (current >= 1040) {
      angle = 270
      flag = 'higher'
    } else {
      let total = 1040 - 980
      let temp = current - 980
      angle = (temp / total) * 270

      if (current == before) flag = ''
      else if (current < before) flag = 'lower'
      else flag = 'higher'
    }
    return angle - 135
  }

  return (
    <>

      <Box className="hidden sm:block" style={'square'} setDisplay={setDisplay} title={'pressure'} setBoxClicked={setBoxClicked}>
        <div>
          <BoxTitle title={title} />
          <p className={`${param.weatherDescMain} capitalize font-bold`}>{pressure(current)}</p>
        </div>
        <div className='relative w-[calc(100%-50px)] aspect-square left-1/2 -translate-x-1/2'>
          <Image className="absolute opacity-20" src={'/weather/pressure/gauge2.png'} width={400} height={400} alt="pressure gauge" />
          <Image style={{ rotate: angle() + 'deg' }} className="absolute" src={'/weather/pressure/arrow2.png'} width={400} height={400} alt="pressure gauge arrow" />
          {flag == 'higher' &&
            <Image style={{ rotate: angle() + 'deg' }} className="absolute opacity-70 pointer-events-none"
              src={'/weather/pressure/higher.png'} width={400} height={400} alt="pressure gauge"
            />}
          {flag == 'lower' &&
            <Image style={{ rotate: angle() + 'deg' }} className="absolute opacity-70 pointer-events-none"
              src={'/weather/pressure/lower.png'} width={400} height={400} alt="pressure gauge"
            />}

          <div className="text-center absolute left-1/2 top-1/2 -translate-1/2">
            <p className={`font-semibold text-base/4 sm:text-lg/5`}>{Math.round(current)}</p>
            <p className="text-xs sm:text-sm"> {hourly.unit}</p>
          </div>
          <div className={`text-xs absolute bottom-1 flex justify-between w-full`}>
            <span className="ml-[10%]">Low</span>
            <span className="mr-[10%]">High</span>
          </div>
        </div>
      </Box>

      <Box className="sm:hidden" style={'wide'} setDisplay={setDisplay} title={'pressure'} setBoxClicked={setBoxClicked}>
        <BoxTitle title={title} />

        <div className='grid grid-cols-[58%_40%_2%]'>
          <div className="grid items-center">
            <div>
            <p className={`${param.weatherDescMain} capitalize font-bold`}>{pressure(current)}</p>
            <p className={`${param.weatherDescSub}`}>{Math.round(current)}  h{hourly.unit}</p>
            </div>
          </div>

          <div className='relative aspect-square'>
            <div className='relative w-[calc(100%)] aspect-square left-1/2 -translate-x-1/2'>
              <Image className="absolute opacity-20" src={'/weather/pressure/gauge2.png'} width={400} height={400} alt="pressure gauge" />
              <Image style={{ rotate: angle() + 'deg' }} className="absolute" src={'/weather/pressure/arrow2.png'} width={400} height={400} alt="pressure gauge arrow" />
              {flag == 'higher' &&
                <Image style={{ rotate: angle() + 'deg' }} className="absolute opacity-70 pointer-events-none"
                  src={'/weather/pressure/higher.png'} width={400} height={400} alt="pressure gauge"
                />}
              {flag == 'lower' &&
                <Image style={{ rotate: angle() + 'deg' }} className="absolute opacity-70 pointer-events-none"
                  src={'/weather/pressure/lower.png'} width={400} height={400} alt="pressure gauge"
                />}

              <div className="text-center absolute left-1/2 top-1/2 -translate-1/2">
                <p className={`font-semibold text-base/4 sm:text-lg/5`}>{Math.round(current)}</p>
                <p className="text-xs sm:text-sm"> h{hourly.unit}</p>
              </div>
              <div className={`text-xs absolute bottom-1 flex justify-between w-full`}>
                <span className="ml-[10%]">Low</span>
                <span className="mr-[10%]">High</span>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  )
}