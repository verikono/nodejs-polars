import {
    TypescriptFormatTraits
} from './typescript.mjs';

import {
    type JPEGExt,
    JPEGExtensions,
    JPEGFormatTraits,
} from './jpeg.mjs';


export declare type FormatTypes = "typescript" | "jpeg";


export declare type FormatTypeMap = {
    typescript: TypescriptFormatTraits;
    jpeg: JPEGFormatTraits;
};


export {
    type TSESMFile,
    type TSCJSFile,
    type TSDeclarationFile,
    type TSFile,
    TSExtensions,
    TypescriptFormatTraits,
} from './typescript.mjs';

export {
    type JPEGFile,
    JPEGExtensions,
    JPEGFormatTraits,
} from './jpeg.mjs';

export {
    getFormatTraits
} from './getFormatTraits.mjs'
