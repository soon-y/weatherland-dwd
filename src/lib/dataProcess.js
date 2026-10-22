export function processForecast(data, timezone) {

  const result = structuredClone(data.forecast.data)
  const daily = data.daily.daily

  const temperature = result.find(item => item.metricKey === 'temperature_2m')
  const dewPoint = result.find(item => item.metricKey === 'dewpoint_2m')

console.log(temperature.forecast[0])

  const isHourlyMetric = metric =>
    metric.metricKey === 'temperature_2m' ||
    metric.metricKey.includes('1h') ||
    metric.metricKey.includes('10m') ||
    metric.metricKey.includes('dewpoint_2m') ||
    metric.metricKey.includes('surface_pressure')

  const timestampSource =
    temperature ??
    result.find(metric =>
      isHourlyMetric(metric) &&
      metric.forecast?.some(item => item?.timestamp != null)
    )

  const timestamps = (timestampSource?.forecast ?? []).map(item =>
    toLocalTimestamp(item.timestamp, timezone)
  )

  // DST correction
  for (let i = 1; i < timestamps.length; i++) {
    const prev = timestamps[i - 1]
    const current = timestamps[i]

    if (!prev || !current) continue

    // ----------------------------------------
    // 1. Overlapping hour
    // ----------------------------------------

    if (prev === current) {
      timestamps.splice(i, 1)

      result.forEach(metric => {
        if (!isHourlyMetric(metric)) return

        metric.forecast.splice(i, 1)
      })

      i--
      continue
    }

    // ----------------------------------------
    // 2. Missing hour
    // ----------------------------------------

    const prevTime = timestampToNumber(prev)
    const currentTime = timestampToNumber(current)

    const oneHour = 60 * 60 * 1000

    if (currentTime - prevTime > oneHour) {
      const missingTimestamp = formatTimestamp(
        new Date(prevTime + oneHour)
      )

      timestamps.splice(i, 0, missingTimestamp)

      result.forEach(metric => {
        if (!isHourlyMetric(metric)) return

        // 현재(뒤) 데이터 복사
        const nextItem = metric.forecast[i]

        metric.forecast.splice(i, 0, {
          ...nextItem,
          timestamp: missingTimestamp
        })
      })
    }
  }

  if (daily.sunrise && daily.sunset) {
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
  }

  result.forEach(metric => {
    if (
      (metric.metricKey.includes('24h') ||
        metric.metricKey.includes('12h')) &&
      metric.forecast.length &&
      typeof metric.forecast[0] === 'object'
    ) {
      metric.timestamps = metric.forecast.map(item =>
        toLocalTimestamp(item.timestamp, timezone)
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

  if (dewPoint && temperature) {
    result.push({
      metricKey: 'relative_humidity',
      unit: '%',
      description: 'Calculated relative humidity',
      forecast: temperature.forecast.map((temp, i) =>
        calcRelativeHumidity(temp, dewPoint.forecast[i])
      )
    })
  }

  if (temperature) {
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
  }

  const metrics = Object.fromEntries(
    result.map(({ metricKey, ...rest }) => [
      metricKey,
      rest
    ])
  )
  return {
    timestamps,
    metrics,
    daily
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

function toLocalTimestamp(timestamp, timeZone) {
  const date = new Date(new Date(timestamp).getTime() - 60 * 60 * 1000)

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const p = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  )

  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`
}

function timestampToNumber(timestamp) {
  const [date, time] = timestamp.split('T')
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute, second] = time.split(':').map(Number)

  return Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    second
  )
}