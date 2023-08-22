import {
    type DataFrame,
} from 'nodejs-polars/dataframe';

import {
    type ColumnsOrExpr,
} from 'nodejs-polars/utils';



/**
 * Starts a new GroupBy operation.
 */
export interface GroupBy {
    [inspect](): string;
    /**
     * Aggregate the groups into Series.
     */
    aggList(): DataFrame;
    /**
     * __Use multiple aggregations on columns.__
     * This can be combined with complete lazy API and is considered idiomatic polars.
     * ___
     * @param columns - map of 'col' -> 'agg'
     *
     *  - using lazy API (recommended): `[col('foo').sum(), col('bar').min()]`
     *  - using multiple aggs per column: `{'foo': ['sum', 'numUnique'], 'bar': ['min'] }`
     *  - using single agg per column:  `{'foo': ['sum'], 'bar': 'min' }`
     * @example
     * ```
     * // use lazy api rest parameter style
     * > df.groupBy('foo', 'bar')
     * >   .agg(pl.sum('ham'), col('spam').tail(4).sum())
     *
     * // use lazy api array style
     * > df.groupBy('foo', 'bar')
     * >   .agg([pl.sum('ham'), col('spam').tail(4).sum()])
     *
     * // use a mapping
     * > df.groupBy('foo', 'bar')
     * >   .agg({'spam': ['sum', 'min']})
     *
     * ```
     */
    agg(...columns: Expr[]): DataFrame;
    agg(columns: Record<string, keyof Expr | (keyof Expr)[]>): DataFrame;
    /**
     * Count the number of values in each group.
     */
    count(): DataFrame;
    /**
     * Aggregate the first values in the group.
     */
    first(): DataFrame;

    /**
     * Return a `DataFrame` with:
     *   - the groupby keys
     *   - the group indexes aggregated as lists
     */
    groups(): DataFrame;
    /**
     * Return first n rows of each group.
     * @param n -Number of values of the group to select
     * @example
     * ```
     * > df = pl.DataFrame({
     * >   "letters": ["c", "c", "a", "c", "a", "b"],
     * >   "nrs": [1, 2, 3, 4, 5, 6]
     * > })
     * > df
     * shape: (6, 2)
     * ╭─────────┬─────╮
     * │ letters ┆ nrs │
     * │ ---     ┆ --- │
     * │ str     ┆ i64 │
     * ╞═════════╪═════╡
     * │ "c"     ┆ 1   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 2   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "a"     ┆ 3   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 4   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "a"     ┆ 5   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "b"     ┆ 6   │
     * ╰─────────┴─────╯
     * > df.groupby("letters")
     * >   .head(2)
     * >   .sort("letters");
     * > >>
     * shape: (5, 2)
     * ╭─────────┬─────╮
     * │ letters ┆ nrs │
     * │ ---     ┆ --- │
     * │ str     ┆ i64 │
     * ╞═════════╪═════╡
     * │ "a"     ┆ 3   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "a"     ┆ 5   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "b"     ┆ 6   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 1   │
     * ├╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌┤
     * │ "c"     ┆ 2   │
     * ╰─────────┴─────╯
     * ```
     */
    head(n?: number): DataFrame;
    /**
     * Aggregate the last values in the group.
     */
    last(): DataFrame;
    /**
     * Reduce the groups to the maximal value.
     */
    max(): DataFrame;
    /**
     * Reduce the groups to the mean values.
     */
    mean(): DataFrame;
    /**
     * Return the median per group.
     */
    median(): DataFrame;
    /**
     * Reduce the groups to the minimal value.
     */
    min(): DataFrame;
    /**
     * Count the unique values per group.
     */
    nUnique(): DataFrame;
    /**
     * Do a pivot operation based on the group key, a pivot column and an aggregation function on the values column.
     * @param pivotCol - Column to pivot.
     * @param valuesCol - Column that will be aggregated.
     *
     */
    pivot({
        pivotCol,
        valuesCol,
    }: { pivotCol: string; valuesCol: string }): PivotOps;
    pivot(pivotCol: string, valuesCol: string): PivotOps;
    /**
     * Compute the quantile per group.
     */
    quantile(quantile: number): DataFrame;
    /**
     * Reduce the groups to the sum.
     */
    sum(): DataFrame;
    tail(n?: number): DataFrame;
    toString(): string;
}


export type PivotOps = Pick<GroupBy, "count" | "first" | "max" | "mean" | "median" | "min" | "sum"> & { [inspect](): string };

/**
 * intermediate state of a rolling groupby
 */
export interface RollingGroupBy {
    agg( column: ColumnsOrExpr, ...columns: ColumnsOrExpr[] ): DataFrame;
}
