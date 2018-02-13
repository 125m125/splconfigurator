import ChildGroup from "./childGroups/ChildGroup";
import CrossTreeConstraint from "./crossTreeConstraints/CrossTreeConstraint";
import FeatureError from "./FeatureError";
import FeatureSelectionStack from "./FeatureSelectionStack";

export default class Feature {
    public name: string;
    public parent: Feature|undefined;
    public childGroup: ChildGroup|undefined;
    public children: ChildGroup[] = [];
    public crossTreeConstraints: CrossTreeConstraint[] = [];

    public selection: boolean|undefined = undefined;

    constructor(name: string, parent?: Feature, childGroup?: ChildGroup) {
        this.name = name;
        this.parent = parent;
        this.childGroup = childGroup;
    }

    public selectPositive(reason: string, callStack: FeatureSelectionStack, invoker: Feature): FeatureSelectionStack {
        if (!callStack) {
            callStack = new FeatureSelectionStack();
        }
        if (this.selection === true) {
            return callStack;
        }
        if (this.selection === false) {
            throw new FeatureError("invalid positive selection", this, reason, callStack);
        }
        callStack.push(this, this.selection, true, reason, invoker);

        this.selection = true;

        if (this.parent) {
            this.parent.selectPositive("child selected", callStack, this);
        }
        if (this.childGroup) {
            this.childGroup.onPositiveSelection(this, callStack);
        }

        this.children.forEach((cg) => cg.onParentPositiveSelection(this, callStack));

        this.crossTreeConstraints.forEach((c) => c.onPositiveSelection(this, callStack));

        return callStack;
    }

    public selectNegative(reason: string, callStack: FeatureSelectionStack, invoker: Feature): FeatureSelectionStack {
        if (!callStack) { callStack = new FeatureSelectionStack(); }
        if (this.selection === false) {
            return callStack;
        }
        if (this.selection === true) {
            throw new FeatureError("invalid negative selection", this, reason, callStack);
        }
        callStack.push(this, this.selection, false, reason, invoker);

        this.selection = false;

        if (this.childGroup) {
            this.childGroup.onNegativeSelection(this, callStack);
        }

        this.children.forEach((cg) => cg.selectAllNegative("parent deselected", callStack, this));

        this.crossTreeConstraints.forEach((c) => c.onNegativeSelection(this, callStack));

        return callStack;
    }

    public hasAncestor(feature: Feature): boolean {
        if (!this.parent) {
            return false;
        }
        if (this.parent === feature) {
            return true;
        }
        return this.parent.hasAncestor(feature);
    }

    public hasDecendant(feature: Feature): boolean {
        return feature.hasAncestor(this);
    }
}
