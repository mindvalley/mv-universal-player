# mv-universal-player

This library is an upgraded version of [Universal Player](https://github.com/mindvalley/universal-player). The new library has below features:

- Built with Typescript
- Built in Vue 2.7 version (easy to migrate to Vue 3 when needed)
- Using Tailwind 3
- Can be integrated in Vue 2 (requires 2.7 version) and Vue 3 seamlessly
- Plug and play components that can be styled independently
- Treeshakable (get only the components needed and reduce the package size when consuming)
- [Mindvalley Design System](https://www.npmjs.com/package/@mindvalley/design-system) integrated (icons, styles, fonts, etc)
- Browser Detection utility

(Note: Currenlty only Audio Player is supported. Video Player will be added later.)

## Setup

### Clone the repository

```
git clone https://github.com/mindvalley/mv-universal-player.git

OR

git clone git@github.com:mindvalley/mv-universal-player.git
```

### Install dependencies

```
yarn install
```

### Start the project

```
yarn dev
```

## Components

The components are grouped in below categories. Each category has its own reason to exist. The components are built keeping in mind that they are **loosely coupled** and **higly cohesive** at the same time. This pattern allows us to extend the independent components based on requirements.

- Headless
  - AudioPlayer
  - AudioItem
- Raw
  - AudioPlayButton
  - AudioFastForwardButton
  - AudioRewindButton
  - AudioProgressBar
  - AudioDescription
- Abstraction
  - AudioResource
  - MeditationMixer
  - Carousel
- Utils
  - Browser Detection

Important: When above components are consumed, they are used with **MV** prefix. It means, **AudioPlayer** becomes **MVAudioPlayer**.

### Headless

The components under this category play crucial role. Their main purpose is to provide player functionality (play, pause, seek, rewind, fastforward, etc) and leave styling for other components consuming them.

**AudioPlayer**

It is an instance of the [VideoJs](https://www.npmjs.com/package/video.js?activeTab=readme) without UI. It exposes all the features of the VideoJS along with few custom features. This component can be used independently but it makes more sense when used with **AudioItem**.

**_Props_**

| Name          | Type            | Default                         | Description                                                                                                                                                     |
| ------------- | --------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id            | `String`        | 'mv-audio-player-3423423534543' | The unique identifier of a player. The random number at the end is generated dynamically. If the `id` is passed, then there won't be 'mv-audio-player-' prefix. |
| playbackRates | `Array<Number>` | `[0.5, 1, 2]`                   | Playback speed.                                                                                                                                                 |
| loop          | `Boolean`       | `false`                         | Whether the player should continue playing the audio once it has reached the end.                                                                               |

**_Usage_**

```
<MVAudioPlayer  v-slot="{  state, play, pause, setVolume, setCurrentTime, setSources, setAudio, setPlaybackRate, setMixing }">

    <!-- Other code -->

</MVAudioPlayer>
```

You can also reference the element and access all methods and the current state of the player.

```
<MVAudioPlayer ref="player">

    <!-- Other code -->

</MVAudioPlayer>
```

Although you can use the state and all the actions directly, they are specially meant for **AudioItem** to consume when used together. E.g, set the audio sources through AudioItem instead of setting it through player.

**AudioItem**

This component represents the _virtual_ instance of a player. It means, that all the communication to the player (AudioPlayer) happens through this component. It is dependent on AudioPlayer. You cannot use it standalone.

**_Props_**

| Name    | Type            | Default                       | Description                                                                                                                                                  |
| ------- | --------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id      | `String`        | 'mv-audio-item-3423423534543' | The unique identifier of an item. The random number at the end is generated dynamically. If the `id` is passed, then there won't be 'mv-audio-item-' prefix. |
| sources | `Array<Source>` | `[]`                          | The audio sources that need to be played. `Source` represents `{ type?: string, src: string}` interface.                                                     |

**_Usage_**

```
<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources"
        id="audioItem1"
        @play="emitEvent('play')"
        @pause="emitEvent('pause')"
        @seeking="emitEvent('seeking', $event)"
        @ended="emitEvent('ended', $event)"
        @rewind="emitEvent('rewind', $event)"
        @fastforward="emitEvent('fastforward', $event)"
        @playbackSpeed="emitEvent('playbackSpeed', $event)"
        >

        <!-- Other code -->

    </MVAudioItem>
</MVAudioPlayer>
```

Like AudioPlayer, you can also reference the AudioItem and access the state and methods of that particular instance. Here, the `state` is different from the player state. This state represents the internal state of an audio item, not the player. It has below properites:

| State                       | Description                                                                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `currentTime`               | The current time of the audio being played.                                                                                             |
| `playing`                   | Whether the audio is playing or paused.                                                                                                 |
| `currentPlayingAudioItemId` | This is to know which audio item is active when there are multiple instances of the audioItem. Mainly used in Meditation Mixer context. |
| `mixing`                    | To know whether any other audio is also being played along with main audio. Mainly used in Meditation Mixer context.                    |
| `volume`                    | The volume of the sound. Mainly used in Meditation Mixer context.                                                                       |

As said before, treat **AudioItem** as a virtual instance, and not the instance of VideoJS.

```
<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources1"
        id="audioItem1">
          <!-- Other code -->
    </MVAudioItem>

    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources2"
        id="audioItem2">
          <!-- Other code -->
    </MVAudioItem>

    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources3"
        id="audioItem3">
          <!-- Other code -->
    </MVAudioItem>
</MVAudioPlayer>
```

In the above example, you can see that we have multiple `AudioItem` instances. A good analogy to represent above structure is a Spotify player. There can be multiple song items in the list, but when you select any song, at a time only one song is being played. This means if any song is being played currently and user selects any other song, the previously playing song would reset and the new song would start from the beginning.

This means there will be only one VideoJS instance (through AudioPlayer) and AudioItem is there just to the read the state and call methods of AudioPlayer. If you want multiple VideoJS instances then you can do as shown below:

```
<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources1"
        id="audioItem1">
          <!-- Other code -->
    </MVAudioItem>

    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources2"
        id="audioItem2">
          <!-- Other code -->
    </MVAudioItem>
</MVAudioPlayer>

<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources1"
        id="audioItem1">
          <!-- Other code -->
    </MVAudioItem>

    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources2"
        id="audioItem2">
          <!-- Other code -->
    </MVAudioItem>
</MVAudioPlayer>
```

In above scenario, you can practically play two audios together. But any one audio from first player and any other from second player.

One interesting thing to note about these two components is that they can be nested inside one another.

```
<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources1"
        id="audioItem1">
          <!-- Other code -->
    </MVAudioItem>

    <MVAudioItem
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources2"
        id="audioItem2">
          <!-- Other code -->
                <MVAudioPlayer>
                    <MVAudioItem
                        v-slot="{ state, seek, play, pause, rewind, fastForward }"
                        :sources="sources1"
                        id="audioItem1">
                        <!-- Other code -->
                    </MVAudioItem>

                    <MVAudioItem
                        v-slot="{ state, seek, play, pause, rewind, fastForward }"
                        :sources="sources2"
                        id="audioItem2">
                        <!-- Other code -->
                    </MVAudioItem>
                </MVAudioPlayer>
    </MVAudioItem>
</MVAudioPlayer>
```

The above structure is useful in Meditation Mixer context where one audio can be mixed with another. Now, when we say that all the components are loosely coupled and higly cohesive, what we mean is that you can place `AudioPlayer` anywhere in the application and have `AudioItem` somewhere deeply nested in one of the components. `AudioItem` doesn't need to be the immediate child of `AudioPlayer`.

```
<MVAudioPlayer> <---- in App.vue component

<!-- many other components in between -->

    <MVAudioItem <--- in some child component
        v-slot="{ state, seek, play, pause, rewind, fastForward }"
        :sources="sources1"
        id="audioItem1">
          <!-- Other code -->
    </MVAudioItem>
<MVAudioPlayer>
```

Above structure is useful when you want only player across the app.

## Publish Package

## Consume Package

- Full Bundle

- Individual Components (tree shaking)

## Migrate to Vue 3
