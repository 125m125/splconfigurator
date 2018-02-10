import Feature from "./Feature";
import FeatureSelectionStackEntry from "./FeatureSelectionStackEntry";

export default class FeatureSelectionStack {
    public stack: FeatureSelectionStackEntry[] = [];

    public pushEntry(entry: FeatureSelectionStackEntry): void {
        this.stack.push(entry);
    }

    public push(feature: Feature, previous: boolean|undefined, now: boolean, reason: string, invoker: Feature): void {
        this.pushEntry(new FeatureSelectionStackEntry(feature, previous, now, reason, invoker));
    }

    public revert(): void {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            this.stack[i].feature.selection = this.stack[i].previous;
        }
    }
}
