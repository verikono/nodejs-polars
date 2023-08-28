import {
    type DataFrame,
    isDataFrame,
} from 'nodejs-polars/dataframe';

export const isDataFrameArray = (ty: any): ty is DataFrame[] => Array.isArray(ty) && isDataFrame(ty[0]);




if(import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/utils.isDataFrameArray", () => {

        test("", async () => {


        });

    });

}
