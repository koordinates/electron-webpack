import { Lazy } from "lazy-val";
interface Context {
    projectDir: string;
    packageMetadata: Lazy<{
        [key: string]: any;
    } | null> | null;
}
export default function (context: Context): Promise<{
    extraMetadata: {
        main: string;
    };
    files: ({
        from: string;
        filter: string[];
    } | {
        from: string;
        filter?: undefined;
    })[];
    extraResources: {
        from: string | null | undefined;
        to: string | null | undefined;
    }[];
}>;
export {};
