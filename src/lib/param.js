import { Cloud } from "@/components/icons/cloud"
import { Fog } from "@/components/icons/fog"
import { Layer } from "@/components/icons/layer"
import { Moon } from "@/components/icons/moon"
import { Rain } from "@/components/icons/rain"
import { Snow } from "@/components/icons/snow"
import { Sun } from "@/components/icons/sun"
import { Thunder } from "@/components/icons/thunder"
import { WeatherBase } from "@/components/icons/weatherBase"
import { Thermometer } from "@/components/icons/temp"
import { Wind } from "@/components/icons/wind"
import { Sunrise } from "@/components/icons/sunrise"
import { Eye } from "@/components/icons/eye"
import { Umbrella } from "@/components/icons/umbrella"
import { UV } from "@/components/icons/uv"
import { Air } from "@/components/icons/airQuality"
import { usePathname } from "next/navigation"
import { ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft } from 'lucide-react'

export const param = {
  days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  daysShort: ["S", "M", "T", "W", "T", "F", "S"],
  sliderHeight: 140,
  sliderStyles: 'bg-black/50 backdrop-blur-xl rounded-b-lg rounded-tr-lg',
  weatherBarContainer: 'relative h-[28px]',
  weatherBar: 'absolute inset-y-2.5 h-2 w-full overflow-hidden bg-black/30',
  weatherBarDisc: 'absolute inset-y-2.5 rounded-full h-2 outline-2 outline-white/80 aspect-square bg-white/10',
  weatherDesc: 'text-xs/4 sm:text-sm/5',
  weatherDescMain: 'text-lg sm:text-2xl font-semibold',
  weatherDescSub: 'text-sm/5 sm:text-base/6',
  weatherBoxheight: 'h-[calc(100dvh-40px)]',
  weatherBoxStyles: 'absolute top-12 w-full min-w-[340px] sm:px-[calc((100%-600px)/2)] sm:left-1/2 sm:-translate-x-1/2 overflow-x-hidden',
  max: (arr) => { return Math.ceil(Math.max(...arr) / 10) * 10 },
  min: (arr) => { return Math.floor(Math.min(...arr) / 10) * 10 },
  maxInTwo: (arr1, arr2) => { return Math.ceil(Math.max(...arr1, ...arr2) / 10) * 10 },
  minInTwo: (arr1, arr2) => { return Math.floor(Math.min(...arr1, ...arr2) / 10) * 10 },

  // Scene
  worldPos: [0, 0, 0],
  groundPos: [0, -4, 0],
  camPos: [20, 5, 20],
  groundRadius: 5,
  pondRadius: 4.2,
  pondPos: [-0.5, 0.01, -1.1],
  sunRadius: 15,
  streetlightPos: [0.3, 0.8, -0.1],
  streetlightTargetPos: [0.3, -1, 0.2],
}

export function weatherIcon(code, isDay = 0, background = 1) {
  if (code === 0) return isDay ? <Sun /> : <Moon />

  if ([1, 2].includes(code)) return (isDay ?
    <WeatherBase>
      <Layer style={{ transform: 'translateX(5%) translateY(-5%) scale(0.8)' }}><Sun /></Layer>
      <Layer style={{ transform: 'translateX(-4%) translateY(12%)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
    :
    <WeatherBase>
      <Layer style={{ transform: 'translateX(18%) translateY(-20%) scale(0.8)' }}><Moon cloud={true} /></Layer>
      <Layer style={{ transform: 'translateX(-4%) translateY(12%)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if (code === 3) return (
    <WeatherBase>
      <Layer style={{ transform: 'translateX(10%) translateY(-12%) scale(0.8)', opacity: '50%' }}><Cloud back={true} isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateX(-4%) translateY(12%)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if (code === 45 || code === 48) return (
    <WeatherBase>
      <Layer style={{ transform: 'translateY(-20%) scale(0.8)' }}><Cloud isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateX(0%) translateY(20%)' }}><Fog isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if ([51, 53, 55, 56, 57].includes(code)) return (
    <WeatherBase>
      <Layer style={{ transform: 'scale(0.7) translateX(-30%)', transformOrigin: 'center' }}><Rain isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'scale(0.7) translateX(-0%)', transformOrigin: 'center' }}><Rain isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateY(-20%) scale(0.8)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if ([61, 63, 65, 66, 67].includes(code)) return (
    <WeatherBase>
      <Layer style={{ transform: 'translateX(15%) scale(0.7)' }}><Rain isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateX(0%) scale(0.7)' }}><Rain isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateX(-15%) scale(0.7)' }}><Rain isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateX(-30%) scale(0.7)' }}><Rain isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateY(-20%) scale(0.8)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if ([71, 77].includes(code)) return (
    <WeatherBase>
      <Layer style={{ transform: 'scale(0.6) translateY(50%)', transformOrigin: 'center' }}><Snow isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateY(-20%) scale(0.8)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if (code === 73) return (
    <WeatherBase>
      <Layer style={{ transform: 'scale(0.6) translateX(-20%) translateY(50%)', transformOrigin: 'center' }}><Snow isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'scale(0.6) translateX(20%) translateY(50%)', transformOrigin: 'center' }}><Snow isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateY(-20%) scale(0.8)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if (code === 75) return (
    <WeatherBase>
      <Layer style={{ transform: 'scale(0.6) translateX(-40%) translateY(50%)', transformOrigin: 'center' }}><Snow isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'scale(0.6) translateX(0%) translateY(50%)', transformOrigin: 'center' }}><Snow isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'scale(0.6) translateX(40%) translateY(50%)', transformOrigin: 'center' }}><Snow isDay={isDay} background={background} /></Layer>
      <Layer style={{ transform: 'translateY(-20%) scale(0.8)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if ([80, 81, 82].includes(code)) return (
    <WeatherBase>
      <Layer style={{ transform: 'translateX(15%) scale(0.7)' }}><Rain isDay={isDay} background={background} strokeWidth={3} /></Layer>
      <Layer style={{ transform: 'translateX(0%) scale(0.7)' }}><Rain isDay={isDay} background={background} strokeWidth={3} /></Layer>
      <Layer style={{ transform: 'translateX(-15%) scale(0.7)' }}><Rain isDay={isDay} background={background} strokeWidth={3} /></Layer>
      <Layer style={{ transform: 'translateX(-30%) scale(0.7)' }}><Rain isDay={isDay} background={background} strokeWidth={3} /></Layer>
      <Layer style={{ transform: 'translateY(-20%) scale(0.8)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  if ([85, 86].includes(code)) return (
    <WeatherBase>
      <Layer style={{ transform: 'scale(1.5)' }}><Snow isDay={isDay} background={background} cloud={0} /></Layer>
    </WeatherBase>
  )

  if ([95, 96, 99].includes(code)) return (
    <WeatherBase>
      <Layer style={{ transform: 'translateX(-10%)' }}><Thunder isDay={isDay} background={background} cloud={0} /></Layer>
      <Layer style={{ transform: 'translateY(-20%) scale(0.8)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )

  return (
    <WeatherBase>
      <Layer style={{ transform: 'translateX(-4%) translateY(12%)' }}><Cloud isDay={isDay} background={background} /></Layer>
    </WeatherBase>
  )
}

export function weatherInfo(code, isDay = 1) {
  const map = {
    null: { type: 'null', label: 'null', src: isDay ? '/icon/weather/placeholder.svg' : '/icon/weather/placeholder.svg' },
    0: { type: 'clear', label: 'Clear sky', src: isDay ? '/icon/weather/sun.svg' : '/icon/weather/moon.svg' },

    1: { type: 'clear', label: 'Mainly clear', src: isDay ? '/icon/weather/sun.svg' : '/icon/weather/moon.svg' },
    2: { type: 'cloud', label: 'Partly cloudy', src: isDay ? '/icon/weather/partlySun.svg' : '/icon/weather/partlyMoon.svg' },
    3: { type: 'cloud', label: 'Overcast', src: '/icon/weather/overcast.svg' },

    45: { type: 'fog', label: 'Fog', src: '/icon/weather/fog.svg' },
    48: { type: 'fog', label: 'Rime fog', src: '/icon/weather/fog.svg' },

    51: { type: 'drizzle', intensity: 'light', label: 'Light drizzle', src: '/icon/weather/drizzle.svg' },
    53: { type: 'drizzle', intensity: 'moderate', label: 'Moderate drizzle', src: '/icon/weather/drizzle.svg' },
    55: { type: 'drizzle', intensity: 'heavy', label: 'Heavy drizzle', src: '/icon/weather/drizzle.svg' },

    56: { type: 'freezing_drizzle', intensity: 'light', label: 'Light freezing drizzle', src: '/icon/weather/drizzle.svg' },
    57: { type: 'freezing_drizzle', intensity: 'heavy', label: 'Heavy freezing drizzle', src: '/icon/weather/drizzle.svg' },

    61: { type: 'rain', intensity: 'slight', label: 'Slight rain', src: '/icon/weather/rain.svg' },
    63: { type: 'rain', intensity: 'moderate', label: 'Moderate rain', src: '/icon/weather/rain.svg' },
    65: { type: 'rain', intensity: 'heavy', label: 'Heavy rain', src: '/icon/weather/rain.svg' },

    66: { type: 'freezing_rain', intensity: 'light', label: 'Light freezing rain', src: '/icon/weather/rain.svg' },
    67: { type: 'freezing_rain', intensity: 'heavy', label: 'Heavy freezing rain', src: '/icon/weather/rain.svg' },

    71: { type: 'snow', intensity: 'slight', label: 'Slight snow', src: '/icon/weather/snowLight.svg' },
    73: { type: 'snow', intensity: 'moderate', label: 'Moderate snow', src: '/icon/weather/snowMod.svg' },
    75: { type: 'snow', intensity: 'heavy', label: 'Heavy snow', src: '/icon/weather/snowHeavy.svg' },

    77: { type: 'snow', label: 'Snow grains', src: '/icon/weather/snowLight.svg' },

    80: { type: 'rain_shower', intensity: 'slight', label: 'Slight rain showers', src: '/icon/weather/shower.svg' },
    81: { type: 'rain_shower', intensity: 'moderate', label: 'Moderate rain showers', src: '/icon/weather/shower.svg' },
    82: { type: 'rain_shower', intensity: 'violent', label: 'Violent rain showers', src: '/icon/weather/shower.svg' },

    85: { type: 'snow_shower', intensity: 'slight', label: 'Slight snow showers', src: '/icon/weather/snowflake.svg' },
    86: { type: 'snow_shower', intensity: 'heavy', label: 'Heavy snow showers', src: '/icon/weather/snowflake.svg' },

    95: { type: 'thunderstorm', label: 'Thunderstorm', src: '/icon/weather/thunder.svg' },
    96: { type: 'thunderstorm', intensity: 'light', label: 'Thunderstorm with light hail', src: '/icon/weather/thunder.svg' },
    99: { type: 'thunderstorm', intensity: 'heavy', label: 'Thunderstorm with heavy hail', src: '/icon/weather/thunder.svg' },
  }

  return map[code] || { type: 'unknown', label: 'Unknown', src: '/icon/weather/overcast.svg' }
}

export function titleSvg(title, isDay) {
  if (title === 'uv index') return <UV isDay={isDay} />
  if (title === 'wind') return <Wind isDay={isDay} />
  if (title === 'temperature') return <Thermometer isDay={isDay} />
  if (title === 'visibility') return <Eye isDay={isDay} />
  if (title === 'precipitation') return <Umbrella isDay={isDay} />
  if (title === 'sunrise') return <Sunrise isDay={isDay} sunrise={true} />
  if (title === 'sunset') return <Sunrise isDay={isDay} sunrise={false} />
  if (title === 'air quality') return <Air isDay={isDay} />
}

export function titleIcon(title) {
  const map = {
    'Solar Energy': { src: '/icon/uvIndex.svg', alt: 'Solar Energy' },
    'wind': { src: '/icon/wind.svg', alt: 'wind' },
    'temperature': { src: '/icon/temp.svg', alt: 'temperature' },
    'visibility': { src: '/icon/eye.svg', alt: 'visibility' },
    'pressure': { src: '/icon/gauge.svg', alt: 'pressure' },
    'precipitation': { src: '/icon/rain.svg', alt: 'precipitation' },
    '7-day forecast': { src: '/icon/calendar.svg', alt: 'calendar' },
    'sunrise': { src: '/icon/sunrise.svg', alt: 'sunrise' },
    'daily sun': { src: '/icon/sunrise.svg', alt: 'sunrise' },
    'sunset': { src: '/icon/sunset.svg', alt: 'sunset' },
    'humidity': { src: '/icon/water.svg', alt: 'water' },
  }

  return map[title] || { src: '/icon/uvIndex.svg' }
}

export function todayProgress(date) {
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const currentMinutes = hours * 60 + minutes
  const totalMinutes = 24 * 60

  return (currentMinutes / totalMinutes * 100).toFixed(4)
}

export function timeToSec(hour, min = 0) {
  return hour * 60 * 60 + min * 60
}

export const rainColorList = [
  '#0974b2',
  '#0e87ce',
  '#11bde8',
  '#78d7e8'
]
export function precipIntensity(type, amount) {
  if (amount == null) return ''
  if (type === 'snow') {
    const cm = amount / 10

    if (cm < 1) return 'light'
    if (cm < 5) return 'moderate'
    if (cm < 10) return 'heavy'
    return 'blizzard'
  } else {
    if (amount == 0) return 'No precipitation'
    if (amount < 10) return 'light'
    if (amount < 30) return 'moderate'
    if (amount < 50) return 'heavy'
    return 'torrential'
  }
}

export const uvOffsets = [20, 40, 50, 80]
export const uvColorList = [
  '#A1E142',
  '#FDE047',
  '#FBCC24',
  '#EF4444'
]
export const irradiance = (val) => {
  if (val == null) return { pos: 0, state: "" }

  let max = 95
  let ratio = Math.floor(val / 15 * max)
  let pos = ratio >= max ? max : ratio

  if (val < 500) return { pos, state: "Low" }
  else if (val < 1500) return { pos, state: "Moderate" }
  else if (val < 2500) return { pos, state: "High" }
  else return { pos, state: "Very High" }
}

export const visibilityOffsets = [3, 7, 10, 13, 25]
export const visibilityColorList = [
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#84CC16',
  '#22C55E'
]
export const visibilityInfo = (val) => {
  if (val === null || val === 'Unknown') return { state: "", desc: "" }
  if (val >= 10) return { state: "Clear", desc: "Clear conditions with excellent visibility." }
  if (val >= 5) return { state: "Good", desc: "Good visibility across the area." }
  if (val >= 2) return { state: "Moderate", desc: "Moderate visibility due to haze." }
  if (val >= 1) return { state: "Poor", desc: "Poor visibility because of fog." }
  return { state: "Very poor", desc: "Very poor visibility. Travel may be difficult." }
}

export const pressureOffsets = [10, 35, 60, 100]
export const pressureColorList = [
  '#0094DD',
  '#4FC0F4',
  '#FFE100',
  '#EA0606'
]
export const pressure = (current) => {
  if (current <= 980) return 'Very low'
  else if (current < 1000) return 'Low'
  else if (current < 1020) return 'Normal'
  else if (current < 1040) return 'High'
  else return 'Very high'
}

export const windOffsets = [0, 4, 8, 13, 20, 25]
export const windColorList = [
  '#22D3EE',
  '#64D2B4',
  '#B4C864',
  '#FBBF24',
  '#EF7850',
  '#DB3232'
]
export function getWindLevel(speed) {
  if (speed == null) return null
  if (speed < 2) return "Calm"
  if (speed < 6) return "Light"
  if (speed < 10) return "Breeze"
  if (speed < 15) return "Moderate"
  if (speed < 20) return "Strong"
  return "Storm"
}

export function getWindDirectionArrow(deg, size = 12) {
  if (deg == null) return null

  const directions = [ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft]
  const Icon = directions[Math.floor(((deg + 180) + 22.5) / 45) % 8]

  return (
    <Icon size={size} strokeWidth={2} />
  )
}

export function getWindDirection(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return deg + '° ' + directions[Math.floor((deg + 22.5) / 45) % 8]
}

export const tempColorList = [
  '#85e3f3',
  '#11bde8',
  '#0acb92',
  '#25eb5a',
  '#d9dd0b',
  '#ffc800',
  '#f87103',
  '#e90936'
]
export const tempColorIndex = (i) => {
  if (i < 0) return 0
  else if (i <= 10) return 1
  else if (i <= 15) return 2
  else if (i <= 20) return 3
  else if (i <= 25) return 4
  else if (i <= 30) return 5
  else if (i <= 35) return 6
  else return 7
}

export const useIsDebug = () => {
  const pathname = usePathname()
  return pathname.includes('debug')
}

export const isMobile = (windowWidth) => {
  return windowWidth > 500
}

export const getTimeIndex = (currentTime, timestamps) => {
  const current = new Date(currentTime)

  return timestamps.findIndex(
    time => new Date(time) > current
  )
}

export const weeklyArr = (arr, current) => {
  return [
    ...Array(new Date(current).getHours()).fill(null),
    ...arr
  ]
}

export function getMaxArr(arr) {
  const result = []

  for (let i = 0; i < arr.length; i += 24) {
    const chunk = arr.slice(i, i + 24)

    if (chunk.some(value => value == null)) {
      result.push(null)
    } else {
      result.push(Math.max(...chunk))
    }
  }
  return result
}

export function getMinArr(arr) {
  const result = []

  for (let i = 0; i < arr.length; i += 24) {
    const chunk = arr.slice(i, i + 24)

    if (chunk.some(value => value == null)) {
      result.push(null)
    } else {
      result.push(Math.min(...chunk))
    }
  }
  return result
}

export function getTotalSumArr(arr) {
  const result = []

  for (let i = 0; i < arr.length; i += 24) {
    const chunk = arr.slice(i, i + 24)

    if (chunk.some(value => value == null)) {
      result.push(null)
    } else {
      const sum = chunk.reduce((a, b) => a + b, 0)
      result.push(+sum.toFixed(1))
    }
  }

  return result
}

export function getAvgArr(arr, divide = 1) {
  const result = []

  for (let i = 0; i < arr.length; i += 24) {
    const chunk = arr.slice(i, i + 24)

    if (chunk.some(value => value == null)) {
      result.push(null)
    } else {
      const sum = chunk.reduce((a, b) => a + b, 0)
      result.push(Math.round((sum / chunk.length) / divide))
    }
  }

  return result
}