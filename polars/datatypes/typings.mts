import {
    type TimeUnit,
} from './TimeUnit.mjs';

/** @ignore */
export type TypedArray =
    | Int8Array
    | Int16Array
    | Int32Array
    | BigInt64Array
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | BigInt64Array
    | Float32Array
    | Float64Array;

/**
 *  @ignore
 */
export type Optional<T> = T | undefined | null;

/**
 * @ignore
 */
export type JsDataFrame = any;

export type NullValues = string | Array<string> | Record<string, string>;



/**
 * Datatype namespace
 */
export namespace DataType {
    /** Null */
    export type Null = _Null;
    /** Boolean */
    export type Bool = _Bool;
    /** Int8 */
    export type Int8 = _Int8;
    /** Int16 */
    export type Int16 = _Int16;
    /** Int32 */
    export type Int32 = _Int32;
    /** Int64 */
    export type Int64 = _Int64;
    /** UInt8 */
    export type UInt8 = _UInt8;
    /** UInt16 */
    export type UInt16 = _UInt16;
    /** UInt32 */
    export type UInt32 = _UInt32;
    /** UInt64 */
    export type UInt64 = _UInt64;
    /** Float32 */
    export type Float32 = _Float32;
    /** Float64 */
    export type Float64 = _Float64;
    /** Date dtype */
    export type Date = _Date;
    /** Datetime */
    export type Datetime = _Datetime;
    /** Utf8 */
    export type Utf8 = _Utf8;
    /** Categorical */
    export type Categorical = _Categorical;
    /** List */
    export type List = _List;
    /** Struct */
    export type Struct = _Struct;

    /**
     * deserializes a datatype from the serde output of rust polars `DataType`
     * @param dtype dtype object
     */
    export function deserialize(dtype: any): DataType {
        if (typeof dtype === "string") {
            return DataType[dtype];
        }

        let { variant, inner } = dtype;
        if (variant === "Struct") {
            inner = [
                inner[0].map((fld) => Field.from(fld.name, deserialize(fld.dtype))),
            ];
        }
        if (variant === "List") {
            inner = [deserialize(inner[0])];
        }

        return DataType[variant](...inner);
    }
}


/**
 * A field is a name and a datatype.
 */
export interface Field {
    name: string;
    dtype: DataType;
}
