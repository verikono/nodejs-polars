import { PLRDataFrame } from "./PLRDataFrame.mjs";
import { match } from 'nodejs-polars/util';

export function toPLRDataFrame( value:unknown ): PLRDataFrame {
    return match(
        () => Array.isArray(value) ? new PLRDataFrame(value) : undefined
    );
}




if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/dataframe.toPLRDataFrame", () => {

        test("from an array", async () => {
            const result = toPLRDataFrame([1,2,3,4]);
            console.log(result);
        });

    });

}
