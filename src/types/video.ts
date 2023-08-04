interface Player {
  play: (videoItemId: string) => void
  pause: () => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setSources: (sources: Source[]) => void
  setVideo: (videoItemId: string) => void
  setPlaybackRate: (rate: number) => void
}

interface Source {
  type?: string
  src: string
}

export type { Player, Source }
