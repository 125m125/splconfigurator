import Feature from "../Feature";
import FeatureSelectionStack from "../FeatureSelectionStack";
import CrossTreeConstraint from "./CrossTreeConstraint";

export default class RequireConstraint extends CrossTreeConstraint {
    constructor(source: Feature, target: Feature) {
        super("require", [source, target]);
    }
    public onNegativeSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        if (feature === this.features[1]) {
            this.features[0].selectNegative("requirement deselected", callStack, feature);
        }
    }
    public onPositiveSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        if (feature === this.features[0]) {
            this.features[1].selectPositive("required", callStack, feature);
        }
    }
}
