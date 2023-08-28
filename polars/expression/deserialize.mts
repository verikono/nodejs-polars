import { pli } from 'nodejs-polars/internals';

import {
  Expression,
} from 'nodejs-polars/expression';



export function deserialize( buff: Buffer, format:'bincode' | 'json' ):Expression {
  return new Expression(pli.JsExpr.deserialize(buff, format));
}





if(import.meta.vitest) {

  const {
    describe,
    test,
    expect,
  } = import.meta.vitest;

  const buff = Buffer.from('a,b,c\n1,2,3', 'utf-8');

  describe("nodejs-polars/expr.deserialize", () => {
    
    test("deserialize is a function", () => expect(deserialize).toBeTypeOf('function'));
    test("deserialize returns an Expression isntance", () => expect(deserialize(buff, 'json')).toBeInstanceOf(Expression));


  });

}
