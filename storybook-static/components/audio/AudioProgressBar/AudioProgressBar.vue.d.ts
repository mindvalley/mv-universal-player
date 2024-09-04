declare const _sfc_main: import('./vue/dist/vue.esm-bundler.js').DefineComponent<import('./vue/dist/vue.esm-bundler.js').ExtractPropTypes<{
    duration: {
        type: NumberConstructor;
        required: true;
    };
    currentTime: {
        type: NumberConstructor;
        required: true;
        default: number;
    };
}>, {}, {}, {}, {}, import('./vue/dist/vue.esm-bundler.js').ComponentOptionsMixin, import('./vue/dist/vue.esm-bundler.js').ComponentOptionsMixin, "seek"[], "seek", import('./vue/dist/vue.esm-bundler.js').PublicProps, Readonly<{
    duration: number;
    currentTime: number;
} & {} & {
    onSeek?: ((...args: any[]) => any) | undefined;
}>, {
    currentTime: number;
}, {}, {}, {}, string, import('./vue/dist/vue.esm-bundler.js').ComponentProvideOptions, true, {}>;
export default _sfc_main;
