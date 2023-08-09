interface Player {
  play: (videoItemId: string) => void
  pause: () => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setSources: (sources: Source[]) => void
  setPlaybackRate: (rate: number) => void
}

interface Source {
  type?: string
  src: string
}

interface Marker {
  id: string
  name: string
  status: string
  time: number
}

export type { Player, Source, Marker }
