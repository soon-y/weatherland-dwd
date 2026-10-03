const API = process.env.NEXT_PUBLIC_GEOAPIFY_API

export async function reverseGeo(lat, lon) {
  if (lat == null || lon == null) return null

  const fallback = {
    timezone: "Europe/Berlin",
    offset: "+01:00",
    suburb: "Unknown",
    postcode: "Zip code",
    country: "Country",
  }

  try {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API}`
    const res = await fetch(url)

    if (!res.ok) return fallback

    const result = await res.json()
    const props = result.features?.[0]?.properties

    if (!props) return fallback

    return {
      timezone: props.timezone?.name || "",
      offset: props.timezone?.offset_STD || "+00:00",
      suburb: props.suburb || props.district || props.city || "Unknown",
      postcode: props.postcode || "Zip code",
      country: props.country || "Country",
    }
  } catch {
    return fallback
  }
}

export async function forwardGeo(place, zip, country) {
  const fallback = {
    timezone: "Europe/Berlin",
    offset: "+01:00",
    suburb: "HafenCity",
    postcode: "20457",
    country: "Germany",
    lat: 53.542,
    lon: 9.993,
  }

  const params = new URLSearchParams({
    format: "json",
    apiKey: API,
  })

  if (place && place !== "Unknown") params.set("name", place)
  if (zip && zip !== "Zip code") params.set("postcode", zip)
  if (country && country !== "Unknown" && country !== "Country") {
    params.set("country", country)
  }

  if (
    !params.has("name") &&
    !params.has("postcode") &&
    !params.has("country")
  ) {
    return null
  }

  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/search?${params}`
    )

    if (!res.ok) return fallback

    const result = await res.json()
    const props = result.results?.[0]

    if (
      !Number.isFinite(props?.lat) ||
      !Number.isFinite(props?.lon)
    ) {
      return fallback
    }

    return {
      timezone: props.timezone?.name || "",
      offset: props.timezone?.offset_STD || "+00:00",
      suburb:
        props.suburb ||
        props.district ||
        props.city ||
        props.country ||
        "Unknown",
      postcode: props.postcode || "Zip code",
      country: props.country || "Unknown",
      lat: Number(props.lat.toFixed(3)),
      lon: Number(props.lon.toFixed(3)),
    }
  } catch {
    return fallback
  }
}