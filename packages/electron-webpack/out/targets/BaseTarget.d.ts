import { WebpackConfigurator } from "../main";
export declare class BaseTarget {
    configureRules(configurator: WebpackConfigurator): void;
    configurePlugins(configurator: WebpackConfigurator): Promise<void>;
}
export declare function configureFileLoader(prefix: string, limit?: number): {
    limit: number;
    name: string;
};
