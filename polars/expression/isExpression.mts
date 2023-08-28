import { Expression } from 'nodejs-polars/expression';



export function isExpression( value:unknown ):value is Expression {
    return value instanceof Expression;
}
