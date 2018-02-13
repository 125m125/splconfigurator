import Feature from "../Feature";
import FeatureSelectionStack from "../FeatureSelectionStack";

export default abstract class ChildGroup {
    public type: string;
    public parent: Feature;
    public features: Feature[] = [];

    constructor(type: string, parent: Feature) {
        this.type = type;
        this.parent = parent;
    }

    public onParentPositiveSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        // default is to do nothing
    }
    public onPositiveSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        // default is to do nothing
    }
    public onNegativeSelection(feature: Feature, callStack: FeatureSelectionStack): void {
        // default is to do nothing
    }

    public selectLast(reason: string, callStack: FeatureSelectionStack, invoker: Feature): void {
        let unselected = this.features.length;
        this.features.reduce((acc: undefined|Feature|FeatureSelectionStack, feature) => {
            if (acc) { return acc; }
            if (--unselected === 0) {
                return feature.selectPositive(reason, callStack, invoker);
            } else if (feature.selection !== false) {
                return invoker;
            }
        }, undefined);
    }

    public selectAllPositive(reason: string, callStack: FeatureSelectionStack, invoker: Feature): void {
        this.features.forEach((f) => f !== invoker ? f.selectPositive(reason, callStack, invoker) : false);
    }

    public selectAllNegative(reason: string, callStack: FeatureSelectionStack, invoker: Feature): void {
        this.features.forEach((f) => f !== invoker ? f.selectNegative(reason, callStack, invoker) : false);
    }
}
