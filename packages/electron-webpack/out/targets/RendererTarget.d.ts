import { WebpackConfigurator } from "../main";
import { BaseTarget } from "./BaseTarget";
export declare class BaseRendererTarget extends BaseTarget {
    constructor();
    configureRules(configurator: WebpackConfigurator): void;
    configurePlugins(configurator: WebpackConfigurator): Promise<void>;
}
export declare class RendererTarget extends BaseRendererTarget {
    constructor();
    configurePlugins(configurator: WebpackConfigurator): Promise<void>;
}
