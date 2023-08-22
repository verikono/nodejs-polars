import {
  type Expr,
  isExpr,
} from 'nodejs-polars/lazy/expr';



export const isExprArray = (ty: any): ty is Expr[] => Array.isArray(ty) && isExpr(ty[0]);

