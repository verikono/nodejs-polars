import { type RollingOptions } from './index.mjs';
import { type InterpolationMethod } from 'nodejs-polars/types';



/**
 * options for rolling quantile operations
 * @category Options
 */
export interface RollingQuantileOptions extends RollingOptions {
  quantile: number;
  interpolation?: InterpolationMethod;
}
