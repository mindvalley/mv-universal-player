import type { Source } from '../../../types/audio';
declare const _sfc_main: import('./vue/dist/vue.esm.js').DefineComponent<{
    id: {
        type: StringConstructor;
        default: () => string;
    };
    sources: {
        type: {
            (arrayLength: number): Source[];
            (...items: Source[]): Source[];
            new (arrayLength: number): Source[];
            new (...items: Source[]): Source[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        required: true;
        default: () => never[];
    };
}, {
    player: {
        play: () => void;
        pause: () => void;
        setAudio: () => void;
        setVolume: (volume: number) => void;
        seek: (time: number) => void;
        fastForward: (seconds: number) => void;
        rewind: (seconds: number) => void;
        setPlaybackRate: (rate: number) => void;
        setSources: (sources: Source[]) => void;
        setMixing: (enabled: boolean) => void;
        setCurrentTime: (time: number) => void;
        reset: () => void;
    };
    state: Readonly<import('./vue/dist/vue.esm.js').Ref<{
        readonly currentTime: number;
        readonly playing: boolean;
        readonly currentPlayingAudioItemId: any;
        readonly mixing: any;
        readonly volume: any;
    }>>;
}, {}, {}, {}, import('./vue/dist/vue.esm.js/types/v3-component-options').ComponentOptionsMixin, import('./vue/dist/vue.esm.js/types/v3-component-options').ComponentOptionsMixin, ("timeupdate" | "play" | "pause" | "seeking" | "ended" | "rewind" | "fastforward")[], string, Readonly<import('./vue/dist/vue.esm.js').ExtractPropTypes<{
    id: {
        type: StringConstructor;
        default: () => string;
    };
    sources: {
        type: {
            (arrayLength: number): Source[];
            (...items: Source[]): Source[];
            new (arrayLength: number): Source[];
            new (...items: Source[]): Source[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        required: true;
        default: () => never[];
    };
}>>, {
    id: string;
    sources: Source[];
}>;
export default _sfc_main;
