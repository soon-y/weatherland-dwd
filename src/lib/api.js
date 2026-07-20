const API = process.env.NEXT_PUBLIC_FORECAST_API

const metricKeys = [
  "surface_pressure",
  "dewpoint_2m",

  "temperature_2m",
  "temperature_max_12h",
  "temperature_min_12h",

  "precip_amount_1h",
  "precip_amount_24h",
  "precip_duration_1h",
  "precip_snow_amount_1h",
  "precip_liquid_amount_1h",

  "ww_prob_precip_1h",
  "ww_prob_precip_24h",

  "weather_code",
  "weather_code_priority_12h",
  "weather_code_priority_24h",

  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gust_max_1h",

  "visibility",
  "visibility_prob_below_1000m",

  "irradiance_1h",
  "global_irradiance_1h",
  "sunshine_duration_1h",
]

export async function fetchForecast(latitude, longitude, timezone) {
  const encodedTimezone = encodeURIComponent(timezone)
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
  })

  metricKeys.forEach(key => {
    params.append('metricKeys', key)
  })

  const aimpulse = `${API}?${params.toString()}&timeDuration=P%2B7d`

  const baseWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`
  const dailyUrl = `${baseWeatherUrl}&daily=daylight_duration,sunrise,sunset&timezone=${encodedTimezone}&forecast_days=9`
  
  const [dailyRes, forecastRes] = await Promise.all([
    fetch(dailyUrl),
    fetch(aimpulse),
  ])

  if (!dailyRes.ok || !forecastRes.ok) {
    throw new Error("Failed to fetch one or more weather endpoints")
  }

  const [daily, forecast] = await Promise.all([
    dailyRes.json(),
    forecastRes.json(),
  ])

  return {
    daily,
    forecast,
  }
}