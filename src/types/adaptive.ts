import { Source } from './audio'

export type AdaptiveSize = 'BIG' | 'SMALL'
export type AdaptiveShape = 'SQUARE' | 'ROUND'

export type BackgroundSound = {
  id: string
  title?: string
  image: string
  sources: Source[]
}

export type BackgroundTrackItem = {
  id: string
  item: BackgroundSound | null
  volume: number
}

export type AboutThisInfo = {
  title: string
  artistName: string
  description: string
  image: string
  ratings: number
  tags: string[]
}
