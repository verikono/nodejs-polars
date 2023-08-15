import {
    type FSPath
} from './index.mjs';


/** test a string to be a relative fislsytem path - @type {RelFSPath} */
export const RelFSPathRx = /^(.[\/\/].+$|..[\/\/].+$)/;

/** a filesystem path, relative to another entry on the diskroot and NOT the diskroot itself */
export declare type RelFSPath = FSPath & `.${string}` & string;


export function isRelFSPath( value:unknown ):value is RelFSPath {
    if( typeof value === 'string' ) {
        if( RelFSPathRx.test(value) )  {
            return true;
        }
    }
    return false;
}
