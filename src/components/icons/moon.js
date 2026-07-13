export function Moon({cloud = false}) {
  const fillStyle = { fill: '#ffcf00' }

  return (
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="32"
      height="32"
    >
      <path className="scale-90 -translate-x-[2px] translate-y-[1px] origin-center"
        d="m14.3 6c-5.8 1.3-9.4 7-8.1 12.8 1.3 5.8 7.1 9.4 12.8 8.1 2.9-0.7 5.2-2.4 6.6-4.6 0.2-0.3 0.2-0.7 0-0.9-0.2-0.3-0.6-0.4-0.9-0.3q-0.6 0.3-1.4 0.5c-4.5 1-9-1.8-10-6.4-0.7-3.1 0.3-6.1 2.5-8.1 0.3-0.2 0.3-0.6 0.2-0.9-0.1-0.3-0.5-0.5-0.8-0.4q-0.5 0.1-0.9 0.2z"
        style={fillStyle}
      />

      {!cloud && 
      <g className="animate-[pulse_4s_linear_infinite]">
        <path
          fillRule="evenodd"
          d="m22 8l-1 5-1-5 1-5z"
          style={fillStyle}
        />
        <path
          fillRule="evenodd"
          d="m21 9l-5-1 5-1 5 1z"
          style={fillStyle}
        />
      </g>}

      {!cloud && 
      <g className="animate-[pulse_2s_linear_infinite]">
        <path
          fillRule="evenodd"
          d="m26.8 17l-0.8 4-0.8-4 0.8-4z"
          style={fillStyle}
        />
        <path
          fillRule="evenodd"
          d="m26 17.8l-4-0.8 4-0.8 4 0.8z"
          style={fillStyle}
        />
      </g>}
    </svg>
  )
}