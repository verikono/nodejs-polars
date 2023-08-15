export declare type URLSpec = string;



/**  */
export const URLSpec = /^[a-z]*:\/\/.+$/;





/** TypeGuard - @type {URLSpec} */
export function isURLSpec( value: unknown ): value is URLSpec {
    if( typeof value === 'string' && !!value.length ) {
        if(URLSpec.test(value)) {
            return true;
        }
    }
    return false;
}


/**  */
export function isFSURLSpec( value: unknown ): value is FSURLSpec {
    if( typeof value === 'string' && !!value.length ) {
        if(FSURLSpecRx.test(value)) {
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
            expect(URLSpec.test(value)).toBe(expected) );

    });

    describe(`FSURLSpecRx`, () => {

        test.each([
            [ import.meta.url, true ],
            [ "/some/path", false ],
            [ "http://www.domain.com", false ],
            [ "ftp://www.download.com", false ]
        ])( `%s -> %s`, async (value, expected) =>
            expect(FSURLSpecRx.test(value)).toBe(expected) );

    });

}
