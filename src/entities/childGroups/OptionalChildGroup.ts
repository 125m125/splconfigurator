import Feature from "../Feature";
import FeatureSelectionStack from "../FeatureSelectionStack";
import ChildGroup from "./ChildGroup";

export default class OptionalChildGroup extends ChildGroup {
    constructor(parent: Feature) {
        super("optional", parent);
    }
}
