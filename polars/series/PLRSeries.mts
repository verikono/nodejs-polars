import {
    type Round,
    type Rolling,
    type Arithmetic,
    type Comparison,
    type Cumulative,
    type Sample,
    type Serialize,
} from 'nodejs-polars/types/traits';

import {
    type RollingOptions,
    type RollingQuantileOptions,
    type RollingSkewOptions,
} from 'nodejs-polars/types/options';



export class PLRSeries implements ArrayLike<any>, Rolling<PLRSeries>, Arithmetic<PLRSeries>, Comparison<PLRSeries>, Cumulative<PLRSeries>, Round<PLRSeries>, Sample<PLRSeries>, Serialize {

    readonly [n: number]: any;
    length: number;

    constructor( p:unknown, v:unknown ) {
        this.length = -1;
    }

    rename( v:string ):this {
        return this;
    }


    inner(): this {
        console.warn('PLRSeries::inner is unimplemented.');
        return this;
    }


    rollingMax(options: RollingOptions): PLRSeries;
    rollingMax(windowSize: number, weights?: number[] | undefined, minPeriods?: number[] | undefined, center?: boolean | undefined): PLRSeries;
    rollingMax(windowSize: unknown, weights?: unknown, minPeriods?: unknown, center?: unknown): PLRSeries {
        throw new Error('Method not implemented.');
    }


    rollingMean(options: RollingOptions): PLRSeries;
    rollingMean(windowSize: number, weights?: number[] | undefined, minPeriods?: number[] | undefined, center?: boolean | undefined): PLRSeries;
    rollingMean(windowSize: unknown, weights?: unknown, minPeriods?: unknown, center?: unknown): PLRSeries {
        throw new Error('Method not implemented.');
    }


    rollingMin(options: RollingOptions): PLRSeries;
    rollingMin(windowSize: number, weights?: number[] | undefined, minPeriods?: number[] | undefined, center?: boolean | undefined): PLRSeries;
    rollingMin(windowSize: unknown, weights?: unknown, minPeriods?: unknown, center?: unknown): PLRSeries {
        throw new Error('Method not implemented.');
    }


    rollingStd(options: RollingOptions): PLRSeries;
    rollingStd(windowSize: number, weights?: number[] | undefined, minPeriods?: number[] | undefined, center?: boolean | undefined): PLRSeries;
    rollingStd(windowSize: unknown, weights?: unknown, minPeriods?: unknown, center?: unknown): PLRSeries {
        throw new Error('Method not implemented.');
    }


    rollingSum(options: RollingOptions): PLRSeries;
    rollingSum(windowSize: number, weights?: number[] | undefined, minPeriods?: number[] | undefined, center?: boolean | undefined): PLRSeries;
    rollingSum(windowSize: unknown, weights?: unknown, minPeriods?: unknown, center?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    rollingVar(options: RollingOptions): PLRSeries;
    rollingVar(windowSize: number, weights?: number[] | undefined, minPeriods?: number[] | undefined, center?: boolean | undefined): PLRSeries;
    rollingVar(windowSize: unknown, weights?: unknown, minPeriods?: unknown, center?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }



    rollingMedian(options: RollingOptions): PLRSeries;
    rollingMedian(windowSize: number, weights?: number[] | undefined, minPeriods?: number[] | undefined, center?: boolean | undefined): PLRSeries;
    rollingMedian(windowSize: unknown, weights?: unknown, minPeriods?: unknown, center?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    rollingQuantile(options: RollingQuantileOptions): PLRSeries;
    rollingQuantile(quantile: number, interpolation?: any, windowSize?: number | undefined, weights?: number[] | undefined, minPeriods?: number[] | undefined, center?: boolean | undefined, by?: String | undefined, closed?: any): PLRSeries;
    rollingQuantile(quantile: unknown, interpolation?: unknown, windowSize?: unknown, weights?: unknown, minPeriods?: unknown, center?: unknown, by?: unknown, closed?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    rollingSkew(windowSize: number, bias?: boolean | undefined): PLRSeries;
    rollingSkew(options: RollingSkewOptions): PLRSeries;
    rollingSkew(windowSize: unknown, bias?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    add( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    sub( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    div( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    mul( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    rem( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    plus( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    minus( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    divideBy( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    multiplyBy( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    modulo( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    eq( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    equals( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    gtEq( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    greaterThanEquals( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    gt( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    greaterThan( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    ltEq( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    lessThanEquals( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    lt( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    lessThan( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    neq( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    notEquals( other: any ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    cumCount(reverse?: boolean | undefined): PLRSeries;
    cumCount({ reverse }: { reverse: boolean; }): PLRSeries;
    cumCount(__0?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    cumMax(reverse?: boolean | undefined): PLRSeries;
    cumMax({ reverse }: { reverse: boolean; }): PLRSeries;
    cumMax(__0?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    cumMin(reverse?: boolean | undefined): PLRSeries;
    cumMin({ reverse }: { reverse: boolean; }): PLRSeries;
    cumMin(__0?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    cumProd(reverse?: boolean | undefined): PLRSeries;
    cumProd({ reverse }: { reverse: boolean; }): PLRSeries;
    cumProd(__0?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    cumSum(reverse?: boolean | undefined): PLRSeries;
    cumSum({ reverse }: { reverse: boolean; }): PLRSeries;
    cumSum(__0?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    round(decimals: number): PLRSeries;
    round(options: { decimals: number; }): PLRSeries;
    round(options: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    floor( ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    ceil( ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    clip(min: number, max: number): PLRSeries;
    clip(options: { min: number; max: number; });
    clip(min: unknown, max?: unknown): any {
        throw new Error('Method not implemented.');
    }


    sample(opts?: { n: number; withReplacement?: boolean | undefined; seed?: number | bigint | undefined; } | undefined): PLRSeries;
    sample(opts?: { frac: number; withReplacement?: boolean | undefined; seed?: number | bigint | undefined; } | undefined): PLRSeries;
    sample(n?: number | undefined, frac?: number | undefined, withReplacement?: boolean | undefined, seed?: number | bigint | undefined): PLRSeries;
    sample(n?: unknown, frac?: unknown, withReplacement?: unknown, seed?: unknown ):PLRSeries {
        throw new Error('Method not implemented.');
    }


    serialize(format: 'json' | 'bincode'): Buffer {
        throw new Error('Method not implemented.');
    }

}
