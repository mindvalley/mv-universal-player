interface Player {
  play: (videoItemId: string) => void
  pause: () => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setSources: (sources: Source[]) => void
  setPlaybackRate: (rate: number) => void
  mute: () => void
  unmute: () => void
  goFullscreen: () => void
}

interface Source {
  type?: string
  src: string
}

interface Marker {
  id: string
  name: string
  time: number
}

type OverlayControlsPosition = 'TOP' | 'BOTTOM'

export type { Player, Source, Marker, OverlayControlsPosition }
