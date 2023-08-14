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

  const formatSources = (sources: any = [], isAudio = true) => {
    const hlsId = isAudio ? 'mp4a' : 'hls'
    let audioSources = []

    if (sources && sources.length) {
      audioSources = sources?.filter((source: any) => source.id === hlsId)
    }

    if (!audioSources.length) {
      audioSources = sources?.filter((source: any) => source.id === 'mp3' || source.id === 'ogg')
    }

    const updatedSources = []

    for (const i in audioSources) {
      updatedSources.push({
        type: sources[i]?.contentType,
        src: sources[i]?.url
      })
    }

    return updatedSources
  }

  return { humanizeTime, formatSources }
}
