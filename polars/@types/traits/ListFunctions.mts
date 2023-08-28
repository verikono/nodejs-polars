/**
 * Functions that can be applied to dtype List
 */
export interface ListFunctions<T> {
    argMin(): T;
    argMax(): T;
    /**
     * Concat the arrays in a Series dtype List in linear time.
     * @param other Column(s) to concat into a List Series
     * @example
     * -------
     * ```
     * df = pl.DataFrame({
     *   "a": [["a"], ["x"]],
     *   "b": [["b", "c"], ["y", "z"]],
     * })
     * df.select(pl.col("a").lst.concat("b"))
     * shape: (2, 1)
     * ┌─────────────────┐
     * │ a               │
     * │ ---             │
     * │ list[str]       │
     * ╞═════════════════╡
     * │ ["a", "b", "c"] │
     * ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
     * │ ["x", "y", "z"] │
     * └─────────────────┘
     * ```
     * @category List
     */
    concat(other: (string | T)[] | string | T): T;
    /**
     * Check if sublists contain the given item.
     * @param item Item that will be checked for membership
     * @example
     * --------
     * ```
     * df = pl.DataFrame({"foo": [[3, 2, 1], [], [1, 2]]})
     * df.select(pl.col("foo").lst.contains(1))
     * shape: (3, 1)
     * ┌───────┐
     * │ foo   │
     * │ ---   │
     * │ bool  │
     * ╞═══════╡
     * │ true  │
     * ├╌╌╌╌╌╌╌┤
     * │ false │
     * ├╌╌╌╌╌╌╌┤
     * │ true  │
     * └───────┘
     * ```
     * @category List
     */
    contains(item: any): T;
    /**
     * Calculate the n-th discrete difference of every sublist.
     * @param n number of slots to shift
     * @param nullBehavior 'ignore' | 'drop'
     * ```
     * s = pl.Series("a", [[1, 2, 3, 4], [10, 2, 1]])
     * s.lst.diff()
     *
     * shape: (2,)
     * Series: 'a' [list]
     * [
     *     [null, 1, ... 1]
     *     [null, -8, -1]
     * ]
     * ```
     * @category List
     */
    diff(n?: number, nullBehavior?: "ignore" | "drop"): T;
    /**
     * Get the value by index in the sublists.
     * So index `0` would return the first item of every sublist
     * and index `-1` would return the last item of every sublist
     * if an index is out of bounds, it will return a `null`.
     * @category List
     */
    get(index: number | Expr): T;
    /**
     *  Run any polars expression against the lists' elements
     *  Parameters
     *  ----------
     * @param expr
     *   Expression to run. Note that you can select an element with `pl.first()`, or `pl.col()`
     * @param parallel
     *   Run all expression parallel. Don't activate this blindly.
     *   Parallelism is worth it if there is enough work to do per thread.
     *   This likely should not be use in the groupby context, because we already parallel execution per group
     * @example
     *  >df = pl.DataFrame({"a": [1, 8, 3], "b": [4, 5, 2]})
     *  >df.withColumn(
     *  ...   pl.concatList(["a", "b"]).lst.eval(pl.first().rank()).alias("rank")
     *  ... )
     *  shape: (3, 3)
     *  ┌─────┬─────┬────────────┐
     *  │ a   ┆ b   ┆ rank       │
     *  │ --- ┆ --- ┆ ---        │
     *  │ i64 ┆ i64 ┆ list [f32] │
     *  ╞═════╪═════╪════════════╡
     *  │ 1   ┆ 4   ┆ [1.0, 2.0] │
     *  ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     *  │ 8   ┆ 5   ┆ [2.0, 1.0] │
     *  ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌┤
     *  │ 3   ┆ 2   ┆ [2.0, 1.0] │
     *  └─────┴─────┴────────────┘
     * @category List
     */
    eval(expr: Expr, parallel?: boolean): T;
    /**
     * Get the first value of the sublists.
     * @category List
     */
    first(): T;
    /**
     * Slice the head of every sublist
     * @param n - How many values to take in the slice.
     * @example
     * ```
     * s = pl.Series("a", [[1, 2, 3, 4], [10, 2, 1]])
     * s.lst.head(2)
     * shape: (2,)
     * Series: 'a' [list]
     * [
     *     [1, 2]
     *     [10, 2]
     * ]
     * ```
     * @category List
     */
    head(n: number): T;
    /**
     * Slice the tail of every sublist
     * @param n - How many values to take in the slice.
     * @example
     * ```
     * s = pl.Series("a", [[1, 2, 3, 4], [10, 2, 1]])
     * s.lst.tail(2)
     * shape: (2,)
     * Series: 'a' [list]
     * [
     *     [3, 4]
     *     [2, q]
     * ]
     * ```
     * @category List
     */
    tail(n: number): T;
    /**
     * Join all string items in a sublist and place a separator between them.
     * This errors if inner type of list `!= Utf8`.
     * @param separator A string used to separate one element of the list from the next in the resulting string.
     * If omitted, the list elements are separated with a comma.
     * @category List
     */
    join(separator?: string): T;
    /**
     * Get the last value of the sublists.
     * @category List
     */
    last(): T;
    /**
     * Get the length of the sublists.
     * @category List
     */
    lengths(): T;
    /**
     * Get the maximum value of the sublists.
     * @category List
     */
    max(): T;
    /**
     * Get the mean value of the sublists.
     * @category List
     */
    mean(): T;
    /**
     * Get the median value of the sublists.
     * @category List
     */
    min(): T;
    /**
     * Reverse the sublists.
     * @category List
     */
    reverse(): T;
    /**
     * Shift the sublists.
     * @param periods - Number of periods to shift. Can be positive or negative.
     * @category List
     */
    shift(periods: number): T;
    /**
     * Slice the sublists.
     * @param offset - The offset of the slice.
     * @param length - The length of the slice.
     * @category List
     */
    slice(offset: number, length: number): T;
    /**
     * Sort the sublists.
     * @param reverse - Sort in reverse order.
     * @category List
     */
    sort(reverse?: boolean): T;
    sort(opt: { reverse: boolean }): T;
    /**
     * Sum all elements of the sublists.
     * @category List
     */
    sum(): T;
    /**
     * Get the unique values of the sublists.
     * @category List
     */
    unique(): T;
}
