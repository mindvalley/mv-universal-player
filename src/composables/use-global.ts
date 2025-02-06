import { v4 as uuidv4 } from 'uuid'

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
    let localSources = []

    if (sources && sources.length) {
      localSources = sources?.filter((source: any) => source.id === hlsId)
    }

    if (!localSources.length) {
      if (isAudio) {
        localSources = sources?.filter((source: any) => source.id === 'mp3' || source.id === 'ogg')
      } else {
        localSources = sources?.filter((source: any) => source.id === 'mp4' || source.id === 'webm')
      }
    }

    const updatedSources = []

    for (const i in localSources) {
      updatedSources.push({
        type: sources[i]?.contentType,
        src: sources[i]?.url
      })
    }

    return updatedSources
  }

  const getUUID = () => {
    return uuidv4()
  }

  return { humanizeTime, formatSources, getUUID }
}
