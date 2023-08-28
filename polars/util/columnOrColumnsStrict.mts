import { type ValueOrArray, } from 'nodejs-polars/types';



/** @ignore */
export function columnOrColumnsStrict( ...columns: string[] | ValueOrArray<string>[] ): Array<string> {
    return columns.flat(3) as any;
}





if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/utils.columnOrColumnsStrict", () => {

        test("", async () => {


        });

    });

}

