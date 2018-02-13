import Feature from "../Feature";
import FeatureSelectionStack from "../FeatureSelectionStack";
import CrossTreeConstraint from "./CrossTreeConstraint";

export default class ExcludeConstraint extends CrossTreeConstraint {
    constructor(feature1: Feature, feature2: Feature) {
        super("exclude", [feature1, feature2]);
    }
    public onPositiveSelection(feature: Feature, callStack: FeatureSelectionStack) {
        this.features.forEach((f) => {
            if (f !== feature) {
                f.selectNegative("excluded", callStack, feature);
            }
        });
    }
}
