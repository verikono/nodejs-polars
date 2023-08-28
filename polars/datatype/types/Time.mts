import { PLRDataType } from '../PLRDataType.mjs';


export class Time { //extends PLRDataType {

    constructor() {
        // super();
    }

}





if(import.meta.vitest) {

    const {
        beforeAll,
        describe,
        test,
        expect,
    } = import.meta.vitest;


    describe("nodejs-polars/datatype/types.Time", () => {

        let instance:Time;

        beforeAll(async () => {
            instance = new Time();
        });

        test("cleanly instantiates", () => expect(instance).toBeInstanceOf(Time));

    });

}
