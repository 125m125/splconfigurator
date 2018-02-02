import ava from "ava";
import Model from "../../src/model/Model";

ava("new model creates and registers root feature", test => {
    var uut = new Model("core");

    var root = uut.root;

    test.truthy(root);
    test.is(uut.features[0], root);
    test.is(uut.nameMap.core, root);
});

ava("valid features can be added", test => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child", "optional");

    test.truthy(feature);
    test.is(feature.name, "child");
    test.true(uut.features.indexOf(feature) >= 0);
    test.is(uut.nameMap.child, feature);
});

ava("features with duplicate names can not be added", test => {
    var uut = new Model("core");
    test.throws(() => uut.addFeature("core", "core", "optional"));

    test.is(uut.features.length, 1);
    test.is(uut.nameMap.core, uut.root);
});

ava("renaming the root feature is possible", test => {
    var uut = new Model("core");

    uut.renameFeature("core", "newName");

    test.is(uut.root.name, "newName");
    test.is(uut.nameMap.newName, uut.root);
    test.falsy(uut.nameMap.core);
});

ava("renaming a feature renames feature", test => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child", "optional");

    uut.renameFeature("child", "newName");

    test.is(feature.name, "newName");
    test.is(uut.nameMap.newName, feature);
    test.falsy(uut.nameMap.child);
});


ava("renaming a feature keep the structure", test => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child", "optional");
    var child = uut.addFeature("child", "child2", "optional");
    var require = uut.addRequire("child2", "child");

    uut.renameFeature("child", "newName");

    test.is(uut.root.children[0].features[0], feature);
    test.is(feature.children[0].features[0], child);
    test.is(require.features[0], child);
    test.is(require.features[1], feature);
    test.is(feature.crossTreeConstraints[0], require);
});

ava("moving the root is not possible", t => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child", "optional");

    t.throws(() => uut.moveFeature("core", "child", "optional"));

    t.is(feature.parent, uut.root);
});

ava("moving a feature to a sibling is possible", t => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child1", "optional");
    var feature2 = uut.addFeature("core", "child2", "optional");

    uut.moveFeature("child1", "child2", "optional");

    t.is(feature.parent, feature2);
    t.is(feature2.children[0].features[0], feature);
});

ava("moving a feature to itself is not possible", t => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child1", "optional");
    var feature2 = uut.addFeature("core", "child2", "optional");

    t.throws(() => uut.moveFeature("child1", "child1", "optional"));

    t.is(uut.root.children[0].features[0], feature);
    t.is(uut.root.children[0].features[1], feature2);
});

ava("moving a feature to its own child is not possible", t => {
    var uut = new Model("core");
    var feature = uut.addFeature("core", "child1", "optional");
    var feature2 = uut.addFeature("child1", "child2", "optional");
    var feature3 = uut.addFeature("child2", "child3", "optional");

    t.throws(() => uut.moveFeature("child1", "child3", "optional"));

    t.is(uut.root.children[0].features[0], feature);
    t.is(feature.children[0].features[0], feature2);
    t.is(feature2.children[0].features[0], feature3);
});