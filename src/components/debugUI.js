import { useIsDebug } from "@/lib/param"
import { LevaPanel } from "leva"

export default function DebugUI({ store }) {
  const isDebug = useIsDebug()
  if (!isDebug) return null
  return <LevaPanel store={store} />
}