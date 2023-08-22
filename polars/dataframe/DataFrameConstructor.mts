import {
    _DataFrame
} from './_DataFrame.mjs';

export function DataFrameConstructor(data?, options?): DataFrame {
    if (!data) {
        return _DataFrame(objToDF({}));
    }

    if (Array.isArray(data)) {
      return _DataFrame(arrayToJsDataFrame(data, options));
    }

    return _DataFrame(objToDF(data as any));
}
