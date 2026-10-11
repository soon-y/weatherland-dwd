import { titleIcon } from "@/lib/param"

export default function BoxTitle({ title }) {
  if (!title) return

  return (
    <div className="flex gap-1 items-center opacity-60 mb-1">
      <img src={titleIcon(title).src} alt={titleIcon(title).alt} />
      <p className={`font-bold text-xs sm:text-sm uppercase`}>{title}</p>
    </div>
  )
}