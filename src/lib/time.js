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

export function getNextDayEndUTC(date, hour = 0) {
  const end = new Date(`${date}T00:00:00Z`)
  end.setUTCDate(end.getUTCDate() + 1)
  end.setUTCHours(hour)

  return end.toISOString()
}