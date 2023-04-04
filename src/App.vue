<template>
  <AudioPlayer v-slot="{ state }">
    <!-- {{ state }} -->
    <AudioItem
      v-slot="{ play, pause, playing, rewind, fastForward, currentTime, seek }"
      :sources="[{ src: '//vjs.zencdn.net/v/oceans.mp4' }]"
      class="bg-purple-100"
    >
      <div>
        <AudioProgressBar :duration="500" :current-time="currentTime" @seek="seek" />
      </div>
      <div class="flex">
        <AudioRewindButton @rewind="(e) => rewind(e)" />
        <AudioPlayButton @play="play" @pause="pause" :playing="playing" />
        <AudioFastForwardButton @fast-forward="(e) => fastForward(e)" />
      </div>
    </AudioItem>
    <AudioItem
      v-slot="{ play, pause, playing, rewind, fastForward }"
      :sources="[{ src: 'https://dl.espressif.com/dl/audio/ff-16b-2c-44100hz.mp4' }]"
      class="bg-yellow-100"
    >
      <div class="flex">
        <AudioRewindButton @rewind="(e) => rewind(e)" />
        <AudioPlayButton @play="play" @pause="pause" :playing="playing" />
        <AudioFastForwardButton @fast-forward="(e) => fastForward(e)" />
      </div>
    </AudioItem>
  </AudioPlayer>
</template>

<script setup lang="ts">
import AudioPlayer from './components/audio/AudioPlayer/AudioPlayer.vue'
import AudioItem from './components/audio/AudioItem/AudioItem.vue'
import AudioPlayButton from './components/audio/AudioPlayButton/AudioPlayButton.vue'
import AudioRewindButton from './components/audio/AudioRewindButton/AudioRewindButton.vue'
import AudioFastForwardButton from './components/audio/AudioFastForwardButton/AudioFastForwardButton.vue'
import AudioProgressBar from './components/audio/AudioProgressBar/AudioProgressBar.vue'
</script>
