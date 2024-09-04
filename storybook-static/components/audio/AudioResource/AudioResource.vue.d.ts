import type { Source } from './../../../types/audio';
declare const _sfc_main: import('./vue/dist/vue.esm-bundler.js').DefineComponent<import('./vue/dist/vue.esm-bundler.js').ExtractPropTypes<{
    assetId: {
        required: true;
        type: StringConstructor;
    };
    sources: {
        required: true;
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
    };
    title: {
        required: true;
        type: StringConstructor;
    };
    artistName: {
        type: StringConstructor;
        default: string;
    };
    duration: {
        required: true;
        type: NumberConstructor;
    };
    posterUrl: {
        type: StringConstructor;
    };
    ratings: {
        type: NumberConstructor;
    };
    totalRatings: {
        type: NumberConstructor;
    };
    overlay: {
        type: BooleanConstructor;
    };
    blurEffect: {
        type: BooleanConstructor;
    };
    showFavourite: {
        type: BooleanConstructor;
    };
    isFavourite: {
        type: BooleanConstructor;
    };
    favouriteIcon: {
        type: StringConstructor;
        default: string;
    };
    unfavouriteIcon: {
        type: StringConstructor;
        default: string;
    };
    favouriteIconColor: {
        type: StringConstructor;
        default: string;
    };
}>, {}, {}, {}, {}, import('./vue/dist/vue.esm-bundler.js').ComponentOptionsMixin, import('./vue/dist/vue.esm-bundler.js').ComponentOptionsMixin, ("timeupdate" | "play" | "pause" | "seeking" | "ended" | "rewind" | "fastforward" | "reset" | "error" | "playtime")[], "timeupdate" | "play" | "pause" | "seeking" | "ended" | "rewind" | "fastforward" | "reset" | "error" | "playtime", import('./vue/dist/vue.esm-bundler.js').PublicProps, Readonly<{
    sources: Source[];
    duration: number;
    assetId: string;
    title: string;
    artistName: string;
    overlay: boolean;
    blurEffect: boolean;
    showFavourite: boolean;
    isFavourite: boolean;
    favouriteIcon: string;
    unfavouriteIcon: string;
    favouriteIconColor: string;
} & {
    posterUrl?: string | undefined;
    ratings?: number | undefined;
    totalRatings?: number | undefined;
} & {
    onTimeupdate?: ((...args: any[]) => any) | undefined;
    onPlay?: ((...args: any[]) => any) | undefined;
    onPause?: ((...args: any[]) => any) | undefined;
    onSeeking?: ((...args: any[]) => any) | undefined;
    onEnded?: ((...args: any[]) => any) | undefined;
    onRewind?: ((...args: any[]) => any) | undefined;
    onFastforward?: ((...args: any[]) => any) | undefined;
    onReset?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
    onPlaytime?: ((...args: any[]) => any) | undefined;
}>, {
    artistName: string;
    overlay: boolean;
    blurEffect: boolean;
    showFavourite: boolean;
    isFavourite: boolean;
    favouriteIcon: string;
    unfavouriteIcon: string;
    favouriteIconColor: string;
}, {}, {}, {}, string, import('./vue/dist/vue.esm-bundler.js').ComponentProvideOptions, true, {}>;
export default _sfc_main;
