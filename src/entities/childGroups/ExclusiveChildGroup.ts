import Feature from "../Feature";
import FeatureSelectionStack from "../FeatureSelectionStack";
import ChildGroup from "./ChildGroup";

export default class ExclusiveChildGroup extends ChildGroup {
    constructor(parent: Feature) {
        super("exclusive", parent);
    }

    public onParentPositiveSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        this.selectLast("last child in exclusive group", callStack, feature);
    }

    public onPositiveSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        this.selectAllNegative("other feature in exclusive group selected", callStack, feature);
    }

    public onNegativeSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        if (this.parent.selection === true) {
            this.selectLast("last child in exclusive group", callStack, feature);
        } else if (this.features.reduce((acc, f) => acc && (f.selection === false), true)) {
            this.parent.selectNegative("exclusive child group completely deselected", callStack, feature);
        }
    }
}
