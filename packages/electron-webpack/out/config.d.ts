import { Lazy } from "lazy-val";
import { ElectronWebpackConfiguration } from "./core";
export declare function getPackageMetadata(projectDir: string): Lazy<any>;
export interface ConfigurationRequest {
    projectDir: string;
    packageMetadata: Lazy<{
        [key: string]: any;
    } | null> | null;
}
export declare function getDefaultRelativeSystemDependentCommonSource(): string;
/**
 * Return configuration with resolved staticSourceDirectory / commonDistDirectory / commonSourceDirectory.
 */
export declare function getElectronWebpackConfiguration(context: ConfigurationRequest): Promise<ElectronWebpackConfiguration>;
