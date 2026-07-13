export function Fog({ isDay, background}) {
  const style = {
    fill: 'none',
    stroke: isDay && !background ? '#84c6ff' : '#fff',
    strokeLinecap: 'round',
    strokeMiterlimit: 100,
    strokeWidth: 2
  }

  return (
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="32"
      height="32"
    >
      <g className="animate-wiggle">
        <path
          fillRule="evenodd"
          d="m6 15h16"
          style={style}
        />
        <path
          fillRule="evenodd"
          d="m10 19h16"
          style={style}
        />
      </g>

    </svg>
  )
}