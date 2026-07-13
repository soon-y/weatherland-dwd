export default function Box({ style, children, setDisplay, title, setBoxClicked, className }) {
  const boxStyleForecast = 'w-full'
  const boxStyleWide = 'aspect-2/1 w-full sm:w-[calc(66.9%-7px)] sm:aspect-[2.5]'
  const boxStyleSquare = 'flex flex-col justify-between aspect-square w-[calc(50%-6px)] sm:w-[calc(33.3%-8px)]'

  return (
    <div className={`${className} bg-white/20 rounded-xl px-3 py-2 sm:px-4 sm:py-3 select-none duration-500 hover:outline-1 hover:outline-white/50 transition-all
    ${style === 'forecast' && boxStyleForecast}
    ${style === 'wide' && boxStyleWide}
    ${style === 'square' && boxStyleSquare}
    `} onClick={() => {
        if (style !== 'forecast') {
          setDisplay(title)
          setBoxClicked(true)
        }
      }}>
      {children}
    </div>
  )
}