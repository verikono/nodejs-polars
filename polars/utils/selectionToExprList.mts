/** @ignore */
export function selectionToExprList(columns: any[], stringToLit?) {
    return [columns]
      .flat(3)
      .map((expr) => exprToLitOrExpr(expr, stringToLit)._expr);
  }
