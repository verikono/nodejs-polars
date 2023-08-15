import {
    type FSEntry,
    type AbsFSEntry
} from '../utils/index.mjs';




/** TypeGuard - @type {FSPath} */
export function isFSPath( value: unknown ): value is FSPath {
    if( typeof value === 'string' ) {
        if( FSPathRx.test(value) )
            return true;
    }
    return false;
}

/** TypeGuard - @type {AbsFSPath} */
export function isAbsFSPath( value:unknown ): value is AbsFSPath {
    if( isFSPath(value) ) {
        if( AbsFSPathRx.test(value) ) {
            return true;
        }
    }
    return false;
}

/** TypeGuard - @type {RelFSPath} */
export function isRelFSPath( value: unknown ): value is RelFSPath {
    if( isFSPath(value) ) {
        if( RelFSPathRx.test(value) ) {
            return true;
        }
    }
    return false;
}


export function toFSPath( entry: FSEntry, base: AbsFSEntry ): AbsFSPath {
    return 'todo';
}


if( import.meta.vitest ) {

    const {
        describe,
        test,
        expect
    } = import.meta.vitest;

    describe(`isAbsFSPath`, () => {
        test.each`
            value|expected
            ${"../polars/index.ts"}|${false}
            ${"./polars/index.ts"}|${false},
            ${"/polars/index.ts"}|${true},
            ${"C:\\polars"}|${true}
        `(`$value -> $expected`, ({value, expected}) =>
            expect(isAbsFSPath(value)).toBe(expected));
    });

    describe(`isRelFSPath`, () => {
        test.each`
            value|expected
            ${"../polars/index.ts"}|${true}
            ${"./polars/index.ts"}|${true},
            ${"/polars/index.ts"}|${false},
            ${"C:\\polars"}|${false}
        `(`$value -> $expected`, ({value, expected}) =>
            expect(isRelFSPath(value)).toBe(expected));
    })


    describe.todo(`FSPathRx`);

    describe.todo(`RelFSPathRx`);

    describe.todo(`AbsFSPathRx`);

}
