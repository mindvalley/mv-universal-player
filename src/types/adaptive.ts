import { Source } from './audio'

export type AdaptiveSize = 'BIG' | 'SMALL'
export type AdaptiveShape = 'SQUARE' | 'ROUND'

export type BackgroundSound = {
  id: string
  image: string
  sources: Source[]
}

export type BackgroundTrackItem = {
  id: string
  item: BackgroundSound | null
  volume: number
}
