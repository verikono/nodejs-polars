
/** @ignore */
export type ValueOrArray<T> = T | Array<ValueOrArray<T>>;

/** @ignore */
export type ColumnSelection = ValueOrArray<string>;

/** @ignore */
export type ExpressionSelection = ValueOrArray<Expr>;

/** @ignore */
export type ColumnsOrExpr = ColumnSelection | ExpressionSelection;

/** @ignore */
export type ExprOrString = Expr | string;

export type StartBy = "window" | "datapoint" | "monday";
