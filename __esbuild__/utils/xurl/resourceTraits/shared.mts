import {
    FSURLTraits,
    HttpsURLTraits,
    type HttpsURLSpec,
    type FSURLSpec,
} from './index.mjs';


export declare type URLTraits = {
    file: FSURLTraits;
    https: HttpsURLTraits;
};


export declare type URLSpec = FSURLSpec | HttpsURLSpec;



/** Regex @type {URLSpec} */
export const URLSpecRx = /^[a-z]*:\/\/.+$/;


/** TypeGuard - @type {URLSpec} */
export function isURLSpec( value: unknown ): value is URLSpec {
    if( typeof value === 'string' && !!value.length ) {
        if(URLSpecRx.test(value)) {
            return true;
        }
    }
    return false;
}





if( import.meta.vitest ) {

    const {
        describe,
        test,
        expect
    } = import.meta.vitest;


    describe(`URLSpec`, () => {

        test.each`
            value|expected
            ${"http://www.domain.com"}|${true}
            ${"HTTP://www.domain.com"}|${false}
            ${"ht1p://www.domain.com"}|${false}
            ${"file:///dir/file.txt"}|${true}
            ${"/some/path"}|${false}
        `('$value -> $expected', async ({value, expected}) =>
            expect(URLSpecRx.test(value)).toBe(expected) );

    });

}
