export const jsTypeToPolarsType = (value: unknown): DataType => {
    if (value === null) {
        return DataType.Float64;
    }
    if (Array.isArray(value)) {
        return jsTypeToPolarsType(firstNonNull(value));
    }
    if (isTypedArray(value)) {
        switch (value.constructor.name) {
            case Int8Array.name:
                return DataType.Int8;
            case Int16Array.name:
                return DataType.Int16;
            case Int32Array.name:
                return DataType.Int32;
            case BigInt64Array.name:
                return DataType.Int64;
            case Uint8Array.name:
                return DataType.UInt8;
            case Uint16Array.name:
                return DataType.UInt16;
            case Uint32Array.name:
                return DataType.UInt32;
            case BigUint64Array.name:
                return DataType.UInt64;
            case Float32Array.name:
                return DataType.Float32;
            case Float64Array.name:
                return DataType.Float64;
            default:
                throw new Error(`unknown  typed array type: ${value.constructor.name}`);
        }
    }

    if (value instanceof Date) {
        return DataType.Datetime(TimeUnit.Milliseconds);
    }
    if (typeof value === "object" && (value as any).constructor === Object) {
        const flds = Object.entries(value as any).map(([name, value]) => {
            const dtype = jsTypeToPolarsType(value);

            return Field.from(name, dtype);
        });

        return DataType.Struct(flds);
    }

    switch (typeof value) {
        case "bigint":
            return DataType.UInt64;
        case "number":
            return DataType.Float64;
        case "string":
            return DataType.Utf8;
        case "boolean":
            return DataType.Bool;
        default:
            return DataType.Float64;
    }
};
