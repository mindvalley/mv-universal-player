# mv-universal-player

This library is an upgraded version of [Universal Player](https://github.com/mindvalley/universal-player). The new library has below features:

- Built with Typescript
- Built in Vue 2.7 version (easy to migrate to Vue 3 when needed)
- Using Tailwind 3
- Can be integrated in Vue 2 (requires 2.7 version) and Vue 3 seamlessly
- Plug and play components that can be styled independently
- Treeshakable (get only the components needed and reduce the package size)
- [Mindvalley Design System](https://www.npmjs.com/package/@mindvalley/design-system) integration (icons, styles, fonts, etc)
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

- **Headless**
  - AudioPlayer
  - AudioItem
- **Raw**
  - AudioPlayButton
  - AudioFastForwardButton
  - AudioRewindButton
  - AudioProgressBar
  - AudioDescription
- **Abstraction**
  - AudioResource
  - MeditationMixer
  - Carousel
- **Utils**
  - Browser Detection

_Important_: When above components are consumed, they are used with **MV** prefix. It means, **AudioPlayer** becomes **MVAudioPlayer**.

### Headless

The components under this category play crucial role. Their main purpose is to provide player functionality (play, pause, seek, rewind, fastforward, etc) and leave styling for other components consuming them.

**AudioPlayer**

It is an instance of the [VideoJs](https://www.npmjs.com/package/video.js?activeTab=readme) without UI. It exposes all the features of the VideoJS along with few custom features. This component can be used independently but it makes more sense when used with **AudioItem**.

**_Props_**

| Name          | Type            | Default                         | Description                                                                                                                                                     |
| ------------- | --------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id            | `String`        | `mv-audio-player-3423423534543` | The unique identifier of a player. The random number at the end is generated dynamically. If the `id` is passed, then there won't be 'mv-audio-player-' prefix. |
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
| id      | `String`        | `mv-audio-item-3423423534543` | The unique identifier of an item. The random number at the end is generated dynamically. If the `id` is passed, then there won't be 'mv-audio-item-' prefix. |
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

In the above example, you can see that we have multiple `AudioItem` instances. A good analogy to represent above structure is a Spotify player. There can be multiple song items in the list, but when you select any song, at a time only one song is being played. This means current playing song will reset and new song will start from the begining.

This also means there will be only one VideoJS instance (through AudioPlayer) and AudioItem is there just to read the state and call methods of AudioPlayer. If you want multiple VideoJS instances then you can do as shown below:

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

Above structure is useful when you want only one player across the app.

### Raw

The components under this category can be used independently without the dependency of **Headless** components. In other words, they are pure functional components that work on props and produce events. They have their own css styling and integration of MV Design System, but the styles can be overriden using the exposed classes.

**AudioPlayButton**

A play button for the player. Though it is named as 'play' button, it will also show _pause_ icon when the audio is in paused state.

**_Props_**

| Name    | Type      | Default | Description                                                                                                             |
| ------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| playing | `Boolean` | `false` | Whether the audio is being played or not. When `true`, it will show pause icon and when `false` it will show play icon. |

**_Events_**

| Name  | Payload | Description                                  |
| ----- | ------- | -------------------------------------------- |
| play  | ``      | It will emit when the play icon is clicked.  |
| pause | ``      | It will emit when the pause icon is clicked. |

**_Usage_**

```
<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ state, play, pause }"
        :sources="sources"
        id="audioItem1"
        >
          <MVAudioPlayButton @play="play" @pause="pause" :playing="state?.playing" />
    </MVAudioItem>
</MVAudioPlayer>
```

**AudioFastForwardButton**

A fast-forward button for the player.

**_Props_**

| Name        | Type     | Default        | Description                                                                                                                                                                                |
| ----------- | -------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| seconds     | `Number` | `15`           | The seconds by which the audio should be moved forward.                                                                                                                                    |
| tooltipText | `String` | `-Sec Forward` | The tooltip to be shown when user hovers the cursor. So the end result combining _seconds_ and _tooltipText_ will be `15-Sec Forward`. Note: The tooltip won't be shown on mobile devices. |

**_Events_**

| Name        | Payload | Description                                                                                                                    |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| fastForward | `15`    | The seconds by which the audio was moved forward. The number of seconds would be the same that was passed in **seconds** prop. |

**_Usage_**

```
<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ fastForward }"
        :sources="sources"
        id="audioItem1"
        >
           <MVAudioFastForwardButton @fastForward="fastForward($event)" />
    </MVAudioItem>
</MVAudioPlayer>
```

**AudioRewindButton**

A rewind button for the player.

**_Props_**

| Name        | Type     | Default       | Description                                                                                                                                                                               |
| ----------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| seconds     | `Number` | `15`          | The seconds by which the audio should be rewinded.                                                                                                                                        |
| tooltipText | `String` | `-Sec Rewind` | The tooltip to be shown when user hovers the cursor. So the end result combining _seconds_ and _tooltipText_ will be `15-Sec Rewind`. Note: The tooltip won't be shown on mobile devices. |

**_Events_**

| Name   | Payload | Description                                                                                                               |
| ------ | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| rewind | `15`    | The seconds by which the audio was rewinded. The number of seconds would be the same that was passed in **seconds** prop. |

**_Usage_**

```
<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ rewind }"
        :sources="sources"
        id="audioItem1"
        >
            <MVAudioRewindButton @rewind="rewind($event)" />
    </MVAudioItem>
</MVAudioPlayer>
```

**AudioProgressBar**

The progress bar showing the current status of an audio. User can also _seek_ the audio.

**_Props_**

| Name        | Type     | Default | Description                                                                                                              |
| ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| duration    | `Number` | `0`     | It is required. It is the total seconds of an audio. The seconds will be converted to humanized format by the component. |
| currentTime | `Number` | `0`     | It is required. It represents where the audio is currently.                                                              |

**_Events_**

| Name | Payload | Description                                                          |
| ---- | ------- | -------------------------------------------------------------------- |
| seek | `0`     | It will emit the current time (where the user clicked) of the audio. |

**_Usage_**

```
<MVAudioPlayer>
    <MVAudioItem
        v-slot="{ state, seek }"
        :sources="sources"
        id="audioItem1"
        >
          <MVAudioProgressBar
            :duration="props.duration"
            class="text-white"
            :current-time="state?.currentTime"
            @seek="seek"
          />
    </MVAudioItem>
</MVAudioPlayer>
```

**AudioDescription**

The progress bar showing the current status of an audio. User can also _seek_ the audio.

**_Props_**

| Name         | Type     | Default | Description                                                                                                                                                                                  |
| ------------ | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| imageSrc     | `String` | ``      | It is required. The image path. E.g, artist's image                                                                                                                                          |
| name         | `String` | ``      | It is required. E.g, artist's name                                                                                                                                                           |
| headline     | `String` | ``      | It is required. E.g, some tagline for the audio                                                                                                                                              |
| description  | `String` | ``      | It is required. E.g, some description for the audio. If the the length of the description is <=250, it will show 'Show More' text for user to expand else 'Show Less' to collapse the text . |
| showMoreText | `String` | ``      | It is required. E.g, 'Show More' when the text is collapsed.                                                                                                                                 |
| showLessText | `String` | ``      | It is required. E.g, 'Show Less' when the text is expanded.                                                                                                                                  |

**_Usage_**

```
<MVAudioPlayer>
   <MVAudioDescription
      :image-src="section?.media?.author?.portraitAsset?.url"
      :name="section?.media?.author?.name"
      :headline="section?.media?.author?.headline"
      :description="section?.media?.description"
      show-more-text="Show More"
      show-less-text="Show Less"
      class="pt-8"
      />
</MVAudioPlayer>
```

### Abstraction

_Headless_ and _Raw_ components are enough to serve the needs of an audio player. But if you want to use readymade component which clubs all _Headless_ and _Raw_ components so that it is easy to integrate in the consuming application, you can use components under this category. It is most likely that you will use these components.

**AudioResource**

You can think of this component as an extension to _AudioItem_ component because it encompasses all the necessary _headless_ and _raw_ components to provide good user experience. It manages the responsiveness of the player and allows you to inject _MeditationMixer_ and _AudioDescription_ components through '#meditation-mixer' and '#audio-description' slots respectively.

**_Props_**

| Name          | Type            | Default | Description                                                                                                                                                                                                                                                                  |
| ------------- | --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assetID       | `String`        | ''      | It is required. The unique identifier of the resource (AudioItem). The assetID passed will be used to further pass it down to AudioItem and will also be used while emitting events so that user knows which AudioItem (virtual instance of a player) has emitted the event. |
| sources       | `Array<Source>` | `[]`    | It is required. The audio sources that need to be played. `Source` represents `{ type?: string, src: string}` interface. The sources are passed down to AudioItem.                                                                                                           |
| title         | `String`        | ``      | Audio title.                                                                                                                                                                                                                                                                 |
| artistName    | `String`        | ``      | Artist's name.                                                                                                                                                                                                                                                               |
| duration      | `Number`        | `0`     | Total duration of the sound in seconds. It is passed down to AudioProgressBar.                                                                                                                                                                                               |
| posterUrl     | `String`        | ``      | Poster of the audio. It is also used to give blur effect in the background.                                                                                                                                                                                                  |
| ratings       | `Number`        | `0`     | Ratings of the audio.                                                                                                                                                                                                                                                        |
| totalRatings  | `Number`        | `0`     | Total ratings of the audio. E.g, 3/5 (here 3 is ratings and 5 is totalRatings)                                                                                                                                                                                               |
| overlay       | `Boolean`       | `false` | Overlay effect in the background.                                                                                                                                                                                                                                            |
| blurEffect    | `Boolean`       | `false` | Blur effect in the background.                                                                                                                                                                                                                                               |
| showFavourite | `Boolean`       | `false` | Whether to show favourite (heart icon) on the top right corner.                                                                                                                                                                                                              |
| isFavourite   | `Boolean`       | `false` | To show whether the audio is favourite or not. It is dependend on `showFavourite`.                                                                                                                                                                                           |

**_Events_**

| Name        | Payload                                                       | Description                                                                                 |
| ----------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| timeupdate  | `{assetId: '...', currentTime: '...'}`                        | The current time of the audio being played. The currentTime will be in seconds.             |
| play        | `{assetId: '...'}`                                            | It will emit when the audio has started to play.                                            |
| pause       | `{assetId: '...'}`                                            | It will emit when the audio has paused.                                                     |
| seeking     | `{assetId: '...', seeking: '...'}`                            | It will emit when the audio is seeked through progress bar. The seeking will be in seconds. |
| ended       | `{assetId: '...'}`                                            | It will emit the audio has ended.                                                           |
| rewind      | `{assetId: '...', {previousTime: '...', currentTime: '...'}}` | It will emit when the audio is rewinded.                                                    |
| fastforward | `{assetId: '...', {previousTime: '...', currentTime: '...'}}` | It will emit when the audio is fast forwarded.                                              |

**_Usage_**

```
 <MVAudioPlayer>
      <MVAudioResource
        v-for="section in filteredSections"
        :key="section?.media?.id"
        :asset-id="section?.media?.id"
        :sources="formatSources(section?.media?.mediaAsset?.renditions)"
        :duration="section?.media?.mediaAsset.duration"
        :poster-url="section?.media?.coverAsset?.url"
        :title="section?.media?.title"
        :artist-id="section?.media?.author.id"
        :artist-name="section?.media?.author.name"
        :ratings="section?.media?.averageRating"
        :total-ratings="section?.media?.ratingsCount"
        class="my-10 mx-auto inset-0 z-15 relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-cover bg-center"
        :style="`background-image: url(${section?.media?.coverAsset?.url});`"
        blurEffect
        overlay
        showFavourite
        @play="logEvent('play', $event)"
        @pause="logEvent('pause', $event)"
        @seeking="logEvent('seeking', $event)"
        @ended="logEvent('ended', $event)"
        @rewind="logEvent('rewind', $event)"
        @fastforward="logEvent('fastforward', $event)"
        @playbackSpeed="logEvent('playbackSpeed', $event)"
        @favourite="logEvent('favourite', $event)"
      >

        <!-- Other code-->

      </MVAudioResource>
    </div>
  </MVAudioPlayer>
```

**MeditationMixer**

This is an optional component which you can use to mix sounds. It is a wrapper of an AudioPlayer component. Every usage of MeditationMixer will create new instance of VideoJS. This component cannot be used without AudioResource.

It accepts `MeditationTrackItem` (which is nothing but again a wrapper of an AudioItem) and `MeditationVolumeSlider` components as children components to provide mixing feature. It is important to note that both `MeditationTrackItem` and `MeditationVolumeSlider` cannot be used without `MeditionMixer` component.

_**MeditationTrackItem Props**_

| Name          | Type            | Default                                  | Description                                                                                                                                                                                                                                     |
| ------------- | --------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id            | `String`        | `mv-meditation-track-item-3423423534543` | The unique identifier of the item. The random number at the end is generated dynamically. If the `id` is passed, then there won't be 'mv-meditation-track-item-' prefix.                                                                        |
| sources       | `Array<Source>` | `[]`                                     | The audio sources that need to be played. `Source` represents `{ type?: string, src: string}` interface. If you don't pass the sources, it will return 'NO BG SOUND' item by default.                                                           |
| isActive      | `Boolean`       | `false`                                  | Whether current sound is active or not. It is mainly used to show selection of a background sound with blue border. It doesn't mean the audio (background sound) is being played. The audio is in play/pause state based on main audio's state. |
| backgroundSrc | `String`        | ``                                       | Background image for the sound.                                                                                                                                                                                                                 |
| volume        | `Number`        | `0.5`                                    | Default volume of the sound. Rest of the volume would be of main audio.                                                                                                                                                                         |

_**MeditationVolumeSlider Props**_

| Name      | Type     | Default | Description                                                    |
| --------- | -------- | ------- | -------------------------------------------------------------- |
| volume    | `Number` | `0.5`   | The default indicator.                                         |
| min       | `Number` | `0`     | Minimum volume the user can set.                               |
| max       | `Number` | `0`     | Maximum volume the user can set.                               |
| step      | `Number` | `0.01`  | The step by which the volume should be increased or decreased. |
| leftText  | `String` | `sound` | The text to be shown on the left hand side of the slider.      |
| rightText | `String` | `vocal` | The text to be shown on the right hand side of the slider.     |

_**Usage**_

```
  <MVAudioResource
        v-for="section in filteredSections"
        :key="section?.media?.id"
        :asset-id="section?.media?.id"
        :sources="formatSources(section?.media?.mediaAsset?.renditions)"
        :duration="section?.media?.mediaAsset.duration"
        :poster-url="section?.media?.coverAsset?.url"
        :title="section?.media?.title"
        :artist-id="section?.media?.author.id"
        :artist-name="section?.media?.author.name"
        :ratings="section?.media?.averageRating"
        :total-ratings="section?.media?.ratingsCount"
        :style="`background-image: url(${section?.media?.coverAsset?.url});`"
      >
        <template #meditation-mixer>
          <MVMeditationMixer>
            <div class="text-cool-grey-350 mb-2 text-xs">Mix Track</div>
            <div class="gap-x-2 px-6">
              <MVCarousel tagName="Slide">
                <MVCarouselSlide :key="0">
                  <MVMeditationTrackItem :volume="0"></MVMeditationTrackItem>
                </MVCarouselSlide>
                <MVCarouselSlide v-for="(sound, index) in backgroundSounds" :key="index + 1">
                  <MVMeditationTrackItem
                    :sources="formatSources(sound?.item?.mediaAsset.renditions)"
                    :background-src="sound?.item?.coverAsset?.thumbnailUrl"
                  />
                </MVCarouselSlide>
              </MVCarousel>
            </div>
            <div
              class="flex w-full mt-4 items-center justify-center transition duration-300 ease-in"
            >
              <MVMeditationVolumeSlider leftText="sound" rightText="vocal" />
            </div>
          </MVMeditationMixer>
        </template>
      </MVAudioResource>
```

**MVCarousel**

This component uses [Vue Carousel](https://www.npmjs.com/package/vue-carousel) under the hood. Currently it is configured (e.g number of slides per breakpoint) keeping MeditationMixer in mind, but you can also use it elsewhere.

**_Props_**

| Name    | Type     | Default           | Description                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| tagName | `String` | `MVCarouselSlide` | This is to indicate what tag would act as a child component. This is nothing but to identify the slide component which Vue Carousel uses to count the no. of slides and react to responsiveness. If you are using whole `mv-universal-plaer` package (not individual components), then you don't need to pass the prop, but if you are using individual components (for tree-shaking) then you need to pass `Slide` as a prop. |

The component for the slide is `Slide`. E.g, you can wrap the MeditationTrackItem in the `Slide` component.

_**Usage**_

```
  <MVMeditationMixer>
    <div class="text-cool-grey-350 mb-2 text-xs">Mix Track</div>
      <div class="gap-x-2 px-6">
          <MVCarousel tagName="Slide">
              <MVCarouselSlide :key="0">
                <MVMeditationTrackItem :volume="0"></MVMeditationTrackItem>
              </MVCarouselSlide>
              <MVCarouselSlide v-for="(sound, index) in backgroundSounds" :key="index + 1">
                <MVMeditationTrackItem
                  :sources="formatSources(sound?.item?.mediaAsset.renditions)"
                  :background-src="sound?.item?.coverAsset?.thumbnailUrl"
                />
              </MVCarouselSlide>
          </MVCarousel>
        </div>
  </MVMeditationMixer>
```

## Utils

The components under this category are helpers.

**useDetectBrowser**

This composable is meant to identify what browser and device the user is using to access the application. For e.g, we can use it to hide MeditationVolumeSlider when the user is using iOS and Safari browser because iOS doesn't allow the user to control the volume programmatically other than physical buttons.

It exposes below properties:

- isiPhoneOriPadSafari
- isiPhone
- isiPad
- isTouchDevice

## Package Configuration

**Vue Version Support**

The package uses [Vue Demi](https://www.npmjs.com/package/vue-demi) library to support Vue 2.7 and Vue 3 versions. So, all the Vue components are imported from `vue-demi` and not `vue`.

**Types**

The types for each components are generated using `vite-plugin-dts` library to enable TypeScript support.

**Vite**

For compatibility of Vue 2 with Vite, `@vitejs/plugin-vue2` library is used.

**Treeshaking**

This option can be enabled/disabled using `preserveModules` option in `vite.config.ts` file. Setting `true` enables treeshaking.

## Build/Publish Package

**Build Package**

```
yarn build
```

**Publish Package**

Right now the package is published on GitHub Package Registry. In future, if the package needs to be uploaded on NPM registry then update below url in `package.json` file.

```
"publishConfig": {
  "registry": "https://npm.pkg.github.com"
}
```

Publish the package using below command. Ensure that the `version` number in package.json is incremented every time.

```
yarn library:publish
```

**Tar Ball**

If you just want to build the tar ball, you can use below command.

```
yarn library:pack
```

**Build/Package/Publish**

If you want to build the package, create tar ball and also publish the package, you can use below command.

```
yarn build:library
```

## Download Package

This package can be downloaded using usual package installation approach or through git url.

```
yarn add @mindvalley/mv-universal-player
```

OR

```
yarn add https://github.com/mindvalley/mv-universal-player.git
```

Using git url approach will download the source code and create the package at runtime. The `prepare` script in `package.json` file will execute to build the package once the source code is downloaded. On server (container or GitHub workflow), you might need to update your `yarn install` command to `yarn install --network-concurrency 1` to allow multiple instances of yarn. This is required because one instance will download packages and another build the package.

Note: As the package is available on GitHub Package Registry, users will need appropriate access to download the package.

## Using Package

**Whole Package**

This will register all the components of the library globally and then you can use them in any of the internal components without importing them explicitly.

```
import MVUniversalPlayer from "@mindvalley/mv-universal-player";
import "@mindvalley/mv-universal-player/dist/style.css";

Vue.use(MVUniversalPlayer);
```

**Individual Components (tree-shaking)**

If you want to use only specific components to minimize the bundle size, it is suggested you use this approach.

```
import "@mindvalley/mv-universal-player/dist/style.css";

import {
  useDetectBrowser,
  MVAudioPlayer,
  MVAudioResource,
  MVMeditationMixer,
  MVMeditationVolumeSlider,
  MVMeditationTrackItem,
  MVCarousel,
  MVCarouselSlide,
  MVAudioDescription
} from "@mindvalley/mv-universal-player";
```

Note: If you are already using `vue-sprite` package for Mindvalley Design System icons, it is recommened you go with inidvidual components approach to reduce the package size.
