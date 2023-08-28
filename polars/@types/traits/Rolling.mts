import {
    type RollingOptions,
    type RollingQuantileOptions,
    type RollingSkewOptions,
} from 'nodejs-polars/types/options';

import {
    type InterpolationMethod,
    type ClosedWindow,
} from 'nodejs-polars/types';




/**
 * __A trait for DataFrame and Series that allows for the application of a rolling window.__
 */
export interface Rolling<T> {
    /**
     * __Apply a rolling max (moving max) over the values in this Series.__
     *
     * A window of length `window_size` will traverse the series. The values that fill this window
     * will (optionally) be multiplied with the weights given by the `weight` vector.
     *
     * The resulting parameters' values will be aggregated into their sum.
     * ___
     * @param windowSize - The length of the window.
     * @param weights - An optional slice with the same length as the window that will be multiplied
     * elementwise with the values in the window.
     * @param minPeriods The number of values in the window that should be non-null before computing a result.
     * If undefined, it will be set equal to window size.
     * @param center - Set the labels at the center of the window
     * @category Rolling
     */
    rollingMax(options: RollingOptions): T;
    rollingMax(
        windowSize: number,
        weights?: Array<number>,
        minPeriods?: Array<number>,
        center?: boolean,
    ): T;
    /**
     * __Apply a rolling mean (moving mean) over the values in this Series.__
     *
     * A window of length `window_size` will traverse the series. The values that fill this window
     * will (optionally) be multiplied with the weights given by the `weight` vector.
     *
     * The resulting parameters' values will be aggregated into their sum.
     * ___
     * @param windowSize - The length of the window.
     * @param weights - An optional slice with the same length as the window that will be multiplied
     * elementwise with the values in the window.
     * @param minPeriods The number of values in the window that should be non-null before computing a result.
     * If undefined, it will be set equal to window size.
     * @param center - Set the labels at the center of the window
     * @category Rolling
     */
    rollingMean(options: RollingOptions): T;
    rollingMean(
        windowSize: number,
        weights?: Array<number>,
        minPeriods?: Array<number>,
        center?: boolean,
    ): T;
    /**
     * __Apply a rolling min (moving min) over the values in this Series.__
     *
     * A window of length `window_size` will traverse the series. The values that fill this window
     * will (optionally) be multiplied with the weights given by the `weight` vector.
     *
     * The resulting parameters' values will be aggregated into their sum.
     * ___
     * @param windowSize - The length of the window.
     * @param weights - An optional slice with the same length as the window that will be multiplied
     * elementwise with the values in the window.
     * @param minPeriods The number of values in the window that should be non-null before computing a result.
     * If undefined, it will be set equal to window size.
     * @param center - Set the labels at the center of the window
     * @category Rolling
     */
    rollingMin(options: RollingOptions): T;
    rollingMin(
        windowSize: number,
        weights?: Array<number>,
        minPeriods?: Array<number>,
        center?: boolean,
    ): T;
    /**
     * Compute a rolling std dev
     *
     * A window of length `window_size` will traverse the array. The values that fill this window
     * will (optionally) be multiplied with the weights given by the `weight` vector. The resulting
     * values will be aggregated to their sum.
     * ___
     * @param windowSize - The length of the window.
     * @param weights - An optional slice with the same length as the window that will be multiplied
     * elementwise with the values in the window.
     * @param minPeriods The number of values in the window that should be non-null before computing a result.
     * If undefined, it will be set equal to window size.
     * @param center - Set the labels at the center of the window
     * @category Rolling
     */
    rollingStd(options: RollingOptions): T;
    rollingStd(
        windowSize: number,
        weights?: Array<number>,
        minPeriods?: Array<number>,
        center?: boolean,
    ): T;
    /**
     * __Apply a rolling sum (moving sum) over the values in this Series.__
     *
     * A window of length `window_size` will traverse the series. The values that fill this window
     * will (optionally) be multiplied with the weights given by the `weight` vector.
     *
     * The resulting parameters' values will be aggregated into their sum.
     * ___
     * @param windowSize - The length of the window.
     * @param weights - An optional slice with the same length as the window that will be multiplied
     * elementwise with the values in the window.
     * @param minPeriods The number of values in the window that should be non-null before computing a result.
     * If undefined, it will be set equal to window size.
     * @param center - Set the labels at the center of the window
     * @category Rolling
     */
    rollingSum(options: RollingOptions): T;
    rollingSum(
        windowSize: number,
        weights?: Array<number>,
        minPeriods?: Array<number>,
        center?: boolean,
    ): T;
    /**
     * __Compute a rolling variance.__
     *
     * A window of length `window_size` will traverse the series. The values that fill this window
     * will (optionally) be multiplied with the weights given by the `weight` vector.
     *
     * The resulting parameters' values will be aggregated into their sum.
     * ___
     * @param windowSize - The length of the window.
     * @param weights - An optional slice with the same length as the window that will be multiplied
     * elementwise with the values in the window.
     * @param minPeriods The number of values in the window that should be non-null before computing a result.
     * If undefined, it will be set equal to window size.
     * @param center - Set the labels at the center of the window
     * @category Rolling
     */
    rollingVar(options: RollingOptions): T;
    rollingVar(
        windowSize: number,
        weights?: Array<number>,
        minPeriods?: Array<number>,
        center?: boolean,
    ): T;
    /**
     * Compute a rolling median
     * @category Rolling
     */
    rollingMedian(options: RollingOptions): T;
    rollingMedian(
        windowSize: number,
        weights?: Array<number>,
        minPeriods?: Array<number>,
        center?: boolean,
    ): T;
    /**
     * Compute a rolling quantile
     * @param quantile quantile to compute
     * @param interpolation interpolation type
     * @param windowSize Size of the rolling window
     * @param weights - An optional slice with the same length as the window that will be multiplied
     * elementwise with the values in the window.
     * @param minPeriods The number of values in the window that should be non-null before computing a result.
     * If undefined, it will be set equal to window size.
     * @param center - Set the labels at the center of the window
     * @category Rolling
     */
    rollingQuantile(options: RollingQuantileOptions): T;
    rollingQuantile(
        quantile: number,
        interpolation?: InterpolationMethod,
        windowSize?: number,
        weights?: Array<number>,
        minPeriods?: Array<number>,
        center?: boolean,
        by?: String,
        closed?: ClosedWindow,
    ): T;
    /**
     * Compute a rolling skew
     * @param windowSize Size of the rolling window
     * @param bias If false, then the calculations are corrected for statistical bias.
     * @category Rolling
     */
    rollingSkew(windowSize: number, bias?: boolean): T;
    /**
     * Compute a rolling skew
     * @param options
     * @param options.windowSize Size of the rolling window
     * @param options.bias If false, then the calculations are corrected for statistical bias.
     * @category Rolling
     */
    rollingSkew(options: RollingSkewOptions): T;
}
