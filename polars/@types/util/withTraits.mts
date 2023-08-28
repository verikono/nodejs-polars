import { type TraitMap } from 'nodejs-polars/types/traits';

export type WithTraits<TC extends object, TR extends keyof TraitMap<TC>> = { [T in keyof TraitMap<TC>[TR]]: TraitMap<TC>[TR][T] };

type ROO =  WithTraits<{}, 'Arithmetric'>


if(import.meta.vitest) {

    const {
        describe,
        test,
        expectTypeOf,
    } = import.meta.vitest;

    describe("nodejs-polars/types/utils.WithTraits", () => {

        test("it applies a single trait", async () =>
            expectTypeOf<WithTraits<{}, 'Arithmetric'>>().toHaveProperty<'div'>('div'));

        test.todo("it applies a multiple trait", async () => {
            // expectTypeOf<WithTraits<{}, 'Comparison'|'Arithmetric'>>().toHaveProperty<'div'>('div');
            // expectTypeOf<WithTraits<{}, 'Comparison'|'Arithmetric'>>().toHaveProperty<'lessThanEquals'>('lessThanEquals');
        });

    });

}
