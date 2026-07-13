export function Layer({ children, style }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        ...style
      }}
    >
      {children}
    </div>
  )
}