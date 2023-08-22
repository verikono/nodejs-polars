import { isSeries } from 'nodejs-polars/series';
import { JsDataFrame } from 'nodejs-polars/internals';

export function objToDF( obj:Record<string, Array<any>> ): ReturnType<JsDataFrame> {
    const columns = Object.entries(obj).map(([name, values]) => {
        if(isSeries(values)) {
            return values.rename(name).inner();
        }
        return Series(name, values).inner();
    });
    return new JsDataFrame(columns);
}
