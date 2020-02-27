import { WebpackConfigurator } from "../main";
export declare function configureDll(configurator: WebpackConfigurator): Promise<string | null>;
export declare function getDllAssets(dllDir: string, configurator: WebpackConfigurator): Promise<string[]>;
