import { INSPECT_SYMBOL } from "nodejs-polars/internals";

export type PivotOps = Pick<GroupBy, "count" | "first" | "max" | "mean" | "median" | "min" | "sum"> & { [INSPECT_SYMBOL](): string };
