/// <reference types="node" />
import { Stats } from "fs-extra";
import { Compiler } from "webpack";
export declare const MAX_FILE_REQUESTS = 8;
export declare const CONCURRENCY: {
    concurrency: number;
};
export declare function walk(initialDirPath: string, filter?: Filter | null): Promise<Array<string>>;
export declare type Filter = (file: string, stat: Stats) => boolean;
export declare class WebpackRemoveOldAssetsPlugin {
    private readonly dllManifest;
    constructor(dllManifest: string | null);
    apply(compiler: Compiler): void;
}
