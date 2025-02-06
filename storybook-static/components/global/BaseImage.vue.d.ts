declare const _sfc_main: import('./vue/dist/vue.esm-bundler.js').DefineComponent<import('./vue/dist/vue.esm-bundler.js').ExtractPropTypes<{
    aspectRatio: {
        default: string;
        required: true;
        type: StringConstructor;
    };
    src: {
        required: true;
        type: StringConstructor;
    };
    lazyload: {
        default: boolean;
        type: BooleanConstructor;
    };
    width: {
        required: true;
        type: NumberConstructor;
    };
    quality: {
        default: number;
        type: NumberConstructor;
    };
    imgClass: {
        type: StringConstructor;
    };
}>, {}, {}, {}, {}, import('./vue/dist/vue.esm-bundler.js').ComponentOptionsMixin, import('./vue/dist/vue.esm-bundler.js').ComponentOptionsMixin, {}, string, import('./vue/dist/vue.esm-bundler.js').PublicProps, Readonly<{
    aspectRatio: string;
    src: string;
    lazyload: boolean;
    width: number;
    quality: number;
} & {
    imgClass?: string | undefined;
} & {}>, {
    aspectRatio: string;
    lazyload: boolean;
    quality: number;
}, {}, {}, {}, string, import('./vue/dist/vue.esm-bundler.js').ComponentProvideOptions, true, {}>;
export default _sfc_main;
