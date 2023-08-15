import {
    raise
} from '../../raise/index.mjs';

import {
    type FSURLSpec,
    type HttpsURLSpec,
    type URLSpec,
    type ResourceTypeMap,
    FSURLTraits,
    HttpsURLTraits,
} from './index.mjs';

// export function getSpecType( spec: FSURLSpec ): "file";
// export function getSpecType( spec: HttpsURLSpec ): "https";
// export function getSpecType( spec ) {
//     return spec.startsWith('file') ? "file" :
//         spec.startsWith('https') ? "https" :
//         raise(`failed determining url spec type for ${spec}`);
// }



export function getResourceTraits( spec: FSURLSpec ): FSURLTraits;
export function getResourceTraits( spec: HttpsURLSpec ): HttpsURLTraits;
export function getResourceTraits<T extends keyof ResourceTypeMap>( spec: string ): ResourceTypeMap[T];
export function getResourceTraits( spec: string ): FSURLTraits | HttpsURLTraits {
    return spec.startsWith('file') ? FSURLTraits :
        spec.startsWith('https') ? HttpsURLTraits :
        raise(`failed determing protocol type for ${spec}`);
}





if( import.meta.vitest ) {

    const {
        beforeAll,
        describe,
        test,
        expect
    } = import.meta.vitest;


    describe(`getResourceTraits`, () => {

        test(`receives a FSURLTraits from a file URLSpec`,() => {
            expect(getResourceTraits(import.meta.url)).toMatchObject(FSURLTraits);
        })

        test(`receives HttpsURLTraits from a https URLSpec`,() => {
            expect(getResourceTraits("https://domain.com/file.txt")).toMatchObject(HttpsURLTraits);
        })
    });

}
