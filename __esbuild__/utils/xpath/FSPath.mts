/** A filesystem path, relative or absolute, file or directory. */
export declare type FSPath = string;


/** test a string to be an filesystem path - @type {FSPath} */
export const FSPathRx = /^([A-Z]:\\.+$|\/.+$|.[\/\/].+$|..[\/\/].+$)/;


/** TypeGuard = @type {FSPath} */
export function isFSPath( value:unknown ):value is FSPath {
    if(typeof value === "string") {
        if(FSPathRx.test(value)) {
            return true;
        }
    }
    return false;
}




if(import.meta.vitest) {
    
    const {
        describe,
        test,
        expect
    } = import.meta.vitest;


    describe(`@verikono/xpath.FSPathRx`, () => {

        test(`FSPathRx is a RegExp`, () => expect(FSPathRx).toBeInstanceOf(RegExp));

    });

    describe(`xpath.isFSPath`, () => {

        test(`isFSPath is a function`, () => expect(isFSPath).toBeTypeOf('function'));

    });

}
