// import { describe, expect, test } from 'vitest';
import pl from '@polars';


describe("issue 97", () => {

    test("???", async () => {
        const df = pl.DataFrame({
            "a": [1, 2, 3],
            "b": [1, 2, 3],
            "c": [1, 2, 3]
        });
        df.fold((s1, s2) => s1.plus(s2))
    });

});
