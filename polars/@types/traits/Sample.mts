export interface Sample<T> {

    /**
     * Sample from this DataFrame by setting either `n` or `frac`.
     * @param n - Number of samples < self.len() .
     * @param frac - Fraction between 0.0 and 1.0 .
     * @param withReplacement - Sample with replacement.
     * @param seed - Seed initialization. If not provided, a random seed will be used
     * @example
     * ```
     * > df = pl.DataFrame({
     * >   "foo": [1, 2, 3],
     * >   "bar": [6, 7, 8],
     * >   "ham": ['a', 'b', 'c']
     * > })
     * > df.sample({n: 2})
     * shape: (2, 3)
     * ╭─────┬─────┬─────╮
     * │ foo ┆ bar ┆ ham │
     * │ --- ┆ --- ┆ --- │
     * │ i64 ┆ i64 ┆ str │
     * ╞═════╪═════╪═════╡
     * │ 1   ┆ 6   ┆ "a" │
     * ├╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌┤
     * │ 3   ┆ 8   ┆ "c" │
     * ╰─────┴─────┴─────╯
     * ```
     * @category Math
     */
    sample(opts?: {
        n: number;
        withReplacement?: boolean;
        seed?: number | bigint;
    }): T;
    sample(opts?: {
        frac: number;
        withReplacement?: boolean;
        seed?: number | bigint;
    }): T;
    sample(
        n?: number,
        frac?: number,
        withReplacement?: boolean,
        seed?: number | bigint,
    ): T;

}
