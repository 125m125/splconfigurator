import Feature from "../Feature";
import FeatureSelectionStack from "../FeatureSelectionStack";
import ChildGroup from "./ChildGroup";

export default class OrChildGroup extends ChildGroup {
    constructor(parent: Feature) {
        super("or", parent);
    }
    public onParentPositiveSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        this.selectLast("last child in or group", callStack, feature);
    }

    public onNegativeSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        if (this.parent.selection === true) {
            this.selectLast("last child in or group", callStack, feature);
        } else if (!this.features.reduce((acc, f) => acc || f.selection !== false, false)) {
            this.parent.selectNegative("or child group completely deselected", callStack, feature);
        }
    }
}
