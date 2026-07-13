export function Sun(props) {
  const fillStyle = { fill: '#ffcf00' }

  return (
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="32"
      height="32"
      {...props}
    >
      <g className="animate-[spin_10s_linear_infinite] origin-center">
        <path
          d="m25.1 14.1l3.9 1.9-3.9 2zm-18.3 3.8l-3.8-1.9 3.8-1.9zm11.1 7.2l-2 3.8-1.9-3.8zm-3.8-18.3l1.9-3.9 1.9 3.9z"
          style={fillStyle}
        />
        <path
          d="m23.8 21.2l1.3 4-4-1.3zm-15.7-10.3l-1.3-4.1 4 1.4zm2.7 13l-4 1.3 1.3-4zm10.3-15.7l4.1-1.3-1.4 4z"
          style={fillStyle}
        />
      </g>

      <path
        fillRule="evenodd"
        d="m16.1 9.3c3.9 0 7 3.1 7 6.9 0 3.9-3.1 7-7 7-3.8 0-6.9-3.1-6.9-7 0-3.8 3.1-6.9 6.9-6.9z"
        style={fillStyle}
      />
    </svg>
  )
}