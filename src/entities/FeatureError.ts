import Feature from "./Feature";
import FeatureSelectionStack from "./FeatureSelectionStack";

export default class FeatureError {
    public reason: string;
    public feature: Feature;
    public stack: FeatureSelectionStack;
    public selectionReason: string;

    constructor(reason: string, feature: Feature, selectionReason: string, stack: FeatureSelectionStack) {
        this.reason = reason;
        this.feature = feature;
        this.selectionReason = selectionReason;
        this.stack = stack;
    }
}
