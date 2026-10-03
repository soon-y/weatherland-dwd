import { daylightDuration } from "@/lib/param"
import DailyGraphBox from "./graphBox/dailyBarGraphBox"

export default function DailySun({ indexW, setIndexW, sunrise, sunset}) {
  const { hour, min } = daylightDuration(sunrise[indexW], sunset[indexW], false)
  const daylight = daylightDuration(sunrise[indexW], sunset[indexW])

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
            <span>{sunrise[indexW].split('T')[1]}</span>
            <span>{sunset[indexW].split('T')[1]}</span>
          </div>
          <span>{hour + 'h '+ min + 'm'}</span>
        </div>

      </div>

      <DailyGraphBox
        indexW={indexW} setIndexW={setIndexW} min={0} max={24} step={2} unit={'time'}
        barStart={sunrise} barEnd={sunset} barLength={daylight} total={24 * 60 * 60 * 1000}
      />
    </div>
  )
}