import { type Series } from './index.mjs';

export const isSeries = (anyVal: any): anyVal is Series => {
    try {
        return anyVal?.[Symbol.toStringTag]?.() === "Series";
    } catch (err) {
        return false;
    }
};
