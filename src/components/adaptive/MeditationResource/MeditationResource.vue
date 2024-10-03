<script setup lang="ts">
import { computed, nextTick, onMounted, PropType, ref } from 'vue-demi'
import MVAdaptiveResource from '../AdaptiveResource'
import MVAdaptiveBackgroundMixer from './../AdaptiveBackgroundMixer'
import type { Source } from './../../../types/audio'
import { Shape } from '../../../models/adaptive.enums'
import MVAdaptiveOverlay from '../AdaptiveOverlay'
import { BackgroundSound, BackgroundTrackItem } from '../../../types/adaptive'
import MVAdaptivePlayer from '../AdaptivePlayer'
import MVAdaptiveItem from '../AdaptiveItem'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  audioSources: {
    type: Array<Source>,
    default: () => []
  },
  videoSources: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    default: ''
  },
  showBookmark: {
    type: Boolean,
    default: false
  },
  posterUrl: {
    type: String,
    default: ''
  },
  showImmersive: {
    type: Boolean,
    default: false
  },
  showCollections: {
    type: Boolean,
    default: false
  },
  duration: {
    required: true,
    type: Number
  },
  showSetDuration: {
    type: [Boolean, String],
    default: false
  },
  showPlaybackSpeed: {
    type: [Boolean, String],
    default: false
  },
  showPreviousNext: {
    type: Boolean,
    default: false
  },
  backgroundSounds: {
    type: Array as PropType<BackgroundSound[]>,
    default: () => []
  },
  defaultBackgroundSound: {
    type: Object as PropType<BackgroundSound>,
    default: null
  }
})

const emit = defineEmits<{
  (e: 'timeupdate', { currentTime }: any): void
  (e: 'play', { currentTime }: any): void
  (e: 'pause', { currentTime }: any): void
  (e: 'seeking', { seeking }: any): void
  (e: 'ended', { currentTime }: any): void
  (e: 'rewind', { previousTime, currentTime }: any): void
  (e: 'fastforward', { previousTime, currentTime }: any): void
  (e: 'reset', { currentTime }: any): void
  (e: 'error', payload: any): void
  (e: 'playtime', { time }: any): void
  (e: 'bookmark'): void
  (e: 'close'): void
  (e: 'meditationMixerClick'): void
  (e: 'collectionOpen'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'playtime', { time }: any): void
  (e: 'playbackSpeedChange', { playbackSpeed }: any): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: any, payload: any): void
}>()

const showMeditationMixer = ref(false)
const overlayZIndex = ref(50)
const isFullScreenEnabled = ref(false)
const adaptiveResource = ref(null)
const meditationMixerItem = ref(null)
const selectedMeditationTrackItem = ref<BackgroundTrackItem | null>(null)
const meditationMixerVolume = ref(0.5)

const toggleMeditationMixer = () => {
  showMeditationMixer.value = !showMeditationMixer.value
}

const handleClose = () => {
  emit('close')
}

const handleCollectionOpen = () => {
  emit('collectionOpen')
}

const handlePrevious = () => {
  emit('previous')
}

const handleNext = () => {
  emit('next')
}

const backgroundTrackItems = computed(() => {
  let sounds = props.backgroundSounds || []
  const updatedBackgroundSounds = []

  if (props.defaultBackgroundSound) {
    updatedBackgroundSounds.push({
      id: props.defaultBackgroundSound.id,
      item: props.defaultBackgroundSound,
      volume: 0.5
    })
    sounds = sounds.filter((sound) => sound.id !== props.defaultBackgroundSound?.id)
  }

  updatedBackgroundSounds.push({
    id: 0,
    item: null,
    volume: 0
  })

  sounds.forEach((sound) => {
    updatedBackgroundSounds.push({
      id: sound.id,
      item: sound,
      volume: 0.5
    })
  })

  return updatedBackgroundSounds
})

onMounted(() => {
  selectedMeditationTrackItem.value = backgroundTrackItems.value[0]
})

const isMixerEnabled = computed(() => {
  return selectedMeditationTrackItem.value?.item !== null
})

const handleTrackChange = (track: BackgroundTrackItem) => {
  if (track.item?.id !== selectedMeditationTrackItem.value?.item?.id) {
    selectedMeditationTrackItem.value = track
    meditationMixerItem.value.player?.setAudio()

    if (selectedMeditationTrackItem.value?.item) {
      playMeditationTrack()
    } else {
      pauseMeditationTrack()
    }
  }
}

const handlePlay = () => {
  playMeditationTrack()
}

const handlePause = () => {
  pauseMeditationTrack()
}

const updateVolume = (backgroundSoundVolume: number, mainSoundVolume: number) => {
  adaptiveResource.value?.player?.player.setVolume(backgroundSoundVolume)
  meditationMixerItem.value?.player?.setVolume(mainSoundVolume)
}

const handleVolumeChange = (volume: number) => {
  if (selectedMeditationTrackItem.value?.item) {
    meditationMixerVolume.value = volume
  }
  updateVolume(1 - volume, volume)
}

const playMeditationTrack = async () => {
  await nextTick()
  if (
    meditationMixerItem.value &&
    adaptiveResource.value?.player?.state.playing &&
    selectedMeditationTrackItem.value?.item
  ) {
    meditationMixerItem.value.player?.play()
  }
}

const pauseMeditationTrack = () => {
  if (meditationMixerItem.value) {
    meditationMixerItem.value.player?.pause()
  }
}

const handleSeek = ({ time }: any) => {
  adaptiveResource.value?.player?.player?.seek(time)
  emitEvent('seeking', { seeking: time.toFixed(2) })
}

const emitEvent = (eventName: string, payload?: any) => {
  const data = { id: props.id, ...payload }
  emit(eventName, data)
}
</script>

<template>
  <div :class="{ 'fixed left-0 bottom-0 top-0 right-0': isFullScreenEnabled }">
    <MVAdaptivePlayer loop :audio-only-mode="true">
      <MVAdaptiveItem
        ref="meditationMixerItem"
        :sources="selectedMeditationTrackItem?.item?.sources"
        :id="selectedMeditationTrackItem?.item?.id"
      >
      </MVAdaptiveItem>
    </MVAdaptivePlayer>

    <MVAdaptiveOverlay
      v-if="backgroundSounds && backgroundSounds.length > 0"
      :show="showMeditationMixer"
      @close="toggleMeditationMixer"
      :z-index="overlayZIndex"
    >
      <MVAdaptiveBackgroundMixer
        :background-track-items="backgroundTrackItems"
        :current-background-track-item="selectedMeditationTrackItem"
        :volume="meditationMixerVolume"
        @close="toggleMeditationMixer"
        @track-change="handleTrackChange"
        @volume-change="handleVolumeChange"
      />
    </MVAdaptiveOverlay>

    <MVAdaptiveResource
      ref="adaptiveResource"
      :id="id"
      :audioSources="audioSources"
      :duration="duration"
      :poster-url="posterUrl"
      :title="title"
      :artist-name="artistName"
      show-rewind-and-fast-forward
      :show-meditation-mixer="backgroundSounds.length > 0"
      :track-info-cover-shape="Shape.SQUARE"
      :show-previous-next="showPreviousNext"
      :is-mixer-enabled="isMixerEnabled"
      @meditation-mixer-open="toggleMeditationMixer"
      @close="handleClose"
      @collection-open="handleCollectionOpen"
      @previous="handlePrevious"
      @next="handleNext"
      @play="handlePlay"
      @pause="handlePause"
      @seek="handleSeek"
    />
  </div>
</template>
