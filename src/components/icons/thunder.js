export function Thunder() {
  const fillStyle = { fill: '#ffcf00' }

  return (
    <svg
      viewBox="0 0 32 32"
      width="100%"
      height="100%"
    >
      <path className={`animate-thunder origin-center`}
        d="m13 23l0.4-3.6c0.1-0.2 0.3-0.4 0.5-0.4h2.7c0.2 0 0.4 0.2 0.4 0.4q0 0.1 0 0.2l-0.8 1.9h2.2c0.3 0 0.6 0.3 0.6 0.6q0 0.2-0.1 0.3l-3 4.4q-0.2 0.2-0.4 0.2h-0.1c-0.2 0-0.4-0.2-0.4-0.4q0-0.1 0-0.1l0.7-3h-2.2c-0.3 0-0.5-0.2-0.5-0.5z"
        style={fillStyle}
      />
    </svg>
  )
}