import {
    type Expr,
    ChainedThen,
} from './index.mjs';



export function ChainedWhen(_chainedwhen: any): ChainedWhen {
    return {
        then: ({ _expr }: Expr): ChainedThen => ChainedThen(_chainedwhen.then(_expr)),
    };
}
