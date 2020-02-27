import * as BluebirdPromise from "bluebird";
import "source-map-support/register";
import { Configuration, Plugin, RuleSetRule } from "webpack";
import { ConfigurationEnv, ConfigurationType, ElectronWebpackConfiguration, PackageMetadata, PartConfiguration } from "./core";
export { ElectronWebpackConfiguration } from "./core";
export declare function getAppConfiguration(env: ConfigurationEnv): BluebirdPromise<(Configuration | null)[]>;
export declare function getMainConfiguration(env: ConfigurationEnv): Promise<Configuration | null>;
export declare function getRendererConfiguration(env: ConfigurationEnv): Promise<Configuration | null>;
export declare function getDllConfiguration(env: ConfigurationEnv): Promise<Configuration | null>;
export declare function getTestConfiguration(env: ConfigurationEnv): Promise<Configuration>;
export declare class WebpackConfigurator {
    readonly type: ConfigurationType;
    readonly env: ConfigurationEnv;
    readonly electronWebpackConfiguration: ElectronWebpackConfiguration;
    readonly metadata: PackageMetadata;
    readonly projectDir: string;
    private electronVersionPromise;
    readonly isRenderer: boolean;
    readonly isProduction: boolean;
    readonly isTest: boolean;
    readonly sourceDir: string;
    readonly staticSourceDirectory: string;
    readonly commonSourceDirectory: string;
    readonly commonDistDirectory: string;
    readonly rendererTemplate: string;
    readonly debug: any;
    private _configuration;
    readonly config: Configuration;
    readonly rules: Array<RuleSetRule>;
    readonly plugins: Array<Plugin>;
    readonly extensions: Array<string>;
    private _electronVersion;
    readonly electronVersion: string;
    readonly entryFiles: Array<string>;
    constructor(type: ConfigurationType, env: ConfigurationEnv, electronWebpackConfiguration: ElectronWebpackConfiguration, metadata: PackageMetadata);
    /**
     * Returns null if code processing for type is disabled.
     */
    getSourceDirectory(type: ConfigurationType): string | null;
    getPartConfiguration(type: ConfigurationType): PartConfiguration | null | undefined;
    hasDependency(name: string): boolean;
    hasDevDependency(name: string): boolean;
    /**
     * Returns the names of devDependencies that match a given string or regex.
     * If no matching dependencies are found, an empty array is returned.
     *
     * @return list of matching dependency names, e.g. `["@babel/preset-react", "@babel/preset-stage-0"]`
     */
    getMatchingDevDependencies(options?: GetMatchingDevDependenciesOptions): string[];
    configure(entry?: {
        [key: string]: any;
    } | null): Promise<Configuration>;
    private applyCustomModifications;
    private computeExternals;
}
export declare function createConfigurator(type: ConfigurationType, env: ConfigurationEnv | null): Promise<WebpackConfigurator>;
export declare function configure(type: ConfigurationType, env: ConfigurationEnv | null): Promise<Configuration | null>;
export interface GetMatchingDevDependenciesOptions {
    /**
     * The list of prefixes to include, e.g. `["babel-preset-"]`.
     */
    includes?: Array<string>;
    /**
     * The list of names to exclude.
     */
    excludes?: Array<string>;
}
