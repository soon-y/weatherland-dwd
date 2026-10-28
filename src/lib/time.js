export function timeToSec(timestamp) {
  if (
    typeof timestamp !== 'string' ||
    !timestamp.includes('T') ||
    Number.isNaN(new Date(timestamp).getTime())
  ) {
    return null
  }
  const time = timestamp.split('T')[1]
  return Number(time.split(':')[0]) * 3600 + Number(time.split(':')[1]) * 60
}