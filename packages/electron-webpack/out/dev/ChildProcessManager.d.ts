/// <reference types="node" />
import { ChildProcess, SpawnOptions } from "child_process";
export declare function run(program: string, args: Array<string>, options: SpawnOptions): ChildProcess;
export declare class ChildProcessManager {
    private mainProcessExitCleanupCallback;
    private child;
    constructor(child: ChildProcess, debugLabel: string, promiseNotifier: PromiseNotifier | null);
}
export declare class PromiseNotifier {
    private _resolve;
    private _reject;
    constructor(_resolve: (() => void) | null, _reject: ((error: Error) => void) | null);
    resolve(): void;
    reject(error: Error): void;
}
