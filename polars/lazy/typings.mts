import {
    type Expr,
} from './expr/typings.mjs';


export interface IChainedWhen {

    /** Values to return in case of the predicate being `true`. */
    then(expr: Expr): IChainedThen;
}


export interface IChainedThen {

    /** Start another when, then, otherwise layer. */
    when(predicate: Expr): IChainedWhen;

    /** Values to return in case of the predicate being `true`. */
    then(expr: Expr): IChainedThen;

    /** Values to return in case of the predicate being `false`. */
    otherwise(expr: Expr): Expr;

}


export interface IWhen {

    /** Values to return in case of the predicate being `true`.*/
    then(expr: Expr): IThen;
}
  

export interface IThen {

    /** Start another when, then, otherwise layer. */
    when(predicate: Expr): IChainedWhen;

    /** Values to return in case of the predicate being `false`. */
    otherwise(expr: Expr): Expr;

}


export type * from './expr/typings.mjs';
