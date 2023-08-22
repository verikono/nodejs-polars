import {
    firstNonNull,
    fromTypedArray,
    isTypedArray,
} from './index.mjs';



/**
 * Construct an internal `JsSeries` from an array
 */
export function arrayToJsSeries( name = "", values: any[] = [], dtype?: any, strict = false ): any {
    if (isTypedArray(values)) {
        return fromTypedArray(name, values);
    }

    //Empty sequence defaults to Float64 type
    if (!(values?.length || dtype)) {
        dtype = DataType.Float64;
    }
    const firstValue = firstNonNull(values);
    if (Array.isArray(firstValue) || isTypedArray(firstValue)) {
        const listDtype = jsTypeToPolarsType(firstValue);

        const ctor = polarsTypeToConstructor(DataType.List(listDtype));

        return ctor(name, values, strict, listDtype);
    }

    dtype = dtype ?? jsTypeToPolarsType(firstValue);
    let series: any;
    if (dtype?.variant === "Struct") {
        const df = pli.fromRows(values, null, 1);

        return df.toStruct(name);
    }
    if (firstValue instanceof Date) {
        series = pli.JsSeries.newOptDate(name, values, strict);
    } else {
        const ctor = polarsTypeToConstructor(dtype);
        series = ctor(name, values, strict);
    }
    if (
        [
            "Datetime",
            "Date",
            "Categorical",
            "Int8",
            "Int16",
            "UInt8",
            "UInt16",
            "Float32",
        ].includes(dtype.variant)
    ) {
        series = series.cast(dtype, strict);
    }

    return series;
}
