import {
    type LazyDataFrame,
} from 'nodejs-polars/lazy/dataframe';



/**
 * LazyGroupBy
 * @category lazy
 */
export interface LazyGroupBy {
    /**
     * Aggregate the groupby.
     */
    agg(...aggs: Expr[]): LazyDataFrame;
    /**
     * Return the first n rows of the groupby.
     * @param n number of rows to return
     */
    head(n?: number): LazyDataFrame;
    /**
     * Return the last n rows of the groupby.
     * @param n number of rows to return
     */
    tail(n?: number): LazyDataFrame;
}
