import tape from "tape";
import GraphvizSerializer from "../../src/serializers/GraphvizSerializer";
import Model from "../../src/model/Model";

tape("GraphvizSerializer serializes root", test => {
    var model = new Model("core");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.equals(result, "digraph G {\r\ncore\r\n}");
    test.end();
});

tape("GraphvizSerializer serializes optional children", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "optional");
    model.addFeature("core", "child2", "optional");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.equals(result, 'digraph G {\r\ncore\r\nchild1\r\nchild2\r\ncore->child1[arrowhead="odot"]\r\ncore->child2[arrowhead="odot"]\r\n}');
    test.end();
});

tape("GraphvizSerializer serializes mandatory children", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "mandatory");
    model.addFeature("core", "child2", "mandatory");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.equals(result, 'digraph G {\r\ncore\r\nchild1\r\nchild2\r\ncore->child1[arrowhead="dot"]\r\ncore->child2[arrowhead="dot"]\r\n}');
    test.end();
});

tape("GraphvizSerializer serializes exclusive children", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "exclusive");
    model.addFeature("core", "child2", "exclusive");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.equals(result, 'digraph G {\r\ncore\r\nchild1\r\nchild2\r\ncore->child1[arrowtail="odiamond";dir="back"]\r\ncore->child2[arrowtail="odiamond";dir="back"]\r\n}');
    test.end();
});

tape("GraphvizSerializer serializes require edges", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "optional");
    model.addRequire("core", "child1");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.equals(result, 'digraph G {\r\ncore\r\nchild1\r\ncore->child1[label="<<require>>";style="dashed"]\r\ncore->child1[arrowhead="odot"]\r\n}');
    test.end();
});

tape("GraphvizSerializer serializes exclude edges", test => {
    var model = new Model("core");
    model.addFeature("core", "child1", "optional");
    model.addExclude("core", "child1");
    var uut = new GraphvizSerializer();

    var result = model.serializeModel(uut);

    test.equals(result, 'digraph G {\r\ncore\r\nchild1\r\ncore->child1[label="<<exclude>>";style="dashed";arrowtail="normal";dir="both"]\r\ncore->child1[arrowhead="odot"]\r\n}');
    test.end();
});