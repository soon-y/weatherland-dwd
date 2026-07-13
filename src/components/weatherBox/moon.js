import Box from "./box"
import BoxTitle from "./boxTitle"
import MoonImg from "../weatherGraph/graphBox/moonBox"
import { param } from "@/lib/param"

export default function Moon({ daily, indexD, setDisplay, setBoxClicked }) {
  const title = 'moon_' + (daily[indexD].moon_phase).replace('_', ' ')
  const moon = daily[indexD]
  const phaseAngle = daily[indexD].phaseData.moonphase
  const phaseMoon = (daily[indexD].moon_phase).toLowerCase().replace('_', ' ')
  const illumination = getIllumination(phaseAngle)

  return (
    <Box style={'wide'} setDisplay={setDisplay} title={title} setBoxClicked={setBoxClicked}>
      <BoxTitle title={title} />

      <div className='grid grid-cols-[58%_40%_2%]'>
        <div className="grid items-center">
          <p className={`capitalize ${param.weatherDescMain}`}>{phaseMoon}</p>
          <div className={`grid grid-cols-2 items-center ${param.weatherDescSub}`}>
            <p className="font-semibold">Moonrise</p>
            <p>{moon.moonrise}</p>
            <p className="font-semibold">Moonset</p>
            <p>{moon.moonset}</p>
            <p className="font-semibold">Illumination</p>
            <p>{illumination} %</p>
          </div>
        </div>

        <div className='relative aspect-square p-2'>
          <MoonImg phase={phaseAngle} />
        </div>
      </div>
    </Box>
  )
}

function getIllumination(phaseAngleDeg) {
  const rad = phaseAngleDeg * Math.PI / 180
  return Math.round((1 - Math.cos(rad)) / 2 * 100)
}