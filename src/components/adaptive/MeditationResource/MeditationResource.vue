<script setup lang="ts">
import { computed, nextTick, onMounted, PropType, ref } from 'vue-demi'
import MVAdaptiveResource from '../AdaptiveResource'
import MVAdaptiveBackgroundMixer from './../AdaptiveBackgroundMixer'
import type { Source } from './../../../types/audio'
import { Shape } from '../../../models/adaptive.enums'
import MVAdaptiveOverlay from '../AdaptiveOverlay'
import { BackgroundSound, BackgroundTrackItem, AboutThisInfo } from '../../../types/adaptive'
import MVAdaptivePlayer from '../AdaptivePlayer'
import MVAdaptiveItem from '../AdaptiveItem'
import MVAdaptiveAboutThisInfo from '../AdaptiveAboutThisInfo'
import MVAdaptiveAboutThisInfoMeditationMixerButton from '../AdaptiveAboutThisInfo/AdaptiveAboutThisInfoMeditationMixerButton'
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
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  nowPlayingTitle: {
    type: String,
    default: 'NOW PLAYING'
  },
  nowPlayingSubtitle: {
    type: String,
    default: 'Meditation'
  },
  description: {
    type: String,
    default: ''
  },
  ratings: {
    type: Number,
    default: 0
  },
  tags: {
    type: Array<string>,
    default: () => []
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
const showAboutThisInfo = ref(false)

const toggleMeditationMixer = () => {
  showAboutThisInfo.value = false
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

  updatedBackgroundSounds.push({
    id: 'no-background-sound',
    item: null,
    volume: 0
  })

  if (props.defaultBackgroundSound) {
    updatedBackgroundSounds.push({
      id: props.defaultBackgroundSound.id,
      item: props.defaultBackgroundSound,
      volume: 0.5
    })
    sounds = sounds.filter((sound) => sound.id !== props.defaultBackgroundSound?.id)
  }

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
  if (props.defaultBackgroundSound) {
    selectedMeditationTrackItem.value =
      backgroundTrackItems.value.find((item) => item.id === props.defaultBackgroundSound.id) ||
      backgroundTrackItems.value[0]
  } else {
    selectedMeditationTrackItem.value = backgroundTrackItems.value[0]
  }

  if (props.autoPlay) {
    adaptiveResource.value?.player?.player?.play()
  }
})

const isMixerEnabled = computed(() => {
  return selectedMeditationTrackItem.value?.item !== null
})

const handleTrackChange = async (track: BackgroundTrackItem) => {
  if (track.item?.id !== selectedMeditationTrackItem.value?.item?.id) {
    selectedMeditationTrackItem.value = track

    // We need to wait for the next tick to set the audio and volume
    await nextTick()

    meditationMixerItem.value.player?.setAudio()
    handleVolumeChange(meditationMixerVolume.value)

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
  adaptiveResource.value?.player?.player.setVolume(mainSoundVolume)
  meditationMixerItem.value?.player?.setVolume(backgroundSoundVolume)
}

const handleVolumeChange = (volume: number) => {
  if (selectedMeditationTrackItem.value?.item) {
    meditationMixerVolume.value = volume
  }

  if (selectedMeditationTrackItem.value?.item) {
    updateVolume(1 - volume, volume)
  } else {
    updateVolume(0, 1)
  }
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

const toggleAboutThisInfo = () => {
  showMeditationMixer.value = false
  showAboutThisInfo.value = !showAboutThisInfo.value
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
        :sources="selectedMeditationTrackItem?.item?.sources || []"
        :id="selectedMeditationTrackItem?.id"
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

    <MVAdaptiveOverlay
      :show="showAboutThisInfo"
      @close="toggleAboutThisInfo"
      :z-index="overlayZIndex"
    >
      <MVAdaptiveAboutThisInfo
        header-title="About this meditation"
        :title="title"
        :artist-name="artistName"
        :image="posterUrl"
        :description="description"
        :ratings="ratings"
        :tags="tags"
        @close="toggleAboutThisInfo"
      >
        <template #control>
          <MVAdaptiveAboutThisInfoMeditationMixerButton
            @click="toggleMeditationMixer"
            :track-title="selectedMeditationTrackItem?.item?.title"
            :is-active="selectedMeditationTrackItem?.item"
          />
        </template>
      </MVAdaptiveAboutThisInfo>
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
      show-immersive
      :show-meditation-mixer="backgroundSounds.length > 0"
      :track-info-cover-shape="Shape.SQUARE"
      :show-previous-next="showPreviousNext"
      :is-mixer-enabled="isMixerEnabled"
      :now-playing-title="nowPlayingTitle"
      :now-playing-subtitle="nowPlayingSubtitle"
      @track-info-title-click="toggleAboutThisInfo"
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
