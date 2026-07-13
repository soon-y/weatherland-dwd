const API = process.env.NEXT_PUBLIC_GEOAPLIFY_API

export async function reverseGeo(lat, lon) {
  if (lat == null || lon == null) return null

  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${API}`
  const res = await fetch(url)
  const result = await res.json()
  const props = result.features?.[0]?.properties

  return {
    timezone: props?.timezone?.name
      ? props.timezone.name
      : "",
    offset: props?.timezone?.offset_STD || "+00:00",
    suburb: props?.suburb || props?.district || props?.city || "Unknown",
    postcode: props?.postcode || "Zip code",
    country: props?.country || "Country",
  }
}

export async function forwardGeo(place, zip, country) {
  if (place == null && zip == null && country == null) return null

  let url = 'https://api.geoapify.com/v1/geocode/search?'
  if (place != "Unknown" && place != "") url += `name=${place}&`
  if (zip != "Zip code" && zip != "") url += `postcode=${zip}&`
  if (country != "Unknown" && country != "") url += `country=${country}&`

  const res = await fetch(url + `format=json&apiKey=${API}`)
  const result = await res.json()
  const props = result.results[0]

  return {
    timezone: props?.timezone?.name
      ? encodeURIComponent(props.timezone.name)
      : "",
    offset: props?.timezone?.offset_STD || "+00:00",
    suburb: props?.suburb || props?.district || props?.city || props?.country || "Unknown",
    postcode: props?.postcode || 'Zip code',
    country: props?.country || 'Unknown',
    lat: props?.lat || 0,
    lon: props?.lon || 0,
  }
}