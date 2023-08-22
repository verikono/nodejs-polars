import { DataType } from "./datatypes";
import pli from "./internals/polars_internal.mjs";
import { DataFrame, _DataFrame } from "./dataframe";
import { isPath } from "./utils";
import { LazyDataFrame, _LazyDataFrame } from "./lazy/dataframe";
import { Readable, Stream } from "stream";
import { concat } from "./functions";



















export interface ReadIPCOptions {
  columns: string[] | number[];
  nRows: number;
}





