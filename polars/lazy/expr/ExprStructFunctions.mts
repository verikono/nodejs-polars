import {
    type ExprStruct,
} from './index.mjs';

export const ExprStructFunctions = (_expr: any): ExprStruct => {
    return {
        field(name) {
            return _Expr(_expr.structFieldByName(name));
        },
        renameFields(names) {
            return _Expr(_expr.structRenameFields(names));
        },
    };
};
