import {
    type DataFrame,
    isDataFrame,
} from 'nodejs-polars/dataframe';

export const isDataFrameArray = (ty: any): ty is DataFrame[] => Array.isArray(ty) && isDataFrame(ty[0]);

