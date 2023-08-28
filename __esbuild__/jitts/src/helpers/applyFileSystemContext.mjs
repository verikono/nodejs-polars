import { existsSync, statSync } from 'node:fs';


const UrlSpecifierRx = /^[a-z0-9]*:\/\//;

/** string has lower case protocol, and ends with a forward-slash */
const OptimalDirectorySpecifierRx = /^[a-z0-9]*:\/\/.*\/$/;

/**
 * 
 * @param {*} url 
 * @returns {URL & { context: { type: 'filesystem', entry: 'file'|'directory' } } }
 */
export function applyFileSystemContext( url ) {
    if(url instanceof URL) {
        if(url.protocol === 'file:') {
            if(existsSync(url.pathname)) {

                url.context = {
                    type: 'filesystem'
                };

                const stat = statSync(url.pathname);
                if(stat.isFile()) {
                    url.context.entry = 'file';
                }
                else if(stat.isDirectory()) {
                    url.context.entry = 'directory';
                    url.href = OptimalDirectorySpecifierRx.test(url.href) ? url.href : `${url.href}/`;
                }
                else {
                    throw new Error(`applyFilesystemContext failed to determine if ${url.href} is a file or directory`);
                }
                url.context.exists = true;
                return url;
            }
            throw new Error(`applyFilesystemContext: path ${url.pathname} does not exist on the filesystem`);    
        }
        throw new Error(`applyFilesystemContext received a url which does not use the file protocol.`);
    }
    throw new Error(`applyFilesystemContext expected URL instance`);
}

