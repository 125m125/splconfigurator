import test from "ava";

import complex1 from "../test/resources/complex1.json";

export function runTests(uut) {
    test("serialize without changes", t => {
        var serializer = new uut.JSONSerializer();

        var model = serializer.deserializeModel(complex1);
        var result = model.serializeModel(serializer);

        t.deepEqual(result, complex1);
    });

}
