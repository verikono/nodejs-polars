import { DataFrame, _DataFrame } from "./dataframe";
import * as utils from "./utils";
import util from "util";
import { Expr } from "./lazy/expr";
import { col, exclude } from "./lazy/functions";
import { ColumnsOrExpr } from "./utils";

const inspect = Symbol.for("nodejs.util.inspect.custom");
const inspectOpts = { colors: true, depth: null };






function PivotOps(
  df: any,
  by: string | string[],
  pivotCol: string,
  valueCol: string,
): PivotOps {
  const pivot = (agg) => () =>
    _DataFrame(df.pivot([by].flat(), [pivotCol], [valueCol], agg));
  const customInspect = () =>
    util.formatWithOptions(inspectOpts, "PivotOps {by: %O}", by);

  return {
    [inspect]: customInspect,
    first: pivot("first"),
    sum: pivot("sum"),
    min: pivot("min"),
    max: pivot("max"),
    mean: pivot("mean"),
    count: pivot("count"),
    median: pivot("median"),
  };
}



/** @ignore */
export function RollingGroupBy(
  df: any,
  indexColumn: ColumnsOrExpr,
  period: string,
  offset?: string,
  closed?,
  by?: ColumnsOrExpr,
  check_sorted?: boolean,
): RollingGroupBy {
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
/**
 * intermediate state of a dynamic groupby
 */
export interface DynamicGroupBy {
  agg(column: ColumnsOrExpr, ...columns: ColumnsOrExpr[]): DataFrame;
}

/** @ignore */
export function DynamicGroupBy(
  df: any,
  indexColumn: string,
  every: string,
  period?: string,
  offset?: string,
  truncate?: boolean,
  includeBoundaries?: boolean,
  closed?: string,
  by?: ColumnsOrExpr,
): DynamicGroupBy {
  return {
    agg(column: ColumnsOrExpr, ...columns: ColumnsOrExpr[]) {
      return df
        .lazy()
        .groupByDynamic({
          indexColumn,
          every,
          period,
          offset,
          truncate,
          includeBoundaries,
          closed,
          by,
        } as any)
        .agg(column as any, ...columns)
        .collectSync({ noOptimizations: true });
    },
  };
}
