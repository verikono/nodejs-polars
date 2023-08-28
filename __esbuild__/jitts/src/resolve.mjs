import { routes } from './index.mjs';
import { applyTypescriptContext, isPackageModule } from './helpers/index.mjs';
import { appendFileSync, exists, existsSync } from 'node:fs';
import { parse as pathParse } from 'node:path';

const isTypescriptModule = /^.*\.mts/;
const isJavascriptModule = /^.*\.mjs/;

export function resolve( spec, context, next ) {

    if(isPackageModule(spec,context)) {

        const { parentURL = undefined } = context;
        logPackageModule(spec, parentURL);

        let url = new URL(spec, parentURL);

        if(isTypescriptModule.test(url.href)) {
            url = applyTypescriptContext(url);
            return {
                format: url.context.format.type,
                url: url.context.format.loc,
                shortCircuit: true,
                importAssertions: { compile:true, type: url.context.format.type }
            };
        };

        if(isJavascriptModule.test(url.href)) {
            url = resolveJSMasquerade(url);
            return {
                format: url.context.format.type,
                url: url.context.format.loc,
                shortCircuit: true,
                importAssertions: { compile:true, type: url.context.format.type }
            };
        }

    }

    try { return next(spec, context) }
    catch( err ) {
        console.log('-=--->0');
    }
}


/** Handles the most idiotic concept ever - referring to typescript files with a different extension. */
function resolveJSMasquerade( url ) {

    if(!existsSync(url.pathname)) {
        for(const tsext of ['mts']) {
            const { dir, name } = pathParse(url.pathname);
            const candidate = [dir, [name, tsext].join('.')].join('/');
            if(existsSync(candidate)) {
                let resolvedURL = new URL(`file://${candidate}`);
                resolvedURL = applyTypescriptContext(resolvedURL);
                return resolvedURL;
            }
        }
        throw new Error(`failed resolving JSMasquerade for ${url.href}`);
    }
    return url;

}



function logPackageModule(spec, base) {
    if( process.env.LOG_JITTS === "all" ) {
        try {
            const { pathname } = new URL(spec, base);
            base = base || "none";
            const outFilePath = new URL('../___source_module_list.log', import.meta.url).pathname;
            appendFileSync(outFilePath, `\n${spec} | ${base} | ${pathname}`);
        }
        catch( err ) {
            console.log('\n\n\n');
            console.error(`failed building url from [ spec: ${spec} | base: ${base} ]\n${err.message}`);
            process.exit();
        }
    }
}
