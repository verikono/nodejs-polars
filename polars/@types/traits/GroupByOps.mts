import {
    type ColumnsOrExpr,
    type StartBy,
} from 'nodejs-polars/types';

/**
 * GroupBy operations that can be applied to a DataFrame or LazyFrame.
 */
export interface GroupByOps<T> {
    /**
      Create rolling groups based on a time column (or index value of type Int32, Int64).
  
      Different from a rolling groupby the windows are now determined by the individual values and are not of constant
      intervals. For constant intervals use {@link groupByDynamic}
  
      The `period` and `offset` arguments are created with
      the following string language:
  
      - 1ns   (1 nanosecond)
      - 1us   (1 microsecond)
      - 1ms   (1 millisecond)
      - 1s    (1 second)
      - 1m    (1 minute)
      - 1h    (1 hour)
      - 1d    (1 day)
      - 1w    (1 week)
      - 1mo   (1 calendar month)
      - 1y    (1 calendar year)
      - 1i    (1 index count)
  
      Or combine them:
      "3d12h4m25s" # 3 days, 12 hours, 4 minutes, and 25 seconds
  
      In case of a groupby_rolling on an integer column, the windows are defined by:
  
      - "1i"      # length 1
      - "10i"     # length 10
  
  
      @param indexColumn Column used to group based on the time window.
      Often to type Date/Datetime
      This column must be sorted in ascending order. If not the output will not make sense.
  
      In case of a rolling groupby on indices, dtype needs to be one of {Int32, Int64}. Note that
      Int32 gets temporarily cast to Int64, so if performance matters use an Int64 column.
      @param period length of the window
      @param offset offset of the window. Default is `-period`
      @param closed Defines if the window interval is closed or not.
      @param check_sorted
              When the ``by`` argument is given, polars can not check sortedness
              by the metadata and has to do a full scan on the index column to
              verify data is sorted. This is expensive. If you are sure the
              data within the by groups is sorted, you can set this to ``False``.
              Doing so incorrectly will lead to incorrect output
  
      Any of `{"left", "right", "both" "none"}`
      @param by Also group by this column/these columns
  
      @example
      ```
  
      >dates = [
      ...     "2020-01-01 13:45:48",
      ...     "2020-01-01 16:42:13",
      ...     "2020-01-01 16:45:09",
      ...     "2020-01-02 18:12:48",
      ...     "2020-01-03 19:45:32",
      ...     "2020-01-08 23:16:43",
      ... ]
      >df = pl.DataFrame({"dt": dates, "a": [3, 7, 5, 9, 2, 1]}).withColumn(
      ...     pl.col("dt").str.strptime(pl.Datetime)
      ... )
      >out = df.groupbyRolling({indexColumn:"dt", period:"2d"}).agg(
      ...     [
      ...         pl.sum("a").alias("sum_a"),
      ...         pl.min("a").alias("min_a"),
      ...         pl.max("a").alias("max_a"),
      ...     ]
      ... )
      >assert(out["sum_a"].toArray() === [3, 10, 15, 24, 11, 1])
      >assert(out["max_a"].toArray() === [3, 7, 7, 9, 9, 1])
      >assert(out["min_a"].toArray() === [3, 3, 3, 3, 2, 1])
      >out
      shape: (6, 4)
      ┌─────────────────────┬───────┬───────┬───────┐
      │ dt                  ┆ a_sum ┆ a_max ┆ a_min │
      │ ---                 ┆ ---   ┆ ---   ┆ ---   │
      │ datetime[ms]        ┆ i64   ┆ i64   ┆ i64   │
      ╞═════════════════════╪═══════╪═══════╪═══════╡
      │ 2020-01-01 13:45:48 ┆ 3     ┆ 3     ┆ 3     │
      ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
      │ 2020-01-01 16:42:13 ┆ 10    ┆ 7     ┆ 3     │
      ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
      │ 2020-01-01 16:45:09 ┆ 15    ┆ 7     ┆ 3     │
      ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
      │ 2020-01-02 18:12:48 ┆ 24    ┆ 9     ┆ 3     │
      ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
      │ 2020-01-03 19:45:32 ┆ 11    ┆ 9     ┆ 2     │
      ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌┤
      │ 2020-01-08 23:16:43 ┆ 1     ┆ 1     ┆ 1     │
      └─────────────────────┴───────┴───────┴───────┘
      ```
     */
    groupByRolling(opts: {
        indexColumn: ColumnsOrExpr;
        by?: ColumnsOrExpr;
        period: string;
        offset?: string;
        closed?: "left" | "right" | "both" | "none";
        check_sorted?: boolean;
    }): T;

    /**
    Groups based on a time value (or index value of type Int32, Int64). Time windows are calculated and rows are assigned to windows.
    Different from a normal groupby is that a row can be member of multiple groups. The time/index window could
    be seen as a rolling window, with a window size determined by dates/times/values instead of slots in the DataFrame.
  
  
    A window is defined by:
    - every: interval of the window
    - period: length of the window
    - offset: offset of the window
  
    The `every`, `period` and `offset` arguments are created with
    the following string language:
  
    - 1ns   (1 nanosecond)
    - 1us   (1 microsecond)
    - 1ms   (1 millisecond)
    - 1s    (1 second)
    - 1m    (1 minute)
    - 1h    (1 hour)
    - 1d    (1 day)
    - 1w    (1 week)
    - 1mo   (1 calendar month)
    - 1y    (1 calendar year)
    - 1i    (1 index count)
  
    Or combine them:
    "3d12h4m25s" # 3 days, 12 hours, 4 minutes, and 25 seconds
  
    In case of a groupbyDynamic on an integer column, the windows are defined by:
  
    - "1i"      # length 1
    - "10i"     # length 10
  
    Parameters
    ----------
    @param index_column Column used to group based on the time window.
        Often to type Date/Datetime
        This column must be sorted in ascending order. If not the output will not make sense.
  
        In case of a dynamic groupby on indices, dtype needs to be one of {Int32, Int64}. Note that
        Int32 gets temporarily cast to Int64, so if performance matters use an Int64 column.
    @param every interval of the window
    @param period length of the window, if None it is equal to 'every'
    @param offset offset of the window if None and period is None it will be equal to negative `every`
    @param truncate truncate the time value to the window lower bound
    @param includeBoundaries add the lower and upper bound of the window to the "_lower_bound" and "_upper_bound" columns. This will impact performance because it's harder to parallelize
    @param closed Defines if the window interval is closed or not.
        Any of {"left", "right", "both" "none"}
    @param check_sorted
        When the ``by`` argument is given, polars can not check sortedness
        by the metadata and has to do a full scan on the index column to
        verify data is sorted. This is expensive. If you are sure the
        data within the by groups is sorted, you can set this to ``False``.
        Doing so incorrectly will lead to incorrect output
    @param by Also group by this column/these columns
   */
    groupByDynamic(options: {
        indexColumn: string;
        every: string;
        period?: string;
        offset?: string;
        truncate?: boolean;
        includeBoundaries?: boolean;
        closed?: "left" | "right" | "both" | "none";
        by?: ColumnsOrExpr;
        start_by: StartBy;
        check_sorted?: boolean;
    }): T;
}
