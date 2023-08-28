import {
    type ColumnsOrExpr,
} from '@polars/util/index.mjs';

import {
    type DataFrame,
} from 'nodejs-polars/dataframe';



/** intermediate state of a dynamic groupby */
export interface DynamicGroupBy {
    agg(column: ColumnsOrExpr, ...columns: ColumnsOrExpr[]): DataFrame;
}

/** @ignore */
export function DynamicGroupBy(
    df: any,
    indexColumn: string,
    every: string,
    period?: string,
    offset?: string,
    truncate?: boolean,
    includeBoundaries?: boolean,
    closed?: string,
    by?: ColumnsOrExpr,
): DynamicGroupBy {
    return {
        agg(column: ColumnsOrExpr, ...columns: ColumnsOrExpr[]) {
            return df
                .lazy()
                .groupByDynamic({
                    indexColumn,
                    every,
                    period,
                    offset,
                    truncate,
                    includeBoundaries,
                    closed,
                    by,
                } as any)
                .agg(column as any, ...columns)
                .collectSync({ noOptimizations: true });
        },
    };
}





if (import.meta.vitest) {

    const {
        describe,
        test,
        expect,
    } = import.meta.vitest;

    describe("nodejs-polars/groupby.DynamicGroupBy", () => {

        test("", async () => {


        });

    });

}
