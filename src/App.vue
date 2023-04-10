<template>
  <AudioPlayer>
    <div class="">
      <AudioResource
        v-for="section in filteredSections"
        :key="section.media.id"
        asset-type="resource-meditation"
        :asset-id="section.media.id"
        :sources="formatSources(section.media.mediaAsset?.renditions)"
        :duration="section.media.mediaAsset.duration"
        :poster-url="section.media.coverAsset?.url || ''"
        :title="section.media.title || ''"
        :artist-id="section.media.author.id"
        :artist-name="section.media.author.name"
        :ratings="section.media.averageRating"
        :total-ratings="section.media.ratingsCount"
        class="my-10 mx-auto"
      >
        <template #audio-description v-if="section.media">
          <AudioDescription
            :image-src="section.media.author.portraitAsset?.url"
            :name="section.media.author.name"
            :headline="section.media.author.headline"
            :description="section.media.description"
            show-more-text="Show More"
          />
        </template>

        <template #meditation-mixer>
          <div class="relative">
            <MeditationMixer>
              <div class="text-cool-grey-350 mb-2 text-xs">Mix Track</div>
              <div class="flex gap-x-2">
                <MeditationTrackItem></MeditationTrackItem>
                <MeditationTrackItem
                  v-for="(sound, index) in backgroundSounds"
                  :key="index"
                  :sources="formatSources(sound?.item?.mediaAsset.renditions)"
                  :background-src="sound?.item?.coverAsset?.thumbnailUrl"
                />
              </div>
            </MeditationMixer>
          </div>
        </template>
      </AudioResource>
    </div>
  </AudioPlayer>
</template>

<script setup lang="ts">
import AudioDescription from './components/audio/AudioDescription/AudioDescription.vue'
import AudioPlayer from './components/audio/AudioPlayer/AudioPlayer.vue'
import AudioResource from './components/audio/AudioResource/AudioResource.vue'
import MeditationMixer from './components/audio/Meditation/MeditationMixer/MeditationMixer.vue'
import { page } from './examples/page'
import { backgroundSounds } from './examples/background-sounds'
import type { Source } from './types/audio'
import MeditationTrackItem from './components/audio/Meditation/MeditationTrackItem/MeditationTrackItem.vue'

const { sections } = page
const filteredSections = sections.filter((section: any) => section.id === '219')

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
