interface Player {
  play: (videoItemId: string) => void
  pause: () => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setSources: (sources: Source[]) => void
  setPlaybackRate: (rate: number) => void
  mute: () => void
  unmute: () => void
  goFullScreen: () => void
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

export enum VideoMode {
  DEFAULT = 'DEFAULT',
  SEAMLESS = 'SEAMLESS'
}

export type { Player, Source, Marker }
