/**
 * Options for {@link DataFrame.writeJSON}
 * @category Options
 */
export interface WriteJsonOptions {
    orient?: "row" | "col" | "dataframe";
    multiline?: boolean;
}
