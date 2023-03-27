import { defineCustomElement } from 'vue'
import AudioPlayer from '@/components/AudioPlayer.ce.vue'

const AudioPlayerComponent = defineCustomElement(AudioPlayer)

customElements.define('mv-audio-player', AudioPlayerComponent)
