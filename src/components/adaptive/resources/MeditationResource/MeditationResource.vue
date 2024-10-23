<script setup lang="ts">
import { computed, nextTick, onMounted, PropType, ref, watch } from 'vue-demi'
import type { Source } from './../../../../types/audio'
import { Shape } from './../../../../models/adaptive.enums'
import { BackgroundSound, BackgroundTrackItem } from './../../../../types/adaptive'
import { MVAdaptiveResource } from '../'
import { MVAdaptiveBackgroundMixer } from '../../background'
import { MVAdaptiveOverlay } from '../../layers'
import { MVAdaptivePlayer, MVAdaptiveItem } from '../../player'
import { MVAdaptiveAboutThisInfo } from '../../info'
import { MVAdaptiveAboutThisInfoMeditationMixerButton } from '../../info/AdaptiveAboutThisInfo/AdaptiveAboutThisInfoMeditationMixerButton'

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
  posterUrl: {
    type: String,
    default: ''
  },
  duration: {
    required: true,
    type: Number
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
  (e: 'error', payload: any): void
  (e: 'playtime', { time }: any): void
  (e: 'close'): void
  (e: 'meditationMixerOpen'): void
  (e: 'meditationMixerClose'): void
  (e: 'collectionOpen'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: 'muted', { muted }: any): void
  (e: 'backgroundMixerPlay', { currentTime }: any): void
  (e: 'backgroundMixerPause', { currentTime }: any): void
  (e: 'backgroundMixerTimeupdate', { currentTime }: any): void
  (e: 'backgroundMixerEnded', { currentTime }: any): void
  (e: any, payload: any): void
}>()

const showMeditationMixer = ref(false)
const adaptiveResource = ref(null)
const meditationMixerItem = ref(null)
const selectedMeditationTrackItem = ref<BackgroundTrackItem | null>(null)
const meditationMixerVolume = ref(0.5)
const showAboutThisInfo = ref(false)
const mainVolume = ref(1)

// TODO: Might have to change this to 0.5 for both if the default background sound is set.
const backgroundSoundVolume = ref(1)
const mainSoundVolume = ref(1)

const toggleMeditationMixer = () => {
  showAboutThisInfo.value = false
  showMeditationMixer.value = !showMeditationMixer.value
  if (showMeditationMixer.value) {
    emitEvent('meditationMixerOpen')
  } else {
    emitEvent('meditationMixerClose')
  }
}

const handleClose = () => {
  emitEvent('close')
}

const handleCollectionOpen = () => {
  emitEvent('collectionOpen')
}

const handlePrevious = () => {
  emitEvent('previous')
}

const handleNext = () => {
  emitEvent('next')
}

const handleTimeUpdate = ({ currentTime }: { currentTime: number }) => {
  emitEvent('timeupdate', { currentTime })
}

const handleEnded = ({ id, currentTime }: { id: string; currentTime: number }) => {
  emitEvent('ended', { currentTime })
  emitBackgroundMixerEvent('backgroundMixerEnded', { currentTime })
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

  // If there is a default background sound, set the volumes to 0.5 for both main and background sound
  if (selectedMeditationTrackItem.value?.item) {
    mainSoundVolume.value = 0.5
    backgroundSoundVolume.value = 0.5
    updateVolume(mainVolume.value, backgroundSoundVolume.value, mainSoundVolume.value)
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

const handlePlay = ({ id, currentTime }: { id: string; currentTime: string }) => {
  emitEvent('play', { currentTime: Number(currentTime) })
  playMeditationTrack()
}

const handlePause = ({ id, currentTime }: { id: string; currentTime: string }) => {
  emitEvent('pause', { currentTime: Number(currentTime) })
  pauseMeditationTrack()
}

const handleFullscreen = ({ isFullScreen }: any) => {
  if (isFullScreen) {
    emitEvent('maximize')
  } else {
    emitEvent('minimize')
  }
}

const handleMuted = ({ muted }: { id: string; muted: boolean }) => {
  emitEvent('muted', { muted: muted })
}

const handlePlaytime = ({ time }: any) => {
  emitEvent('playtime', { time })
}

const updateVolume = (
  mainVolume: number,
  backgroundSoundVolume: number,
  mainSoundVolume: number
) => {
  adaptiveResource.value?.player?.player.setVolume(mainVolume * mainSoundVolume)
  meditationMixerItem.value?.player?.setVolume(mainVolume * backgroundSoundVolume)
}

const handleVolumeChange = (volume: number) => {
  if (selectedMeditationTrackItem.value?.item) {
    meditationMixerVolume.value = volume
  }

  if (selectedMeditationTrackItem.value?.item) {
    backgroundSoundVolume.value = 1 - volume
    mainSoundVolume.value = volume
    updateVolume(mainVolume.value, backgroundSoundVolume.value, mainSoundVolume.value)
  } else {
    backgroundSoundVolume.value = 0
    mainSoundVolume.value = 1
    updateVolume(mainVolume.value, backgroundSoundVolume.value, mainSoundVolume.value)
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
  emitEvent('seeking', { seeking: Number(time.toFixed(2)) })
}

const handleFastForward = ({
  id,
  previousTime,
  currentTime
}: {
  id: string
  previousTime: number
  currentTime: number
}) => {
  emitEvent('fastforward', { previousTime, currentTime })
}

const handleRewind = ({
  id,
  previousTime,
  currentTime
}: {
  id: string
  previousTime: number
  currentTime: number
}) => {
  emitEvent('rewind', { previousTime, currentTime })
}

const toggleAboutThisInfo = () => {
  showMeditationMixer.value = false
  showAboutThisInfo.value = !showAboutThisInfo.value
}

const handleSetVolume = ({ volume }: { id: string; volume: number }) => {
  mainVolume.value = volume
}

const handleBackgroundMixerPlay = (payload: any) => {
  emitBackgroundMixerEvent('backgroundMixerPlay', payload)
}

const handleBackgroundMixerPause = (payload: any) => {
  emitBackgroundMixerEvent('backgroundMixerPause', payload)
}

const handleBackroundMixerTimeupdate = (payload: any) => {
  emitBackgroundMixerEvent('backgroundMixerTimeupdate', payload)
}

watch(mainVolume, (newVolume) => {
  updateVolume(newVolume, backgroundSoundVolume.value, mainSoundVolume.value)
})

const emitEvent = (eventName: string, payload?: any) => {
  const data = { id: props.id, ...payload }
  emit(eventName, data)
}

const emitBackgroundMixerEvent = (eventName: string, payload?: any) => {
  const data = {
    id: props.id,
    backgroundSoundId: selectedMeditationTrackItem.value?.item?.id,
    ...payload
  }
  emit(eventName, data)
}
</script>

<template>
  <div data-testid="meditation-resource">
    <MVAdaptivePlayer loop :audio-only-mode="true">
      <MVAdaptiveItem
        ref="meditationMixerItem"
        :sources="selectedMeditationTrackItem?.item?.sources || []"
        :id="selectedMeditationTrackItem?.id"
        @play="handleBackgroundMixerPlay"
        @pause="handleBackgroundMixerPause"
        @timeupdate="handleBackroundMixerTimeupdate"
      >
      </MVAdaptiveItem>
    </MVAdaptivePlayer>

    <MVAdaptiveOverlay
      v-if="backgroundSounds && backgroundSounds.length > 0"
      :show="showMeditationMixer"
      @close="toggleMeditationMixer"
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

    <MVAdaptiveOverlay :show="showAboutThisInfo" @close="toggleAboutThisInfo">
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
        <template #control v-if="backgroundSounds && backgroundSounds.length > 0">
          <MVAdaptiveAboutThisInfoMeditationMixerButton
            @click="toggleMeditationMixer"
            :track-title="selectedMeditationTrackItem?.item?.title"
            :mixer-enabled="isMixerEnabled"
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
      :show-meditation-mixer="backgroundSounds && backgroundSounds.length > 0"
      :track-info-cover-shape="Shape.SQUARE"
      :show-previous-next="showPreviousNext"
      :is-mixer-enabled="isMixerEnabled"
      :now-playing-title="nowPlayingTitle"
      :now-playing-subtitle="nowPlayingSubtitle"
      :mixer-track-title="selectedMeditationTrackItem?.item?.title"
      @set-volume="handleSetVolume"
      @track-info-title-click="toggleAboutThisInfo"
      @meditation-mixer-open="toggleMeditationMixer"
      @close="handleClose"
      @collection-open="handleCollectionOpen"
      @previous="handlePrevious"
      @next="handleNext"
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
      @seek="handleSeek"
      @fullscreen="handleFullscreen"
      @muted="handleMuted"
      @fastforward="handleFastForward"
      @rewind="handleRewind"
      @ended="handleEnded"
      @playtime="handlePlaytime"
    />
  </div>
</template>
