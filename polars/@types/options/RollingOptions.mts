/**
 * options for rolling window operations
 * @category Options
 */
export interface RollingOptions {
    windowSize: number;
    weights?: Array<number>;
    minPeriods?: number;
    center?: boolean;
}
