import Crocket from "crocket";
import { Stats } from "webpack";
export declare class HmrServer {
    private state;
    readonly ipc: Crocket;
    listen(): Promise<string>;
    beforeCompile(): void;
    built(stats: Stats): void;
}
