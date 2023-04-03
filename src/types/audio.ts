export interface Player {
  play: (audioItemId: string) => void
  pause: () => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
}
