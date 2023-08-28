
export interface Round<T> {

    /**
     * Round underlying floating point data by `decimals` digits.
     *
     * Similar functionality to javascript `toFixed`
     * @param decimals number of decimals to round by.
     * @category Math
     */
    round(decimals: number): T;
    round(options: { decimals: number }): T;

    /**
     * Floor underlying floating point array to the lowest integers smaller or equal to the float value.
     * Only works on floating point Series
     * @category Math
     */
    floor(): T;

    /**
     * Ceil underlying floating point array to the highest integers smaller or equal to the float value.
     * Only works on floating point Series
     * @category Math
     */
    ceil(): T;

    /**
     * Clip (limit) the values in an array to any value that fits in 64 floating point range.
     * Only works for the following dtypes: {Int32, Int64, Float32, Float64, UInt32}.
     * If you want to clip other dtypes, consider writing a when -> then -> otherwise expression
     * @param min Minimum value
     * @param max Maximum value
     * @category Math
     */
    clip(min: number, max: number): T;
    clip(options: { min: number; max: number });

}
