export function useGlobal() {
  const humanizeTime = (duration: number) => {
    const hour = Math.floor(duration / 3600) || 0
    const minute = Math.floor((duration % 3600) / 60) || 0
    const second = Math.floor(duration % 60) || 0

    let secMin = ''

    if (hour > 0) {
      secMin += `${hour}:${minute < 10 ? '0' : ''}`
    }

    secMin += `${minute}:${second < 10 ? '0' : ''}`
    secMin += `${second}`
    return secMin
  }

  return { humanizeTime }
}
