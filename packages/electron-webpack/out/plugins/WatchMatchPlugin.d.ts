import { Compiler } from "webpack";
export declare class WatchFilterPlugin {
    private readonly filter;
    private readonly debug;
    constructor(filter: WatchFileSystemFilter, debug: any);
    apply(compiler: Compiler): void;
}
export declare type WatchFileSystemFilter = (file: string) => boolean;
export declare type WatchFileSystemCallback = (error: Error | null, filesModified?: Array<string>, dirsModified?: Array<string>, missingModified?: Array<string>, fileTimestamps?: {
    [key: string]: number;
}, dirTimestamps?: {
    [key: string]: number;
}) => void;
