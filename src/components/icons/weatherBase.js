export function WeatherBase({ children, size = 32 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, }}>
      {children}
    </div>
  )
}