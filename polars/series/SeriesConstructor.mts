import {
    _Series,
    arrayToJsSeries,
} from './index.mjs';



export const SeriesConstructor = function ( arg0: any, arg1?: any, dtype?: any, strict?: any ): Series {

    if (typeof arg0 === "string") {
        const _s = arrayToJsSeries(arg0, arg1, dtype, strict);
        return _Series(_s) as any;
    }

    return SeriesConstructor("", arg0);
};
