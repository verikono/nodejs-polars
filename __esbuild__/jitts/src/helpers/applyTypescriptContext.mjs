import { existsSync } from 'node:fs';
import { applyFileSystemContext } from "./index.mjs";

const isTypescriptSpecifier = /^.*\.(ts|mts|cts|tsx)$/;
const isTypescriptModuleSpecifier = /^.*\.mts$/;
const isTypescriptScriptSpecifier = /^.*\.cts$/;


export function applyTypescriptContext( url ) {

    if(url instanceof URL) {
        if(!('context' in url)) url = applyFileSystemContext(url);
        url.context.format = url.context.format || {};
        switch(url.context.entry) {
            case 'file':
                if(isTypescriptSpecifier.test(url.href)) {
                    url.context.format = { name: 'typescript' };
                    url.context.format.type = getTypescriptSourceType(url.href);
                    url.context.format.loc = url.href;
                    break;
                }
                throw new Error(`cannot apply typescript context to a file without a valid file extension ${url.href}`);

            case 'directory':
                for(const indexPath of [ './index.cts', './index.mts', './index.ts' ]) {
                    const candidate = new URL(indexPath, url.href);
                    if(existsSync(candidate.pathname)) {
                        url.context.typescript.loc = candidate.href;
                        url.context.type = getTypescriptSourceType(candidate.href);
                        break;
                    }
                }
                throw new Error(`cannot apply typescript context to a directory which does not have an index(mts,cts or ts) file in it`);
        }
        return url;
    }
    throw new Error(`applyTypescriptContext expected URL instance`);
}


/**
 * 
 * @param {string} href 
 * @returns {'module'|'script'|'unknown'}
 */
function getTypescriptSourceType( href ) {
    return (
        isTypescriptModuleSpecifier.test(href) ? 'module' :
        isTypescriptScriptSpecifier.test(href) ? 'script' :
        'unknown'
    )
}
