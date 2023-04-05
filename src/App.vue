<template>
  <AudioPlayer>
    <div class="mx-auto">
      <AudioResource
        v-for="section in filteredSections"
        :key="section.media.id"
        asset-type="audio"
        :asset-id="section.media.id"
        :sources="section.media.mediaAsset?.renditions"
        :duration="section.media.mediaAsset.duration"
        :poster-url="section.media.coverAsset?.url || ''"
        :title="section.media.info?.title || ''"
        class="my-10 max-w-3xl"
      >
        <template #author-details v-if="section.media">
          <AuthorDetails
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
import AudioPlayer from './components/audio/AudioPlayer/AudioPlayer.vue'
import AudioResource from './components/audio/AudioResource/AudioResource.vue'
import AuthorDetails from './components/common/AuthorDetails/AuthorDetails.vue'
import { page } from './examples/page'

const { sections } = page
const filteredSections = sections.filter((section: any) => section.type === 'media')
</script>
