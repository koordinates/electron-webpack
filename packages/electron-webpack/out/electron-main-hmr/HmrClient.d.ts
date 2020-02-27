export declare class HmrClient {
    private hot;
    private readonly currentHashGetter;
    lastHash: string | null;
    private readonly ipc;
    constructor(socketPath: string, hot: __WebpackModuleApi.Hot, currentHashGetter: () => string);
    private isUpToDate;
    private check;
}
