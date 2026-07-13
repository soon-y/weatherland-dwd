import * as THREE from 'three'
import { useControls } from "leva"
import { useEffect, useRef, useState } from "react"
import { timeToSec, useIsDebug } from "@/lib/param"
import { useFrame } from "@react-three/fiber"
import WorldSky from "./Sky"
import Grass from "./Grass"
import Windvane from "./Windvane"
import Pond from "./Pond"
import Tree from "./Tree"
import Rain from './rain'
import Snow from './snow'
import Mist from './mist'
import MistOverlay from './mistOverlay'
import Umbrella from './umbrella'
import Thermometer from './thermometer'

export default function Environment({ store, hourly, daily, index, indexD }) {
  const [sunProgress, setSunProgress] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [windDirH, setWindDirH] = useState(0)
  const [windSpdH, setWindSpdH] = useState(0)
  const [gustsSpdH, setGustsSpdH] = useState(0)
  const [snowDepth, setSnowDepth] = useState(0)
  const isDebug = useIsDebug()
  const timeRef = useRef(0)
  const windSpeedRef = useRef(0)
  const windDirRef = useRef(0)
  const finalWindSpd = useRef(0)
  const finalWindDir = useRef(0)
  const progressRef = useRef(0)
  const rafRef = useRef(null)

  const weather = useRef({
    rain: 0,
    snow: 0,
    visibility: 5000,
    precipitation: 0,
    temperature: null
  })

  const targetWeather = useRef({
    rain: 0,
    snow: 0,
    visibility: 5000,
    precipitation: 0,
    temperature: null
  })

  const { progress, visibility, temperature } = useControls('Day', {
    progress: { value: 0.5, min: 0, max: 1, step: 0.01 },
    visibility: { value: 5000, min: 100, max: 5000, step: 100 },
    temperature: { value: 10, min: -50, max: 50, step: 1 },
  }, { store })

  const { rain, snow, precipitation } = useControls('Precipitation', {
    rain: { value: 0, min: 0, max: 10, step: 0.1 },
    snow: { value: 0, min: 0, max: 10, step: 0.1 },
    precipitation: { value: 0, min: 0, max: 10, step: 0.1 },
  }, { store })

  const { direction, speed } = useControls('Wind', {
    direction: { value: 90, min: 0, max: 360, step: 1 },
    speed: { value: 2, min: 0, max: 50, step: 1 },
  }, { store })

  const { strength, period, duration } = useControls('Gusts', {
    strength: { value: 5, min: 0, max: 100, step: 1 },
    period: { value: 20, min: 5, max: 60, step: 1 },
    duration: { value: 3, min: 1, max: 10, step: 1 },
  }, { store })

  const { depth } = useControls('Snow', {
    depth: { value: 0, min: 0, max: 0.5, step: 0.01 },
  }, { store })

  useEffect(() => {
    if (!hourly || !daily || index == null || indexD == null) return

    let progressInDay
    const oneDayInSec = 24 * 60 * 60
    const daylightInSec = daily.daylight_duration[indexD]
    const sunrise = daily.sunrise[indexD].split('T')[1]
    const sunset = daily.sunset[indexD].split('T')[1]
    const sunriseInSec = timeToSec(Number(sunrise.split(':')[0]), sunrise.split(':')[1])
    const sunsetInSec = timeToSec(Number(sunset.split(':')[0]), sunset.split(':')[1])
    const nowInSec = timeToSec(index % 24)

    if (nowInSec < sunriseInSec) {
      progressInDay = (nowInSec / sunriseInSec) * 0.25
    } else if (nowInSec <= sunsetInSec) {
      progressInDay = 0.25 + ((nowInSec - sunriseInSec) / daylightInSec) * 0.5
    } else {
      progressInDay = 0.75 + ((nowInSec - sunsetInSec) / (oneDayInSec - daylightInSec - sunriseInSec)) * 0.25
    }
    setSunProgress(Number(progressInDay.toFixed(2)))

    setWindDirH(hourly.metrics.wind_direction_10m.forecast[index])
    setWindSpdH(hourly.metrics.wind_speed_10m.forecast[index])
    setGustsSpdH(hourly.metrics.wind_gust_max_1h.forecast[index])
    setSnowDepth(hourly.metrics.precip_snow_amount_1h.forecast[index])

    targetWeather.current = {
      rain: hourly.metrics.precip_liquid_amount_1h.forecast[index],
      snow: hourly.metrics.precip_snow_amount_1h.forecast[index],
      visibility: hourly.metrics.visibility.forecast[index],
      precipitation: hourly.metrics.precip_amount_1h.forecast[index],
      temperature: hourly.metrics.temperature_2m.forecast[index]
    }
  }, [index, indexD])

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)

    const animate = () => {
      let current = progressRef.current
      let diff = sunProgress - current

      if (diff > 0.5) diff -= 1
      if (diff < -0.5) diff += 1

      current += diff * 0.05

      if (current >= 1) current -= 1
      if (current < 0) current += 1

      progressRef.current = current
      setAnimatedProgress(current)

      if (Math.abs(diff) > 0.001) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        progressRef.current = sunProgress
        setAnimatedProgress(sunProgress)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafRef.current)
  }, [sunProgress])

  useFrame((_, delta) => {
    delta = Math.min(delta, 0.05)
    const gustCycle = isDebug ? period : 20
    const gustDuration = isDebug ? duration : 3

    timeRef.current += delta

    const targetDirection = isDebug
      ? direction * -(Math.PI / 180) - Math.PI * 0.5
      : windDirH * -(Math.PI / 180) - Math.PI * 0.5

    const targetSpeed = isDebug ? speed : windSpdH
    const targetGustSpeed = isDebug ? strength : gustsSpdH

    windDirRef.current = THREE.MathUtils.lerp(
      windDirRef.current,
      targetDirection,
      delta * 3
    )

    windSpeedRef.current = THREE.MathUtils.lerp(
      windSpeedRef.current,
      targetSpeed,
      delta * 3
    )

    const cycleTime = timeRef.current % gustCycle

    let gustEffect = 0

    if (cycleTime < gustDuration) {
      gustEffect = Math.sin((cycleTime / gustDuration) * Math.PI) * targetGustSpeed
    }

    const targetFinalWindSpd = windSpeedRef.current + gustEffect

    finalWindSpd.current = THREE.MathUtils.lerp(
      finalWindSpd.current,
      targetFinalWindSpd,
      delta * 2
    )

    const sway = Math.sin(timeRef.current * 2) * (finalWindSpd.current * 0.001)

    finalWindDir.current = windDirRef.current + sway

    weather.current.rain = THREE.MathUtils.damp(
      weather.current.rain,
      targetWeather.current.rain,
      5,
      delta
    )

    weather.current.snow = THREE.MathUtils.damp(
      weather.current.snow,
      targetWeather.current.snow,
      5,
      delta
    )

    weather.current.visibility = THREE.MathUtils.damp(
      weather.current.visibility,
      targetWeather.current.visibility,
      5,
      delta
    )

    weather.current.precipitation = THREE.MathUtils.damp(
      weather.current.precipitation,
      targetWeather.current.precipitation,
      5,
      delta
    )

    if (targetWeather.current.temperature == null) {
      weather.current.temperature = null
    } else {
      weather.current.temperature = THREE.MathUtils.damp(
        weather.current.temperature ?? targetWeather.current.temperature,
        targetWeather.current.temperature,
        5,
        delta
      )
    }
  })

  return (
    <>
      <WorldSky progress={isDebug ? progress : animatedProgress} snowDepth={isDebug ? depth : snowDepth} />
      <Windvane windDir={finalWindDir} windSpd={finalWindSpd} snowDepth={isDebug ? depth : snowDepth} />
      <Grass progress={isDebug ? progress : animatedProgress} windDir={finalWindDir} windSpd={finalWindSpd} snowDepth={isDebug ? depth : snowDepth} />
      <Pond progress={isDebug ? progress : animatedProgress} windDir={finalWindDir} windSpd={finalWindSpd} rain={isDebug ? rain : undefined} temp={isDebug ? temperature : undefined} weather={isDebug ? undefined : weather} />
      <Tree progress={isDebug ? progress : animatedProgress} windDir={finalWindDir} windSpd={finalWindSpd} snowDepth={isDebug ? depth : snowDepth} />
      <Rain windDir={finalWindDir} windSpd={finalWindSpd} isDay={isDebug ? progress >= 0.25 && progress <= 0.75 : hourly?.metrics.is_day.forecast[index]} precipitation={isDebug ? rain : undefined} weather={isDebug ? undefined : weather} />
      <Snow windDir={finalWindDir} windSpd={finalWindSpd} isDay={isDebug ? progress >= 0.25 && progress <= 0.75 : hourly?.metrics.is_day.forecast[index]} precipitation={isDebug ? snow : undefined} weather={isDebug ? undefined : weather} />
      <Mist visibility={isDebug ? visibility : undefined} isDay={isDebug ? progress >= 0.25 && progress <= 0.75 : hourly?.metrics.is_day.forecast[index]} weather={isDebug ? undefined : weather} />
      <MistOverlay visibility={isDebug ? visibility : undefined} isDay={isDebug ? progress >= 0.25 && progress <= 0.75 : hourly?.metrics.is_day.forecast[index]} weather={isDebug ? undefined : weather} />
      <Umbrella precipitation={isDebug ? precipitation : undefined} weather={isDebug ? undefined : weather} />
      <Thermometer temp={isDebug ? temperature : undefined} snowDepth={isDebug ? depth : snowDepth} weather={isDebug ? undefined : weather} />
    </>
  )
}