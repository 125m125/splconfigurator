import Feature from "../Feature";
import FeatureSelectionStack from "../FeatureSelectionStack";
import ChildGroup from "./ChildGroup";

export default class MandatoryChildGroup extends ChildGroup {
    constructor(parent: Feature) {
        super("mandatory", parent);
    }

    public onParentPositiveSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        this.selectAllPositive("parent selected", callStack, feature);

    }

    public onNegativeSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        this.parent.selectNegative("mandatory child deselected", callStack, feature);
    }
}
