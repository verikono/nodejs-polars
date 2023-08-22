import { JsSeries } from './index.mjs';

export const fromTypedArray = (name, value) => {
    switch (value.constructor.name) {
        case Int8Array.name:
            return pli.JsSeries.newInt8Array(name, value);
        case Int16Array.name:
            return pli.JsSeries.newInt16Array(name, value);
        case Int32Array.name:
            return pli.JsSeries.newInt32Array(name, value);
        case BigInt64Array.name:
            return pli.JsSeries.newBigint64Array(name, value);
        case Uint8Array.name:
            return pli.JsSeries.newUint8Array(name, value);
        case Uint8ClampedArray.name:
            return pli.JsSeries.newUint8ClampedArray(name, value);
        case Uint16Array.name:
            return pli.JsSeries.newUint16Array(name, value);
        case Uint32Array.name:
            return pli.JsSeries.newUint32Array(name, value);
        case BigUint64Array.name:
            return pli.JsSeries.newBiguint64Array(name, value);
        case Float32Array.name:
            return pli.JsSeries.newFloat32Array(name, value);
        case Float64Array.name:
            return pli.JsSeries.newFloat64Array(name, value);
        default:
            throw new Error(`unknown  typed array type: ${value.constructor.name}`);
    }
};
