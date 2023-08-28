import {
    type Expr,
} from 'nodejs-polars/lazy/expr';

import {
    type LazyDataFrame,
} from 'nodejs-polars/lazy';


/** @ignore */
export const _LazyGroupBy = (_lgb: any): LazyGroupBy => {
    return {
        agg(...aggs: Expr[]) {
            aggs = selectionToExprList(aggs, false);
            const ret = _lgb.agg(aggs.flat());

            return _LazyDataFrame(ret);
        },
        head(n = 5) {
            return _LazyDataFrame(_lgb.head(n));
        },
        tail(n = 5) {
            return _LazyDataFrame(_lgb.tail(n));
        },
    };
};

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
