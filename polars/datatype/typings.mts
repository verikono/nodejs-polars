import {
    DataType,
} from './index.mjs';



/**
 * @ignore
 */
export type JsDataFrame = any;







/**
 * A field is a name and a datatype.
 */
export interface Field {
    name: string;
    dtype: DataType;
}
