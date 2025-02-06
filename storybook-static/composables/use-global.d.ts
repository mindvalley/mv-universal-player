export declare function useGlobal(): {
    humanizeTime: (duration: number) => string;
    formatSources: (sources?: any, isAudio?: boolean) => {
        type: any;
        src: any;
    }[];
    getUUID: () => string;
};
