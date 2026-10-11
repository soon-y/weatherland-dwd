import { daylightDuration } from "@/lib/param"
import DailyGraphCard from "./graphCard/dailyBarGraphCard"

export default function DailySun({ indexW, setIndexW, sunrise, sunset }) {
  const sunriseValue = sunrise?.[indexW]
  const sunsetValue = sunset?.[indexW]

  const hasData = sunriseValue != null && sunsetValue != null

  const { hour, min } = hasData
    ? daylightDuration(sunriseValue, sunsetValue, false)
    : { hour: null, min: null }

  const daylight = hasData
    ? daylightDuration(sunriseValue, sunsetValue)
    : null

  return (
    <div className="w-full pb-4">
      <div className="pt-4 sm:pt-8">
        <div className="flex justify-between">
          <div className="grid grid-cols-[80px_1fr]">
            <span>Sunrise</span>
            <span>Sunset</span>
          </div>
          <span>Daylight</span>
        </div>

        <div className="text-2xl flex justify-between">
          <div className="grid grid-cols-[80px_1fr]">
            <span>
              {sunriseValue != null
                ? sunriseValue.split('T')[1]
                : 'N/A'}
            </span>

            <span>
              {sunsetValue != null
                ? sunsetValue.split('T')[1]
                : 'N/A'}
            </span>
          </div>

          <span>
            {hasData
              ? `${hour}h ${min}m`
              : 'N/A'}
          </span>
        </div>
      </div>

      <DailyGraphCard
        indexW={indexW} setIndexW={setIndexW} min={0} max={24} step={2} unit={'time'}
        barStart={sunrise} barEnd={sunset} barLength={daylight} total={24 * 60 * 60 * 1000}
      />
    </div>
  )
}