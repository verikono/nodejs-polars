/**
 * Throw an Error inside an evaluation
 * 
 * @param {string} message - the message for this errorclass
 * @param {Error}{ErrorClass - type of Error class to throw
 * 
 * @example myvalue instanceof number ? true : raise('myvalue is not a boolean', TypeError);  
 */
export function raise( message: string, ErrorClass: typeof Error = Error ): never {
    throw new ErrorClass(message);
}




if( import.meta.vitest ) {

    const {
        describe,
        expect,
        it
    } = import.meta.vitest;

    class TestError extends Error {
        constructor(message: string) {
            super(message);
        }
    }

    expect.extend({
        //@ts-ignore
        toThrowErrorType: (fn, expected: Error) => {
            try { fn() }
            catch( err ) {
                if( err instanceof Error ) {
                    const errorName = err.constructor.name;
                    return errorName === expected.name
                        ? { pass: true }
                        : {
                            message: () => `expected an error instance of ${expected.name} but got an instance of ${errorName}`,
                            pass: false,
                        }
                }
                return {
                    message: () => `whilst a catch was evaluated (try/catch) an error was not thrown... (theoritically unreachable!)`,
                    pass: false,
                }
            }
            return {
                message: () => `expected a ${expected.name} error to have been thrown but no error was thrown at all.`,
                pass: false,
            }
        }
    });

    
    describe(`raise`, () => {

        it(`throws an instance of Error with a message`, () =>
            //@ts-ignore
            expect(() => raise("test error message", TestError)).toThrowErrorType(TestError));
    });

}
