import  {
    type TSFile,
    type JPEGFile,
    type FormatTypeMap,
    TSExtensions,
    JPEGExtensions,
    TypescriptFormatTraits,
    JPEGFormatTraits,
} from './index.mjs';


import {
    raise,
} from '../../raise/index.mjs';



export function getFormatTraits( spec: TSFile ): TypescriptFormatTraits;
export function getFormatTraits( spec: JPEGFile ): JPEGFormatTraits;
export function getFormatTraits<T extends keyof FormatTypeMap>( spec: string ): FormatTypeMap[T];
export function getFormatTraits( spec: string ): TypescriptFormatTraits | JPEGFormatTraits {
    return (
        TSExtensions.find(ext => spec.endsWith(ext)) ? TypescriptFormatTraits :
        JPEGExtensions.find(ext => spec.endsWith(ext)) ? JPEGFormatTraits :
        raise(`failed determing protocol type for ${spec}`)
    );
}
