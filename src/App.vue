<template>
  <AudioPlayer>
    <div class="mx-auto max-w-3xl">
      <AudioResource
        v-for="section in filteredSections"
        :key="section.id"
        asset-type="audio"
        :asset-id="section.id"
        :sources="section.primaryAsset?.renditions"
        :duration="section.primaryAsset?.duration"
        :poster-url="section.coverAsset?.url"
        :title="section.info.title"
        class="my-10"
      />
    </div>
  </AudioPlayer>
</template>

<script setup lang="ts">
import AudioPlayer from './components/audio/AudioPlayer/AudioPlayer.vue'
import AudioResource from './components/audio/AudioResource/AudioResource.vue'
import { page } from './examples/page'

const { sections } = page
const filteredSections = sections.filter((section: any) => section.type === 'audio')
</script>
