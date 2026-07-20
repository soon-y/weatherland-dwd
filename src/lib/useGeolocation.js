"use client"
import { useState, useEffect } from "react"

export function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  })

  useEffect(() => {
    const getIPLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/")
        const data = await res.json()

        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          error: null,
        })
      } catch {
        setLocation((prev) => ({
          ...prev,
          error: "IP location failed",
        }))
      }
    }

    if (!navigator.geolocation) {
      getIPLocation()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude.toFixed(3),
          longitude: position.coords.longitude.toFixed(3),
          error: null,
        })
      },
      () => {
        getIPLocation()
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      }
    )
  }, [])

  return location
}