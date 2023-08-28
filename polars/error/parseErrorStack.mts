type ParsedErrorStack = {
    function: string;
    class: string | null;
    line: number;
    url: URL;
}

export function parseErrorStack( options:{offset:number} = { offset: 1 } ) {
    const { offset } = options;
    try { throw new Error() }
    catch( err:unknown ) {
        if( err instanceof Error ) {
            const stack = err.stack;
            console.log('stack');
        }
    };
}





if(import.meta.vitest) {

    const {
        beforeAll,
        describe,
        test,
        expect,
    } = import.meta.vitest;


    describe("nodejs-polars/error.parseErrorStack", () => {

        let testParseErrorStack:typeof parseErrorStack;

        beforeAll(async () => {
            testParseErrorStack = (await import('nodejs-polars/error')).parseErrorStack;
        });

        test("exports the parseErrorStack function", () => expect(testParseErrorStack).toBeTypeOf('function'));

    });

}
