import Feature from "../Feature";
import FeatureSelectionStack from "../FeatureSelectionStack";

export default abstract class CrossTreeConstraint {
    public type: string;
    public features: Feature[];

    constructor(type: string, features: Feature[] = []) {
        this.type = type;
        this.features = features;
    }
    public onPositiveSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        // default is to do nothing
    }
    public onNegativeSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        // default is to do nothing
    }
}
