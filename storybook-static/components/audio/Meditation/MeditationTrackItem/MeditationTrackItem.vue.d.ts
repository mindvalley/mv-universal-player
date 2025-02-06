import type { Source } from './../../../../types/audio';
declare const _sfc_main: import('./vue/dist/vue.esm-bundler.js').DefineComponent<import('./vue/dist/vue.esm-bundler.js').ExtractPropTypes<{
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
        default: () => never[];
    };
    isSelected: {
        type: BooleanConstructor;
    };
    backgroundSrc: {
        type: StringConstructor;
    };
    id: {
        type: StringConstructor;
        default: () => string;
    };
    volume: {
        type: NumberConstructor;
        default: number;
    };
}>, {}, {}, {}, {}, import('./vue/dist/vue.esm-bundler.js').ComponentOptionsMixin, import('./vue/dist/vue.esm-bundler.js').ComponentOptionsMixin, ("timeupdate" | "play" | "pause" | "ended" | "error")[], "timeupdate" | "play" | "pause" | "ended" | "error", import('./vue/dist/vue.esm-bundler.js').PublicProps, Readonly<{
    id: string;
    sources: Source[];
    isSelected: boolean;
    volume: number;
} & {
    backgroundSrc?: string | undefined;
} & {
    onTimeupdate?: ((...args: any[]) => any) | undefined;
    onPlay?: ((...args: any[]) => any) | undefined;
    onPause?: ((...args: any[]) => any) | undefined;
    onEnded?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
}>, {
    id: string;
    sources: Source[];
    isSelected: boolean;
    volume: number;
}, {}, {}, {}, string, import('./vue/dist/vue.esm-bundler.js').ComponentProvideOptions, true, {}>;
export default _sfc_main;
