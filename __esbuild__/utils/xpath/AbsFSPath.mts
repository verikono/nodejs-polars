import {
    type FSPath,
} from './index.mjs';



/** a filesystem path, relative to the diskroot or "absolute" */
export declare type AbsFSPath = FSPath & string;


/** test a string to be an absolute filesystem path - @type {AbsFSPath} */
export const AbsFSPathRx = /^([A-Z]:\\.+$|\/.+$)/;


/** TypeGuard - @type {AbsFSPath} */
export function isAbsFSPath( value: unknown ):value is AbsFSPath {
    if( typeof value === "string" ) {
        if( AbsFSPathRx.test(value) ) {
            return true;
        }
    }
    return false;
}


// export function toAbsFsPath( entry: FSPath | FSUrlSpec | URL, base?: FsUrlSpec | URL ): AbsFsPath {

//     const issues: string[] = [];

//     if( entry instanceof URL ) return entry.pathname;
//     if( isFSURLSpec(entry) ) return entry.substring(8);
//     if( isRelFSPath(entry) && !!base ) {
//         try {
//             const url = new URL(entry, base);
//             return url.pathname;
//         }
//         catch( err ) {
//             issues.push("relative filepath entries require the base to be set.");
//         }
//     }
//     throw new Error([
//         `failed producing a valid and absolute filesystem path:`,
//         `entry: "${entry}"`,
//         `base: "${base || "none"}`,
//     ].concat(issues).join('\n'));

// }





if(import.meta.vitest) {
    
    const {
        describe,
        it,
        expect
    } = import.meta.vitest;

    describe(`isAbsFSPath`, () => {

        it(`returns AbsFsPath when argued a URL`, () => expect(isAbsFSPath(new URL(import.meta.url).pathname)).toBe(true));

    });

}
