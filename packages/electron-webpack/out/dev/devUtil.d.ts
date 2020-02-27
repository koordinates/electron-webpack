/// <reference types="node" />
import { ChildProcess } from "child_process";
export interface LineFilter {
    filter(line: string): boolean;
}
export declare function logProcessErrorOutput(label: "Electron" | "Renderer" | "Main", childProcess: ChildProcess): void;
export declare function logError(label: "Electron" | "Renderer" | "Main", error: Error): void;
export declare function logProcess(label: "Electron" | "Renderer" | "Main", data: string | Buffer, labelColor: any, lineFilter?: LineFilter | null): void;
export declare class DelayedFunction {
    private readonly executor;
    private handle;
    constructor(executor: () => void);
    schedule(): void;
    cancel(): void;
}
export declare function getCommonEnv(): {
    NODE_ENV: string;
    DEBUG_COLORS: boolean;
    DEBUG_FD: string;
};
