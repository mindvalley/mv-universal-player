<template>
  <div>App Component</div>
  <AudioPlayer>
    <AudioItem v-slot="{ play, pause, playing, rewind, fastForward }">
      <div class="flex">
        <AudioRewindButton @rewind="(e) => rewind(e)" />
        <AudioPlayButton @play="play" @pause="pause" :playing="playing" />
        <AudioFastForwardButton @fast-forward="(e) => fastForward(e)" />
      </div>
    </AudioItem>
    <AudioItem v-slot="{ play, pause, playing, rewind, fastForward }">
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
</script>
