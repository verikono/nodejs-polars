process.env.DEBUG_JITTS = true;
process.env.LOG_JITTS = "all";

export { resolve } from './resolve.mjs';
export { load } from './load.mjs';

export const base = '/home/bren/devel/nodejs-polars/';

export const routes = {

    'nodejs-polars___': { base: null, path: `${base}polars/index.mts` },
    
    'nodejs-polars/datatype___': { base: null, path: `${base}polars/datatype/index.mts` },

    'nodejs-polars/datatype/types___': { base: null, path: `${base}polars/datatype/types/index.mts` }

};
