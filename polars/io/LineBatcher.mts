import { Transform } from 'node:stream';

// utility to read streams as lines.
export class LineBatcher extends Transform {

    #lines: Buffer[];
    #accumulatedLines: number;
    #batchSize: number;

    constructor(options) {
        super(options);
        this.#lines = [];
        this.#accumulatedLines = 0;
        this.#batchSize = options.batchSize;
    }

    _transform(chunk, _encoding, done) {

        let begin = 0;

        let i = 0;
        while (i < chunk.length) {
            if (chunk[i] === 10) {
                // '\n'
                this.#accumulatedLines++;
                if (this.#accumulatedLines === this.#batchSize) {
                    this.#lines.push(chunk.subarray(begin, i + 1));
                    this.push(Buffer.concat(this.#lines));
                    this.#lines = [];
                    this.#accumulatedLines = 0;
                    begin = i + 1;
                }
            }
            i++;
        }
        this.#lines.push(chunk.subarray(begin));
        done();
    }

    _flush(done) {
        this.push(Buffer.concat(this.#lines));
        done();
    }

}
