import {
    type DataFrame,
} from 'nodejs-polars/dataframe';




/** Representation of a Lazy computation graph / query. */
export interface LazyDataFrame extends Serialize, GroupByOps<LazyGroupBy> {

    /** @ignore */
    _ldf: any;
    [inspect](): string;

    get columns(): string[];

    /** Cache the result once the execution of the physical plan hits this node. */
    cache(): LazyDataFrame;
    clone(): LazyDataFrame;

    /**
     *
     * Collect into a DataFrame.
     * Note: use `fetch` if you want to run this query on the first `n` rows only.
     * This can be a huge time saver in debugging queries.
     * @param typeCoercion -Do type coercion optimization.
     * @param predicatePushdown - Do predicate pushdown optimization.
     * @param projectionPushdown - Do projection pushdown optimization.
     * @param simplifyExpression - Run simplify expressions optimization.
     * @param stringCache - Use a global string cache in this query.
     *     This is needed if you want to join on categorical columns.
     *     Caution!
     * *  If you already have set a global string cache, set this to `false` as this will reset the
     * *  global cache when the query is finished.
     * @param noOptimization - Turn off optimizations.
     * @return DataFrame
     *
     */
    collect(opts?: LazyOptions): Promise<DataFrame>;
    collectSync(opts?: LazyOptions): DataFrame;
    /**
     * A string representation of the optimized query plan.
     */
    describeOptimizedPlan(opts?: LazyOptions): string;
    /**
     * A string representation of the unoptimized query plan.
     */
    describePlan(): string;
    /**
     * Remove one or multiple columns from a DataFrame.
     * @param columns - column or list of columns to be removed
     */
    drop(name: string): LazyDataFrame;
    drop(names: string[]): LazyDataFrame;
    drop(name: string, ...names: string[]): LazyDataFrame;
    /**
     * Drop duplicate rows from this DataFrame.
     * Note that this fails if there is a column of type `List` in the DataFrame.
     * @param maintainOrder
     * @param subset - subset to drop duplicates for
     * @param keep "first" | "last"
     * @deprecated @since 0.4.0 @use {@link unique}
     */
    distinct(
        maintainOrder?: boolean,
        subset?: ColumnSelection,
        keep?: "first" | "last",
    ): LazyDataFrame;
    distinct(opts: {
        maintainOrder?: boolean;
        subset?: ColumnSelection;
        keep?: "first" | "last";
    }): LazyDataFrame;
    /**
     * Drop rows with null values from this DataFrame.
     * This method only drops nulls row-wise if any single value of the row is null.
     */
    dropNulls(column: string): LazyDataFrame;
    dropNulls(columns: string[]): LazyDataFrame;
    dropNulls(...columns: string[]): LazyDataFrame;
    /**
     * Explode lists to long format.
     */
    explode(column: ExprOrString): LazyDataFrame;
    explode(columns: ExprOrString[]): LazyDataFrame;
    explode(column: ExprOrString, ...columns: ExprOrString[]): LazyDataFrame;
    /**
     * Fetch is like a collect operation, but it overwrites the number of rows read by every scan
     *
     * Note that the fetch does not guarantee the final number of rows in the DataFrame.
     * Filter, join operations and a lower number of rows available in the scanned file influence
     * the final number of rows.
     * @param numRows - collect 'n' number of rows from data source
     * @param opts
     * @param opts.typeCoercion -Do type coercion optimization.
     * @param opts.predicatePushdown - Do predicate pushdown optimization.
     * @param opts.projectionPushdown - Do projection pushdown optimization.
     * @param opts.simplifyExpression - Run simplify expressions optimization.
     * @param opts.stringCache - Use a global string cache in this query.
     */
    fetch(numRows?: number): Promise<DataFrame>;
    fetch(numRows: number, opts: LazyOptions): Promise<DataFrame>;
    /** Behaves the same as fetch, but will perform the actions synchronously */
    fetchSync(numRows?: number): DataFrame;
    fetchSync(numRows: number, opts: LazyOptions): DataFrame;
    /**
     * Fill missing values
     * @param fillValue value to fill the missing values with
     */
    fillNull(fillValue: string | number | Expr): LazyDataFrame;
    /**
     * Filter the rows in the DataFrame based on a predicate expression.
     * @param predicate - Expression that evaluates to a boolean Series.
     * @example
     * ```
     * > lf = pl.DataFrame({
     * >   "foo": [1, 2, 3],
     * >   "bar": [6, 7, 8],
     * >   "ham": ['a', 'b', 'c']
     * > }).lazy()
     * > // Filter on one condition
     * > lf.filter(pl.col("foo").lt(3)).collect()
     * shape: (2, 3)
     * ┌─────┬─────┬─────┐
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 6   ┆ a   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 2   ┆ 7   ┆ b   │
     * └─────┴─────┴─────┘
     * ```
     */
    filter(predicate: Expr | string): LazyDataFrame;
    /**
     * Get the first row of the DataFrame.
     */
    first(): DataFrame;
    /**
     * Start a groupby operation.
     */
    groupBy(by: ColumnsOrExpr, maintainOrder?: boolean): LazyGroupBy;
    groupBy(by: ColumnsOrExpr, opts: { maintainOrder: boolean }): LazyGroupBy;

    /**
     * Gets the first `n` rows of the DataFrame. You probably don't want to use this!
     *
     * Consider using the `fetch` operation.
     * The `fetch` operation will truly load the first `n`rows lazily.
     */
    head(length?: number): LazyDataFrame;
    /**
     *  __SQL like joins.__
     * @param df - DataFrame to join with.
     * @param options
     * @param options.leftOn - Name(s) of the left join column(s).
     * @param options.rightOn - Name(s) of the right join column(s).
     * @param options.on - Name(s) of the join columns in both DataFrames.
     * @param options.how - Join strategy
     * @param options.suffix - Suffix to append to columns with a duplicate name.
     * @param options.allowParallel - Allow the physical plan to optionally evaluate the computation of both DataFrames up to the join in parallel.
     * @param options.forceParallel - Force the physical plan to evaluate the computation of both DataFrames up to the join in parallel.
     * @see {@link LazyJoinOptions}
     * @example
     * ```
     * >>> const df = pl.DataFrame({
     * >>>     foo: [1, 2, 3],
     * >>>     bar: [6.0, 7.0, 8.0],
     * >>>     ham: ['a', 'b', 'c'],
     * >>>   }).lazy()
     * >>>
     * >>> const otherDF = pl.DataFrame({
     * >>>     apple: ['x', 'y', 'z'],
     * >>>     ham: ['a', 'b', 'd'],
     * >>>   }).lazy();
     * >>> const result = await df.join(otherDF, { on: 'ham', how: 'inner' }).collect();
     * shape: (2, 4)
     * ╭─────┬─────┬─────┬───────╮
     * │ foo ┆ bar ┆ ham ┆ apple │
     * │ --- ┆ --- ┆ --- ┆ ---   │
     * │ i64 ┆ f64 ┆ str ┆ str   │
     * ╞═════╪═════╪═════╪═══════╡
     * │ 1   ┆ 6   ┆ "a" ┆ "x"   │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌┤
     * │ 2   ┆ 7   ┆ "b" ┆ "y"   │
     * ╰─────┴─────┴─────┴───────╯
     * ```
     */
    join(
        other: LazyDataFrame,
        joinOptions: { on: ValueOrArray<string | Expr> } & LazyJoinOptions,
    ): LazyDataFrame;
    join(
        other: LazyDataFrame,
        joinOptions: {
            leftOn: ValueOrArray<string | Expr>;
            rightOn: ValueOrArray<string | Expr>;
        } & LazyJoinOptions,
    ): LazyDataFrame;
    join(
        other: LazyDataFrame,
        options: {
            how: "cross";
            suffix?: string;
            allowParallel?: boolean;
            forceParallel?: boolean;
        },
    ): LazyDataFrame;

    /**
       * Perform an asof join. This is similar to a left-join except that we
       * match on nearest key rather than equal keys.
       *
       * Both DataFrames must be sorted by the asof_join key.
       *
        For each row in the left DataFrame:
  
          - A "backward" search selects the last row in the right DataFrame whose
            'on' key is less than or equal to the left's key.
  
          - A "forward" search selects the first row in the right DataFrame whose
            'on' key is greater than or equal to the left's key.
  
        The default is "backward".
  
        Parameters
        ----------
        @param other DataFrame to join with.
        @param options.leftOn Join column of the left DataFrame.
        @param options.rightOn Join column of the right DataFrame.
        @param options.on Join column of both DataFrames. If set, `leftOn` and `rightOn` should be undefined.
        @param options.byLeft join on these columns before doing asof join
        @param options.byRight join on these columns before doing asof join
        @param options.strategy One of {'forward', 'backward'}
        @param options.suffix Suffix to append to columns with a duplicate name.
        @param options.tolerance
          Numeric tolerance. By setting this the join will only be done if the near keys are within this distance.
          If an asof join is done on columns of dtype "Date", "Datetime" you
          use the following string language:
  
          - 1ns   *(1 nanosecond)*
          - 1us   *(1 microsecond)*
          - 1ms   *(1 millisecond)*
          - 1s    *(1 second)*
          - 1m    *(1 minute)*
          - 1h    *(1 hour)*
          - 1d    *(1 day)*
          - 1w    *(1 week)*
          - 1mo   *(1 calendar month)*
          - 1y    *(1 calendar year)*
          - 1i    *(1 index count)*
  
        Or combine them:
          - "3d12h4m25s" # 3 days, 12 hours, 4 minutes, and 25 seconds
        @param options.allowParallel Allow the physical plan to optionally evaluate the computation of both DataFrames up to the join in parallel.
        @param options.forceParallel Force the physical plan to evaluate the computation of both DataFrames up to the join in parallel.
  
  
        @example
        ```
        >const gdp = pl.DataFrame({
        ...   date: [
        ...     new Date('2016-01-01'),
        ...     new Date('2017-01-01'),
        ...     new Date('2018-01-01'),
        ...     new Date('2019-01-01'),
        ...   ],  // note record date: Jan 1st (sorted!)
        ...   gdp: [4164, 4411, 4566, 4696],
        ... })
        >const population = pl.DataFrame({
        ...   date: [
        ...     new Date('2016-05-12'),
        ...     new Date('2017-05-12'),
        ...     new Date('2018-05-12'),
        ...     new Date('2019-05-12'),
        ...   ],  // note record date: May 12th (sorted!)
        ...   "population": [82.19, 82.66, 83.12, 83.52],
        ... })
        >population.joinAsof(
        ...   gdp,
        ...   {leftOn:"date", rightOn:"date", strategy:"backward"}
        ... )
          shape: (4, 3)
          ┌─────────────────────┬────────────┬──────┐
          │ date                ┆ population ┆ gdp  │
          │ ---                 ┆ ---        ┆ ---  │
          │ datetime[μs]        ┆ f64        ┆ i64  │
          ╞═════════════════════╪════════════╪══════╡
          │ 2016-05-12 00:00:00 ┆ 82.19      ┆ 4164 │
          ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┤
          │ 2017-05-12 00:00:00 ┆ 82.66      ┆ 4411 │
          ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┤
          │ 2018-05-12 00:00:00 ┆ 83.12      ┆ 4566 │
          ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌┤
          │ 2019-05-12 00:00:00 ┆ 83.52      ┆ 4696 │
          └─────────────────────┴────────────┴──────┘
        ```
       */
    joinAsof(
        other: LazyDataFrame,
        options: {
            leftOn?: string;
            rightOn?: string;
            on?: string;
            byLeft?: string | string[];
            byRight?: string | string[];
            by?: string | string[];
            strategy?: "backward" | "forward";
            suffix?: string;
            tolerance?: number | string;
            allowParallel?: boolean;
            forceParallel?: boolean;
        },
    ): LazyDataFrame;
    /**
     * Get the last row of the DataFrame.
     */
    last(): LazyDataFrame;
    /**
     * @see {@link head}
     */
    limit(n?: number): LazyDataFrame;
    /**
     * @see {@link DataFrame.max}
     */
    max(): LazyDataFrame;
    /**
     * @see {@link DataFrame.mean}
     */
    mean(): LazyDataFrame;
    /**
     * @see {@link DataFrame.median}
     */
    median(): LazyDataFrame;
    /**
     * @see {@link DataFrame.melt}
     */
    melt(idVars: ColumnSelection, valueVars: ColumnSelection): LazyDataFrame;
    /**
     * @see {@link DataFrame.min}
     */
    min(): LazyDataFrame;
    /**
     * @see {@link DataFrame.quantile}
     */
    quantile(quantile: number): LazyDataFrame;
    /**
     * @see {@link DataFrame.rename}
     */
    rename(mapping: Record<string, string>);
    /**
     * Reverse the DataFrame.
     */
    reverse();
    /**
     * @see {@link DataFrame.select}
     */
    select(column: ExprOrString): LazyDataFrame;
    select(columns: ExprOrString[]): LazyDataFrame;
    select(...columns: ExprOrString[]): LazyDataFrame;
    /**
     * @see {@link DataFrame.shift}
     */
    shift(periods: number): LazyDataFrame;
    shift(opts: { periods: number }): LazyDataFrame;
    /**
     * @see {@link DataFrame.shiftAndFill}
     */
    shiftAndFill(
        periods: number,
        fillValue: number | string | Expr,
    ): LazyDataFrame;
    shiftAndFill(opts: {
        periods: number;
        fillValue: number | string | Expr;
    }): LazyDataFrame;
    /**
     * @see {@link DataFrame.slice}
     */
    slice(offset: number, length: number): LazyDataFrame;
    slice(opts: { offset: number; length: number }): LazyDataFrame;
    /**
     * @see {@link DataFrame.sort}
     */
    sort(
        by: ColumnsOrExpr,
        descending?: ValueOrArray<boolean>,
        maintain_order?: boolean,
    ): LazyDataFrame;
    sort(opts: {
        by: ColumnsOrExpr;
        descending?: ValueOrArray<boolean>;
        maintain_order?: boolean;
    }): LazyDataFrame;
    /**
     * @see {@link DataFrame.std}
     */
    std(): LazyDataFrame;
    /**
     * Aggregate the columns in the DataFrame to their sum value.
     */
    sum(): LazyDataFrame;
    /**
     * Get the last `n` rows of the DataFrame.
     * @see {@link DataFrame.tail}
     */
    tail(length?: number): LazyDataFrame;
    /**
     * compatibility with `JSON.stringify`
     */
    toJSON(): String;
    /**
     * Drop duplicate rows from this DataFrame.
     * Note that this fails if there is a column of type `List` in the DataFrame.
     * @param maintainOrder
     * @param subset - subset to drop duplicates for
     * @param keep "first" | "last"
     */
    unique(
        maintainOrder?: boolean,
        subset?: ColumnSelection,
        keep?: "first" | "last",
    ): LazyDataFrame;
    unique(opts: {
        maintainOrder?: boolean;
        subset?: ColumnSelection;
        keep?: "first" | "last";
    }): LazyDataFrame;
    /**
     * Aggregate the columns in the DataFrame to their variance value.
     */
    var(): LazyDataFrame;
    /**
     * Add or overwrite column in a DataFrame.
     * @param expr - Expression that evaluates to column.
     */
    withColumn(expr: Expr): LazyDataFrame;
    /**
     * Add or overwrite multiple columns in a DataFrame.
     * @param exprs - List of Expressions that evaluate to columns.
     *
     */
    withColumns(exprs: (Expr | Series)[]): LazyDataFrame;
    withColumns(...exprs: (Expr | Series)[]): LazyDataFrame;
    withColumnRenamed(existing: string, replacement: string): LazyDataFrame;
    /**
     * Add a column at index 0 that counts the rows.
     * @see {@link DataFrame.withRowCount}
     */
    withRowCount();
}
