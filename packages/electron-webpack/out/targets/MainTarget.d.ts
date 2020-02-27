import { WebpackConfigurator } from "../main";
import { BaseTarget } from "./BaseTarget";
export declare class MainTarget extends BaseTarget {
    constructor();
    configureRules(configurator: WebpackConfigurator): void;
    configurePlugins(configurator: WebpackConfigurator): Promise<void>;
}
