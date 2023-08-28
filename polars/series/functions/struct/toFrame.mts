import { DataFrameClass } from 'nodejs-polars/dataframe';

export function toFrame( this: DataFrameClass ):DataFrameClass {
    return new DataFrameClass( this.structToFrame() );
}





if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    const { SeriesClass } = await import('nodejs-polars/series');

    describe("nodejs-polars/series.functions.struct.toFrame", () => {

        test("works in the context of a Series instance", async () => {


        });

    });

}
