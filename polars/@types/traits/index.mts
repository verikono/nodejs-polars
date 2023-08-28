export type { Arithmetic } from './Arithmetic.mjs';
export type { Comparison } from './Comparison.mjs';
export type { Cumulative } from './Cumulative.mjs';
export type { Rolling } from './Rolling.mjs';
export type { Round } from './Round.mjs';
export type { Sample } from './Sample.mjs';
export type { Deserialize } from './Deserialize.mjs';
export type { Serialize } from './Serialize.mjs';

// Dont Intentionally Create 
import * as PolarTraits from '../traits/index.mjs';


export declare type TraitMap<TC extends object> = {
    Arithmetric:PolarTraits.Arithmetic<TC>;
    Comparison:PolarTraits.Comparison<TC>;
    Cumulative:PolarTraits.Cumulative<TC>;
    Rolling:PolarTraits.Rolling<TC>;
    Round:PolarTraits.Round<TC>;
}

