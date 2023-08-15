/** Secure HTTP Specifier for https accessible resources */
export declare type HttpsURLSpec = `${'https://'}${string}`;

/** Secure HTTP Specifier regex */
export const HttpsURLSpecRx = /^https:\/\/.+$/;

/** TypeGuard fro HttpsUrlSpec */
export function isHttpsUrlSpec( value: unknown ): value is HttpsURLSpec {
    if( typeof value === "string" ) {
        if( HttpsURLSpecRx.test(value) ) {
            return true;
        }
    }
    return false;
}




export class HttpsURLTraits {
    
}
