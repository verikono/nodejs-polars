import { Series, isSeries } from 'nodejs-polars/series';



export function prepareOtherArg(anyValue: any): Series {
    if (isSeries(anyValue)) {
        return anyValue;
    } else {
        return Series([anyValue]) as Series;
    }
}
