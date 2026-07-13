export default function MoonImg({ phase }) {
  const size = 200
  const r = size / 2
  const cx = r
  const cy = r

  const scaleX = 1 - 0.9 * Math.abs(Math.sin((phase * Math.PI) / 180))
  const scaleY = 1 + 0.5 * Math.abs(Math.sin((phase * Math.PI) / 180))
  const gradient = 100 - 50 * Math.abs(Math.sin((phase * Math.PI) / 180))

  let moonIs = ''
  if (phase < 90) moonIs = 'waxingBefore'
  else if (phase < 180) moonIs = 'waxingAfter'
  else if (phase < 270) moonIs = 'waningAfter'
  else moonIs = 'waningBefore'

  const gradWhiteId = `circleWhite-${phase}`
  const gradBlackId = `circleBlack-${phase}`
  const maskId = `moonMask-${Math.round(phase)}`

  return (
    <>
      <div className="relative w-full aspect-square ">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full rounded-full overflow-hidden">
          <image href="/weather/moon/moon.png" x="0" y="0" width={size} height={size} className="opacity-20" />

          <defs>
            <radialGradient id={gradBlackId} cx="50%" cy="50%" r="50%">
              <stop offset={gradient + '%'} stopColor="black" />
              <stop offset="100%" stopColor="white" />
            </radialGradient>

            <radialGradient id={gradWhiteId} cx="50%" cy="50%" r="50%">
              <stop offset={gradient + '%'} stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>

            <radialGradient id='shadow' cx="50%" cy="50%" r="50%">
              <stop offset='70%' stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
            </radialGradient>

            <mask id={maskId}>
              <g transform={`rotate(${-phase * 0.1 - 8}, ${cx}, ${cy})`}>
                <rect width={size} height={size} fill="white" />
                <rect width={size / 2} height={size} x={moonIs.includes('waxing') ? 0 : size / 2} fill="black" />

                {(moonIs === 'waxingAfter' || moonIs === 'waningAfter') &&
                  <circle cx={r} cy={r} r={r} fill={`url(#${gradWhiteId})`} className="duration-500"
                    transform={`translate(${cx} ${cy}) scale(${scaleX}, ${scaleY}) translate(-${cx} -${cy})`} />
                }

                {moonIs.includes('After') && <rect width={size / 2} height={size} x={moonIs.includes('waxing') ? size / 2 : 0} fill="white" />}

                {(moonIs === 'waxingBefore' || moonIs === 'waningBefore') &&
                  <circle cx={r} cy={r} r={r} fill={`url(#${gradBlackId})`} className="duration-500"
                    transform={`translate(${cx} ${cy}) scale(${scaleX}, ${scaleY}) translate(-${cx} -${cy})`}
                  />
                }

                {moonIs.includes('Before') && <rect width={size / 2} height={size} x={moonIs.includes('waning') ? size / 2 : 0} fill="black" />}

                <circle cx={r} cy={r} r={r} fill={`url(#shadow)`} />
              </g>
            </mask>
          </defs>

          <image className="duration-500" transform={`rotate(${phase * 0.1}, ${cx}, ${cy})`}
            href="/weather/moon/moon.png" x="0" y="0" width={size} height={size}
            mask={`url(#${maskId})`} preserveAspectRatio="xMidYMid slice"
          />
        </svg>
      </div>
    </>
  )
}