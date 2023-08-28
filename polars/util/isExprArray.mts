import {
  type Expr,
  isExpr,
} from 'nodejs-polars/lazy/expr';



export const isExprArray = (ty: any): ty is Expr[] => Array.isArray(ty) && isExpr(ty[0]);




if(import.meta.vitest) {

  const {
      describe,
      test,
      expect,
  } = import.meta.vitest;

  describe("nodejs-polars/utils.isExprArray", () => {

      test("", async () => {


      });

  });

}
