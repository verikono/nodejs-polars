import { type JoinOptions } from './JoinOptions.mjs'


/** options for lazy join operations @see {@link LazyDataFrame.join} */
export interface LazyJoinOptions extends JoinOptions {
    allowParallel?: boolean;
    forceParallel?: boolean;
}
