import { type ReadJsonOptions } from "./typings.mjs";



export const readJsonDefaultOptions: Partial<ReadJsonOptions> = {
    batchSize: 10000,
    inferSchemaLength: 50,
    format: "json",
};
