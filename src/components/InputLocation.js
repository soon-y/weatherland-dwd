import { useGeolocation } from '@/app/api/weather/useGeolocation'
import { reverseGeo, forwardGeo } from '@/app/api/weather/geoaplify'
import { useEffect, useState } from 'react'
import Input from './Input'

export default function InputArea({ setGeolocation, hide }) {
  const { latitude, longitude, errorGeo } = useGeolocation()
  const [suburbArea, setSuburbArea] = useState("Unknown")
  const [postcodeVal, setPostcodeVal] = useState('Zip code')
  const [latitudeVal, setLatitudeVal] = useState(0)
  const [longitudeVal, setLongitudeVal] = useState(0)
  const [countryVal, setCountryVal] = useState('Country')
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    if ((latitude == 0 && longitude == 0) ||(latitude == null && longitude == null)) return

    const fetchInfo = async () => {
      try {
        const { suburb, postcode, country, timezone, offset } = await reverseGeo(latitude, longitude)
        setLatitudeVal(latitude)
        setLongitudeVal(longitude)
        setGeolocation({ lat: latitude, lon: longitude, timezone, offset })
        setSuburbArea(suburb)
        setPostcodeVal(postcode)
        setCountryVal(country)
      } catch (err) {
        console.log(err)
      }
    }

    fetchInfo()
  }, [latitude, longitude])

  useEffect(() => {
    if (flag == 'Latitude' || flag == 'Longitude') {
      const fetchInfo = async () => {
        try {
          const { suburb, postcode, country, timezone, offset } = await reverseGeo(latitudeVal, longitudeVal)
          setSuburbArea(suburb)
          setPostcodeVal(postcode)
          setCountryVal(country)
          setGeolocation({ lat: latitudeVal, lon: longitudeVal, timezone, offset })
        } catch (err) {
          console.log(err)
        }
      }
      fetchInfo()
    } else if (flag == 'Region' || flag == 'Postcode' || flag == 'Country') {
      const fetchInfo = async () => {
        try {
          const { lat, lon, suburb, postcode, country, timezone, offset } = await forwardGeo(suburbArea, postcodeVal, countryVal)
          setLatitudeVal(lat)
          setLongitudeVal(lon)
          setGeolocation({ lat, lon, timezone, offset })
          setSuburbArea(suburb)
          setPostcodeVal(postcode)
          setCountryVal(country)
        } catch (err) {
          console.log(err)
        }
      }
      fetchInfo()
    }

    if (flag != false) setFlag(false)
  }, [flag])

  function formatLat(lat) {
    const direction = lat >= 0 ? "N" : "S"
    return `° ${direction}`
  }

  function formatLon(lon) {
    const direction = lon >= 0 ? "E" : "W"
    return `° ${direction}`
  }

  function formatNumber(num) {
    const absNum = Math.abs(num)
    const decimals = absNum.toString().split(".")[1]

    return decimals && decimals.length > 2
      ? absNum.toFixed(2)
      : absNum
  }

  return (
    <div>
      {latitudeVal != null && longitudeVal != null && suburbArea && postcodeVal &&
        <div>
          {!hide ?
            <div className='p-2'>
              <div className={'font-bold text-base sm:text-lg flex py-1 px-2 text-white'}>
                {suburbArea}
              </div>
            </div>
            :
            <div className='p-2 grid place-items-end gap-1'>
              <Input
                label={"Region"}
                value={suburbArea}
                flag={setFlag}
                suburb={suburbArea}
                postcode={postcodeVal}
                country={countryVal}
                updateSuburb={setSuburbArea}
                updatePostcode={setPostcodeVal}
                updateCountry={setCountryVal}
              />
              <Input
                label={"Postcode"}
                value={postcodeVal}
                flag={setFlag}
                suburb={suburbArea}
                postcode={postcodeVal}
                country={countryVal}
                updateSuburb={setSuburbArea}
                updatePostcode={setPostcodeVal}
                updateCountry={setCountryVal}
              />
              <Input
                label={"Country"}
                value={countryVal}
                flag={setFlag}
                suburb={suburbArea}
                postcode={postcodeVal}
                country={countryVal}
                updateSuburb={setSuburbArea}
                updatePostcode={setPostcodeVal}
                updateCountry={setCountryVal}
              />
              <Input
                label={"Latitude"}
                value={formatNumber(latitudeVal)}
                unit={formatLat(latitudeVal)}
                flag={setFlag}
                lat={latitudeVal}
                long={longitudeVal}
                updateLat={setLatitudeVal}
                updateLon={setLongitudeVal}
              />
              <Input
                label={"Longitude"}
                value={formatNumber(longitudeVal)}
                unit={formatLon(longitudeVal)}
                flag={setFlag}
                lat={latitudeVal}
                long={longitudeVal}
                updateLat={setLatitudeVal}
                updateLon={setLongitudeVal}
              />
            </div>}
        </div>
      }
    </div>
  )
}