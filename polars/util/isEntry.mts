import { type Entry } from 'nodejs-polars/types';

export function isEntry( value:unknown ):value is Entry {
    if( typeof value === 'object' && Array.isArray(value) && value !== null ) {
        return true;
    }
    return false;
}





if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/utils.isEntry", () => {

        test("", async () => {


        });

    });

}
