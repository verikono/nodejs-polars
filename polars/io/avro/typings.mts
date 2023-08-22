import { type DataType } from 'nodejs-polars/datatypes';

export interface ReadAvroOptions {
    columns: string[] | Array<string> | number[];
    projection: number;
    nRows: number;
  }
