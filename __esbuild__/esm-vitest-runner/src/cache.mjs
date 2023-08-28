const ArrayStringRx = /^\[.*\]$/;


class TestCache {

    

    purgeCache() {
        delete process.env.AVR_CACHE;
    }

    addFiles( filePaths ) {

        if(!process.env.AVR_CACHE)
            process.env.AVR_CACHE = "[]";

        const { AVR_CACHE } = process.env;

        if(ArrayStringRx.test(AVR_CACHE)) {
            const files = JSON.parse(AVR_CACHE);
            if(Array.isArray(files)) {
                files.push(...filePaths);
                process.env.AVR_CACHE = JSON.stringify(files);
                return;
            }
            // the error below is appropriate.
        }
        this.purgeCache();
        throw new Error('corrupted test runner cache. Ive purged the cache, try again');
    }

    getFiles() {
        const AVR_CACHE = process.env.AVR_CACHE || "[]";
        if( ArrayStringRx.test(AVR_CACHE)) {
            const files = JSON.parse(AVR_CACHE);
            return files;
        }
        throw new Error(`failed getting cached files.`);
    }
}

const cache = new TestCache();
export default cache;
