import {
    type ColumnsOrExpr,
} from 'nodejs-polars/types';



/** @ignore */
export function RollingGroupBy( df: any, indexColumn: ColumnsOrExpr, period: string, offset?: string, closed?, by?: ColumnsOrExpr, check_sorted?: boolean ): RollingGroupBy {

    return {
        agg(column: ColumnsOrExpr, ...columns: ColumnsOrExpr[]) {
            return df
                .lazy()
                .groupByRolling({
                    indexColumn,
                    period,
                    offset,
                    closed,
                    by,
                    check_sorted,
                } as any)
                .agg(column as any, ...columns)
                .collectSync();
        },
    };
}
