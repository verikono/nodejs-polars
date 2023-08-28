import { formatWithOptions } from 'node:util';
import { INSPECT_SYMBOL } from 'nodejs-polars/internals';
import { DataFrameClass } from 'nodejs-polars/dataframe';


export function PivotOps( df: unknown[], by: string | string[], pivotCol: string, valueCol: string ): PivotOps {

    const pivot = (agg) => () => new DataFrameClass(df.pivot([by].flat(), [pivotCol], [valueCol], agg));
    const customInspect = () => formatWithOptions(inspectOpts, "PivotOps {by: %O}", by);

    return {
        [INSPECT_SYMBOL]: customInspect,
        first: pivot("first"),
        sum: pivot("sum"),
        min: pivot("min"),
        max: pivot("max"),
        mean: pivot("mean"),
        count: pivot("count"),
        median: pivot("median"),
    };
}
