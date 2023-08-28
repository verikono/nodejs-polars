
function getCallerInformation( options:{offset:number} = { offset: 1 } ) {
    const { offset } = options;
    try { throw new Error() }
    catch( err:unknown ) {
        if( err instanceof Error ) {
            const stack = err.stack;
        }
    };
}


export class UnhandledException extends RangeError {

    constructor( message:string = 'no further information provided.' ) {
        super(`Unhandled Exception: ${message}`);
    }


}





if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;


    describe("nodejs-polars/error.UnhandledException", () => {

        test("", async () => {


        });

    });

}
