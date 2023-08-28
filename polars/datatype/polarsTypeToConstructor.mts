import {
    type DataType,
    POLARS_TYPE_TO_CONSTRUCTOR,
} from './index.mjs';


/** @ignore */
export const polarsTypeToConstructor = (dtype: DataType): CallableFunction => {
    const ctor = POLARS_TYPE_TO_CONSTRUCTOR[dtype.variant];
    if (!ctor) {
        throw new Error(`Cannot construct Series for type ${dtype.variant}.`);
    }
    return ctor;
};
