export function Cloud({ opacity = 1, isDay, back = false, background }) {
  const style = { fill: isDay && !background? '#a0d3ff' : '#fff', opacity }

  return (
    <svg
      viewBox="0 0 32 32"
      width="100%"
      height="100%"
    >
      <path className={`${back && 'animate-pulse'}`}
        d="m11.9 24.3c-4.6 0-8.2-3.6-8.2-8.1 0-4.5 3.6-8.2 8.2-8.2 4.5 0 8.1 3.7 8.1 8.2 0 4.5-3.6 8.1-8.1 8.1zm11 0c-2.9 0-5.3-2.3-5.3-5.3 0-2.9 2.4-5.3 5.3-5.3 2.9 0 5.3 2.4 5.3 5.3 0 3-2.4 5.3-5.3 5.3zm-0.4-4v4.2h-9.8v-4.2z"
        style={style}
      />
    </svg>
  )
}