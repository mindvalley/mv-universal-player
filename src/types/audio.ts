interface Player {
  play: (audioItemId: string) => void
  pause: () => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setSources: (sources: Source[]) => void
  setAudio: (audioItemId: string) => void
  setMixing: (enabled: boolean) => void
  setPlaybackRate: (rate: number) => void
  goFullScreen?: () => void
  setAudioOnlyMode?: (enabled: boolean) => void
  setAudioPosterMode?: (enabled: boolean) => void
}

interface Source {
  type?: string
  src: string
}

export type { Player, Source }
