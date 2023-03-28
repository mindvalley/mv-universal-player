import { defineCustomElement } from 'vue'
import AudioPlayer from '@/components/Audio/AudioPlayer.ce.vue'

export const MVAudioPlayer = defineCustomElement(AudioPlayer)

customElements.define('mv-audio-player', MVAudioPlayer)
