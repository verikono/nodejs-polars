export abstract class AbstractDataFrame {


    /**
    * __Summary statistics for a DataFrame.__
    *
    * Only summarizes numeric datatypes at the moment and returns nulls for non numeric datatypes.
    * ___
    * Example
    * ```
    * >  df = pl.DataFrame({
    * ...      'a': [1.0, 2.8, 3.0],
    * ...      'b': [4, 5, 6],
    * ...      "c": [True, False, True]
    * ...      })
    * ...  df.describe()
    * shape: (5, 4)
    * ╭──────────┬───────┬─────┬──────╮
    * │ describe ┆ a     ┆ b   ┆ c    │
    * │ ---      ┆ ---   ┆ --- ┆ ---  │
    * │ str      ┆ f64   ┆ f64 ┆ f64  │
    * ╞══════════╪═══════╪═════╪══════╡
    * │ "mean"   ┆ 2.267 ┆ 5   ┆ null │
    * ├╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┤
    * │ "std"    ┆ 1.102 ┆ 1   ┆ null │
    * ├╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┤
    * │ "min"    ┆ 1     ┆ 4   ┆ 0.0  │
    * ├╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┤
    * │ "max"    ┆ 3     ┆ 6   ┆ 1    │
    * ├╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌┼╌╌╌╌╌╌┤
    * │ "median" ┆ 2.8   ┆ 5   ┆ null │
    * ╰──────────┴───────┴─────┴──────╯
    * ```
    */
    abstract describe(): AbstractDataFrame;


}
