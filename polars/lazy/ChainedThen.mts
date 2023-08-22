import {
    type IChainedThen,
    Expr,
    ChainedWhen,
} from './index.mjs';



export function ChainedThen(_chainedthen: any): IChainedThen {
    return {
        when: ({ _expr }: Expr): ChainedWhen =>
        ChainedWhen(_chainedthen.when(_expr)),
        then: ({ _expr }: Expr): IChainedThen =>
        ChainedThen(_chainedthen.then(_expr)),
        otherwise: ({ _expr }: Expr): Expr =>
        (Expr as any)(_chainedthen.otherwise(_expr)),
    };
}
