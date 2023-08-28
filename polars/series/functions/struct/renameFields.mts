import { DataFrameClass } from 'nodejs-polars/dataframe';

export function renameFields( this: DataFrameClass, classref: any, context:any ):DataFrameClass {
    return new DataFrameClass( this.structToFrame() );
}





if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    const { SeriesClass } = await import('nodejs-polars/series');

    describe("nodejs-polars/series.functions.struct.renameFields", () => {

        test("works in the context of a Series instance", async () => {


        });

    });

}
