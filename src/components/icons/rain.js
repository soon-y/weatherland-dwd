export function Rain({ isDay, background, strokeWidth = 2 }) {
  const style = {
    fill: 'none',
    stroke: isDay && !background ? '#92ccff' : '#fff',
    strokeLinecap: 'round',
    strokeMiterlimit: 100,
    strokeWidth
  }

  return (
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="32"
      height="32"
    >
      <path className="animate-raindrop"
        fillRule="evenodd"
        d="m17 22l-3.8 4.9"
        style={style}
      />
    </svg>
  )
}