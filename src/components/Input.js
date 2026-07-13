"use client";
import { useEffect, useState } from "react";

export default function Input({
  hide, label, unit, value, flag,
  updateLat, updateLon, lat, long,
  updateSuburb, updatePostcode, updateCountry, suburb, postcode, country,
}) {
  const [open, setOpen] = useState(false)
  const [tempLat, setTempLat] = useState(lat)
  const [tempLong, setTempLong] = useState(long)
  const [tempSub, setTempSub] = useState(suburb)
  const [tempPost, setTempPost] = useState(postcode)
  const [tempCo, setTempCo] = useState(country)
  const styles = 'w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[400px] xl:w-[400px] py-2'
  const btnStyles = 'text-sm font-semibold uppercase bg-white/60 rounded-full hover:bg-white/80 duration-400 cursor-pointer text-black'
  const inputStyles = 'outline-none focus:outline-none focus:ring-0 bg-white py-2 px-3 rounded-lg text-black'

  useEffect(() => {
    setTempLat(lat)
    setTempLong(long)
    setTempSub(suburb)
    setTempPost(postcode)
    setTempCo(country)
  }, [lat, long, suburb, postcode, country])

  return (
    <div>
      <div
        onClick={() => { if (!hide) setOpen(true) }}
        className={`flex bg-white/40 backdrop-blur-lg py-1 px-2 rounded-full text-black 
          ${!hide && 'cursor-pointer'}
          ${label == 'Region' ? 'font-bold text-base sm:text-lg' : 'text-xs sm:text-base '}   
      `}>
        {value}{unit}
      </div>

      <div className={`transition-all duration-400 bg-black/30 backdrop-blur-lg fixed top-0 right-0 grid place-items-center z-100
        ${open ? "w-[100vw] h-[100vh] opacity-100" : "opacity-0 w-0 h-0 "}
      `}>
        {
          (label == 'Latitude' || label == 'Longitude') ?
            <div className={`${styles} grid grid-flow-rows grid-cols-2 gap-x-2 sm:gap-x-3 gap-y-1 items-center`}>
              <label className="text-white font-bold">Latitude</label>
              <label className="text-white font-bold">Longitude</label>
              <input
                type='number'
                value={tempLat}
                onChange={(e) => setTempLat(e.target.value)}
                placeholder={'Latitude'}
                className={`${inputStyles}`}
              />
              <input
                type='number'
                value={tempLong}
                onChange={(e) => setTempLong(e.target.value)}
                placeholder={'Longitude'}
                className={`${inputStyles}`}
              />

              <div className="mt-2 sm:mt-4 grid gap-0 sm:gap-2">
                <button
                  onClick={() => {
                    setOpen(!open)
                    updateLat(tempLat)
                    updateLon(tempLong)
                    flag(label)
                  }}
                  className={`${styles} ${btnStyles} my-2`}
                >
                  save
                </button>
                <button
                  onClick={() => {
                    setOpen(!open)
                    setTempLat(lat)
                    setTempLong(long)
                  }}
                  className={`${styles} ${btnStyles}`}
                >
                  close
                </button>
              </div>
            </div> :
            <div className={`${styles} grid gap-2 sm:gap-x-3 sm:gap-y-4 items-center`}>
              <div className="flex flex-col gap-1">
                <label className="text-white font-bold">Area</label>
                <input
                  type='text'
                  value={tempSub}
                  onChange={(e) => setTempSub(e.target.value)}
                  placeholder={'Place'}
                  className={`${inputStyles}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white font-bold">Postcode</label>
                <input
                  type='text'
                  value={tempPost}
                  onChange={(e) => setTempPost(e.target.value)}
                  placeholder={'Postcode'}
                  className={`${inputStyles}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-white font-bold">Country</label>
                <input
                  type='text'
                  value={tempCo}
                  onChange={(e) => setTempCo(e.target.value)}
                  placeholder={'Country'}
                  className={`${inputStyles}`}
                />
              </div>

              <div className="mt-2 sm:mt-4 grid gap-0 sm:gap-2">
                <button
                  onClick={() => {
                    setOpen(!open)
                    updateSuburb(tempSub)
                    updatePostcode(tempPost)
                    updateCountry(tempCo)
                    flag(label)
                  }}
                  className={`${styles} ${btnStyles} my-2`}
                >
                  save
                </button>
                <button
                  onClick={() => {
                    setOpen(!open)
                    setTempSub(suburb)
                    setTempPost(postcode)
                    setTempCo(country)
                  }}
                  className={`${styles} ${btnStyles}`}
                >
                  close
                </button>
              </div>
            </div>
        }
      </div>
    </div>
  )
}