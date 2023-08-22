import {
    type IThen,
    type Expr,
    ChainedWhen,
} from './typings.mjs';

function Then(_then: any): IThen {
    return {
        when: ({ _expr }: Expr): ChainedWhen => ChainedWhen(_then.when(_expr)),
        otherwise: ({ _expr }: Expr): Expr => (Expr as any)(_then.otherwise(_expr)),
    };
}
