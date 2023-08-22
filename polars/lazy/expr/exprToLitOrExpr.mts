import { pli } from 'nodejs-polars/internals';

import {
    type Expr,
    _Expr,
    isExpr,
} from './index.mjs';

import {
    isSeries
} from 'nodejs-polars/series';



/** @ignore */
export const exprToLitOrExpr = ( expr: any, stringToLit = true ): Expr => {

    if (typeof expr === "string" && !stringToLit) {
        return _Expr(pli.col(expr));
    } else if (isExpr(expr)) {
        return expr;
    } else if (isSeries(expr)) {
        return _Expr(pli.lit((expr as any)._s));
    } else {
        return _Expr(pli.lit(expr));
    }
};
