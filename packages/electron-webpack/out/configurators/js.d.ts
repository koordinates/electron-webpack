import { WebpackConfigurator } from "../main";
export declare function createBabelLoader(configurator: WebpackConfigurator): {
    loader: string;
    options: {
        presets: any[][];
        plugins: any[];
    };
};
