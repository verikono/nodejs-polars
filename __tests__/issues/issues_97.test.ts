// import { describe, expect, test } from 'vitest';
import pl from '@polars';


describe("issue 97", () => {

    test("true is truthy", () => expect(true).toBeTruthy());

    test("???", async () => {
        console.log('PL', pl);
    });

});
