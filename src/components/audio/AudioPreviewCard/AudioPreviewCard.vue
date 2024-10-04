<script setup lang="ts">
defineProps({
  previewModeVariant: {
    type: String as PropType<PreviewModeVariant>,
    default: 'membership'
  }
});

const emit = defineEmits(['previewCallToAction']);

const previewModeTexts = {
  membership: {
    header: "Unlock the full meditation experience",
    button: "Become a member",
    subtext: "Access 500+ guided meditations to elevate your mind and spirit with a Mindvalley Membership."
  },
  'not-for-sale': {
    header: 'This meditation is unavailable for purchase',
    button: 'Search',
    subtext: "Try searching for other meditation in our library."
  }
} as const;
type PreviewModeTexts = typeof previewModeTexts;
type PreviewModeVariant = keyof PreviewModeTexts;

const handlePreviewCallToAction = () => {
  emit('previewCallToAction');
}
</script>
<template>
  <section
    class="mt-3 flex h-full flex-col justify-center col-span-3 md:col-span-2 w-full bg-black bg-opacity-20 rounded-lg p-4 md:p-6"
  >
    <div class="mb-6 flex items-center">
      <div class="h-10 w-10 rounded-full mr-3 bg-white bg-opacity-10 flex items-center justify-center">
        <svg v-svg symbol="lock-outline" size="16" color="#fff"></svg>
      </div>
      <span class="text-xs md:text-sm text-cool-grey-350">
        You don't have access to this meditation
      </span>
    </div>
    <p class="title-6 mb-3">{{ previewModeTexts[previewModeVariant].header }}</p>
    <p class="body-small mb-6 text-cool-grey-350">
      {{ previewModeTexts[previewModeVariant].subtext }}
    </p>

    <div>
      <button
        :class="[
          previewModeVariant === 'membership' ? 'bg-white text-black' : 'border-2 border-white',
          'px-5 py-2 rounded-full'
        ]"
        @click="handlePreviewCallToAction"
      >
        {{ previewModeTexts[previewModeVariant].button }}
      </button>
    </div>
  </section>
</template>