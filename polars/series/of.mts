import {
    Series
} from './index.mjs';

export const of = (...values: any[]): Series => Series.from(values);
