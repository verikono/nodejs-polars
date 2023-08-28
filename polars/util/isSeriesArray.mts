import {
    type Series,
    isSeries,
} from 'nodejs-polars/series';


export function isSeriesArray( value:unknown ):value is Series[] {
    if(Array.isArray(value)) {
        if(value.every(isSeries)) {
            return true;
        }
    }
    return false;
}





if (import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/utils.isSeriesArray", () => {

        test("", async () => {


        });

    });

}

