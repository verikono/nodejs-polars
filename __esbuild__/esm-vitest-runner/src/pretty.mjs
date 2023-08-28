import { Writable, Readable } from 'node:stream';

export class PrettyLog extends Writable {

    constructor( options = {} ) {
        options.objectMode = true;
        super(options);
    }

    _write(event, encoding, callback) {

        switch (event.type) {

            case 'test:enqueue':
                callback(null, `t222est ${event.data.name} !!!!!queued`);
                break;

            case 'test:dequeue':
                callback(null, `test ${event.data.name} dequeued`);
                break;

            case 'test:start':
                callback(null, `test ${event.data.name} started`);
                break;
            case 'test:pass':
                callback(null, `test ${event.data.name} passed`);
                break;
            case 'test:fail':
                callback(null, `test ${event.data.name} failed`);
                break;
            case 'test:plan':
                callback(null, 'test plan');
                break;

            case 'test:diagnostic':
                callback(null, event.data.message);
                break;

            case 'test:coverage': {
                const { totalLineCount } = event.data.summary.totals;
                callback(null, `total line count: ${totalLineCount}\n`);
                break;
            }
        }
    }
}


export const pretty = new PrettyLog();
