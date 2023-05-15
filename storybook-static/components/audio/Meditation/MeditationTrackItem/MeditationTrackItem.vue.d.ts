import type { Source } from './../../../../types/audio';
declare const _sfc_main: import('./vue/dist/vue.esm.js').DefineComponent<{
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
    isActive: {
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
}, {}, {}, {}, {}, import('./vue/dist/vue.esm.js/types/v3-component-options').ComponentOptionsMixin, import('./vue/dist/vue.esm.js/types/v3-component-options').ComponentOptionsMixin, {}, string, Readonly<import('./vue/dist/vue.esm.js').ExtractPropTypes<{
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
    isActive: {
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
}>>, {
    id: string;
    sources: Source[];
    volume: number;
    isActive: boolean;
}>;
export default _sfc_main;
