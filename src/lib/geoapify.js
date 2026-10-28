const API = process.env.NEXT_PUBLIC_GEOAPIFY_API

export async function reverseGeo(lat, lon) {
  if (lat == null || lon == null) return null

  try {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API}`
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error('Reverse geocoding request failed')
    }

    const result = await res.json()
    const props = result.features?.[0]?.properties

    if (!props?.timezone?.name) {
      throw new Error('Location timezone unavailable')
    }

    return {
      timezone: props.timezone?.name || "",
      suburb: props.suburb || props.district || props.city || "Unknown",
      postcode: props.postcode || "Zip code",
      country: props.country || "Country",
    }
  } catch {
    alert('Unable to retrieve location details. Please try another location.')
    return null
  }
}

export async function forwardGeo(place, zip, country) {
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

    if (!res.ok) {
      throw new Error('Geocoding request failed')
    }

    const result = await res.json()
    const props = result.results?.[0]

    if (
      !Number.isFinite(props?.lat) || !Number.isFinite(props?.lon)
    ) {
      throw new Error('No matching location found')
    }

    return {
      timezone: props.timezone?.name || "",
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
    return null
  }
}