export function processForecast(data, offset, daily) {
  const result = structuredClone(data)

  const offsetMs = parseOffset(offset)
  const temperature = result.find(item => item.metricKey === 'temperature_2m')
  const dewPoint = result.find(item => item.metricKey === 'dewpoint_2m')

  const timestamps = temperature.forecast.map(item =>
    new Date(new Date(item.timestamp).getTime() + offsetMs)
      .toISOString()
      .replace('Z', '')
  )

  const dayMap = Object.fromEntries(
    daily.sunrise.map((sunrise, i) => [
      sunrise.slice(0, 10),
      {
        sunrise,
        sunset: daily.sunset[i]
      }
    ])
  )

  function isDay(timestamp) {
    const day = dayMap[timestamp.slice(0, 10)]
    if (!day) return false

    const current = new Date(timestamp)

    return (
      current >= new Date(day.sunrise) &&
      current < new Date(day.sunset)
    )
  }

  result.push({
    metricKey: 'is_day',
    unit: 'boolean',
    description: 'Is daytime',
    forecast: timestamps.map((temp) => isDay(temp))
  })

  result.forEach(metric => {
  if (
    (metric.metricKey.includes('24h') ||
      metric.metricKey.includes('12h')) &&
    metric.forecast.length &&
    typeof metric.forecast[0] === 'object'
  ) {
    metric.timestamps = metric.forecast.map(item =>
      new Date(new Date(item.timestamp).getTime() + offsetMs)
        .toISOString()
        .replace('Z', '')
    )
  }

  metric.forecast = metric.forecast.map(item => item?.value ?? item)

  if (metric.unit === 'Pa') {
    metric.forecast = metric.forecast.map(value =>
      Math.round(value / 100)
    )
    metric.unit = 'hPa'
  }

  if (metric.unit === 'm/s') {
    metric.forecast = metric.forecast.map(value =>
      +(value * 3.6).toFixed(1)
    )
    metric.unit = 'km/h'
  }

  if (
    metric.metricKey.includes('temperature') ||
    metric.metricKey.includes('dewpoint_2m')
  ) {
    metric.forecast = metric.forecast.map(value =>
      +(value - 273.15).toFixed(1)
    )
    metric.unit = '°C'
  }
})

  result.push({
    metricKey: 'relative_humidity',
    unit: '%',
    description: 'Calculated relative humidity',
    forecast: temperature.forecast.map((temp, i) =>
      calcRelativeHumidity(temp, dewPoint.forecast[i])
    )
  })

    const { min, max } = calcDailyMinMax(
    temperature.forecast,
    timestamps
  )

  result.push({
    metricKey: 'daily_min_temperature',
    unit: '°C',
    forecast: min
  })

  result.push({
    metricKey: 'daily_max_temperature',
    unit: '°C',
    forecast: max
  })

  const metrics = Object.fromEntries(
    result.map(({ metricKey, ...rest }) => [
      metricKey,
      rest
    ])
  )
  return {
    timestamps,
    metrics
  }
}

function calcRelativeHumidity(tempC, dewPointC) {
  const a = 17.625
  const b = 243.04

  const saturationVaporPressure =
    Math.exp((a * tempC) / (b + tempC))

  const actualVaporPressure =
    Math.exp((a * dewPointC) / (b + dewPointC))

  return Math.max(
    0,
    Math.min(100, (actualVaporPressure / saturationVaporPressure) * 100).toFixed(1)
  )
}

function calcDailyMinMax(values, timestamps) {
  const daily = {}

  values.forEach((value, i) => {
    const day = timestamps[i].slice(0, 10)

    if (!daily[day]) {
      daily[day] = {
        min: value,
        max: value
      }
    } else {
      daily[day].min = Math.min(daily[day].min, value)
      daily[day].max = Math.max(daily[day].max, value)
    }
  })

  const min = []
  const max = []

  Object.values(daily).forEach(value => {
    min.push(value.min)
    max.push(value.max)
  })

  return { min, max }
}

function parseOffset(offset) {
  const sign = offset.startsWith('-') ? -1 : 1
  const [hours, minutes] = offset.slice(1).split(':').map(Number)

  return sign * (hours * 60 + minutes) * 60 * 1000
}