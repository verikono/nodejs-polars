import {
    VitestTestRunner
} from 'vitest/runners';

import {
    transformSync
} from 'esbuild';


import { readFileSync } from 'node:fs';


export default class EsmVitestRunner extends VitestTestRunner {

    memcache = new Map();

    /**
     * 
     * @param {string} filepath 
     * @param {VitestRunnerImportSource} source 
     */
    importFile( filePath, source ) {
        console.debug(`importFile [${source}]`, filePath);
        if(source === "collect") {
            let compilation;
            if(!this.memcache.has(filePath)) {
                const typescript = readFileSync(filePath, { encoding: 'utf-8' });
                const result = transformSync(typescript, { loader: "ts" });
                const { code, map, warnings } = result;
                warnings.forEach(warning => console.warn([filePath, warning, '\n']).join('\n'));
                this.memcache.set(filePath, { typescript, code, map });
                compilation = code;
            }
            compilation = compilation || this.memcache.get(filePath).code;
            console.log(this.__vitest_executor);
            return compilation;
        }
        throw new Error(`importFile - unsupported source mode ${source}`);
    }

    // async runTest( test )  {
    //     console.log('runTest --->');
    //     this.vm = await import('node:vm');
    //     console.log(vm);
    // }

};
