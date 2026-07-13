import { titleSvg } from "@/lib/param";

export default function InfoBox({title=null, info1, unit1 = '', info2 = '', unit2 = '', condition = true, isDay = 0, info3 = null}) {
  return (
    <>
      {condition &&
        <div className="flex gap-1 items-center text-xs sm:text-sm">
          {title && <div className="mr-1">{titleSvg(title, isDay)}</div>}
          {info3 && <p className="font-light">{info3}</p>}
          <p>{info1}<span className="text-xs">{unit1}</span></p>
          <p>{info2}<span className="text-xs">{unit2}</span></p>
        </div>
      }
    </>
  )
}