<template>
  <AudioPlayer>
    <div class="">
      <AudioResource
        v-for="section in filteredSections"
        :key="section.media.id"
        asset-type="audio"
        :asset-id="section.media.id"
        :sources="formatSources(section.media.mediaAsset?.renditions)"
        :duration="section.media.mediaAsset.duration"
        :poster-url="section.media.coverAsset?.url || ''"
        :title="section.media.title || ''"
        :artist-id="section.media.author.id"
        :artist-name="section.media.author.name"
        :ratings="section.media.averageRating"
        :total-ratings="section.media.ratingsCount"
        class="my-10 max-w-3xl mx-auto"
      >
        <template #author-details v-if="section.media">
          <AudioDescription
            :image-src="section.media.author.portraitAsset?.url"
            :name="section.media.author.name"
            :headline="section.media.author.headline"
            :description="section.media.description"
            show-more-text="Show More"
          />
        </template>
      </AudioResource>
    </div>
  </AudioPlayer>
</template>

<script setup lang="ts">
import AudioDescription from './components/audio/AudioDescription/AudioDescription.vue'
import AudioPlayer from './components/audio/AudioPlayer/AudioPlayer.vue'
import AudioResource from './components/audio/AudioResource/AudioResource.vue'
import { page } from './examples/page'
import type { Source } from './types/audio'

const { sections } = page
const filteredSections = sections.filter((section: any) => section.type === 'media')

const formatSources = (localSources: Array<any> = []) => {
  const audioSources = localSources?.filter(
    (source) => source.id === 'mp3' || source.id === 'ogg' || source.id === 'hls'
  )
  const updatedSources: Source[] = []

  for (const i in audioSources) {
    updatedSources.push({
      type: localSources[i]?.contentType,
      src: localSources[i]?.url
    })
  }

  return updatedSources
}
</script>
