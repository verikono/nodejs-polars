import { formatWithOptions } from 'node:util';

import {
    type DataFrame,
    _DataFrame,
} from 'nodejs-polars/dataframe';

import {
    isExprArray,
} from 'nodejs-polars/utils';



/** @ignore */
export function _GroupBy(df: any, by: string[], maintainOrder = false) {

    const customInspect = () => formatWithOptions(inspectOpts, "GroupBy {by: %O}", by);
  
    const pivot = (
      opts: { pivotCol: string; valuesCol: string } | string,
      valuesCol?: string,
    ): PivotOps => {
      if (typeof opts === "string") {
        if (valuesCol) {
          return pivot({ pivotCol: opts, valuesCol });
        } else {
          throw new Error("must specify both pivotCol and valuesCol");
        }
      }
  
      return PivotOps(df, by, opts.pivotCol, opts.valuesCol);
    };
  
    const agg = (...aggs): DataFrame => {

        if (utils.isExprArray(aggs)) {
        aggs = [aggs].flat(2);
  
        return _DataFrame(df).lazy()
          .groupBy(by, maintainOrder)
          .agg(...aggs)
          .collectSync({ noOptimization: true });

    } else {
        const pairs = Object.entries(aggs[0]).flatMap(([key, values]) => {
          return [values].flat(2).map((v) => col(key)[v as any]());
        });
  
        return _DataFrame(df)
          .lazy()
          .groupBy(by, maintainOrder)
          .agg(...pairs)
          .collectSync({ noOptimization: true });
      }
    };
  
    return Object.seal({
      [inspect]: customInspect,
      agg,
      pivot,
      aggList: () => agg(exclude(by as any)),
      count() {
        return _DataFrame(df.groupby([by].flat(), null, "count"));
      },
      first: () => agg(exclude(by as any).first()),
      groups() {
        return _DataFrame(df.groupby([by].flat(), null, "groups"));
      },
      head: (n = 5) => agg(exclude(by as any).head(n)),
      last: () => agg(exclude(by as any).last()),
      max: () => agg(exclude(by as any).max()),
      mean: () => agg(exclude(by as any).mean()),
      median: () => agg(exclude(by as any).median()),
      min: () => agg(exclude(by as any).min()),
      nUnique: () => agg(exclude(by as any).nUnique()),
      quantile: (q: number) => agg(exclude(by as any).quantile(q)),
      sum: () => agg(exclude(by as any).sum()),
      tail: (n = 5) => agg(exclude(by as any).tail(n)),
      toString: () => "GroupBy",
    }) as GroupBy;
  }
