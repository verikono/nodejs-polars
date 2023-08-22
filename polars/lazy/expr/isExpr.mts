import {
    type Expr,
} from './index.mjs';



export const isExpr = (anyVal: any): anyVal is Expr => {
    try {
        return anyVal?.[Symbol.toStringTag]?.() === "Expr";
    } catch (err) {
        return false;
    }
};
