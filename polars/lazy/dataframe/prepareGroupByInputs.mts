import { pli } from 'nodejs-polars/internals';
import { isExpr } from 'nodejs-polars/lazy/expr';


export const prepareGroupbyInputs = ( by: unknown ):unknown[] => {

  if (Array.isArray(by)) {

    const newBy: any = [];
    by.forEach((e) => {
      if (typeof e === "string") {
        e = pli.col(e);
      }
      newBy.push(e);
    });
  
    return newBy;
  } else if (typeof by === "string") {
    return [pli.col(by)];
  } else if (isExpr(by)) {
    return [by._expr];
  } else {
    return [];
  }
};
