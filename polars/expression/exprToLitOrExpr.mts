import { pli } from 'nodejs-polars/internals';
import { isSeries, } from 'nodejs-polars/series';
import {
    ExprClass,
    isExpr,
} from './index.mjs';


/** @ignore */
export const exprToLitOrExpr = ( expr:unknown, stringToLit = true ): ExprClass => {

    if( typeof expr === "string" && !stringToLit ) {
    
        return new ExprClass(pli.col(expr));
    }
    else if (isExpr(expr)) {
    
        return expr;
    }
    else if( isSeries(expr) ) {
    
        return new ExprClass(pli.lit((expr as any)._s));
    }
    else {
    
        return new ExprClass(pli.lit(expr));
    }

};

