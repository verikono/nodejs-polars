import {
    FSURLTraits
} from './file.mjs';

import {
    HttpsURLTraits
} from './https.mjs';

export {
    type URLSpec,
} from './shared.mjs';

export {
    type HttpsURLSpec,  
    HttpsURLTraits,
} from './https.mjs';

export {
    type FSURLSpec,
    isFSURLSpec,
    FSURLTraits,
    applyFSURLTraits,
} from './file.mjs';

export {
    getResourceTraits,
} from './getResourceTraits.mjs';


export declare type URLTypes = "file" | "https";

export declare type ResourceTypeMap = {
    file: FSURLTraits,
    https: HttpsURLTraits,
}
