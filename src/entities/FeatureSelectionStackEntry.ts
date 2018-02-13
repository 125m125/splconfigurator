import Feature from "./Feature";

export default class FeatureSelectionStackEntry {
    public feature: Feature;
    public previous: boolean|undefined;
    public now: boolean;
    public reason: string;
    public invoker: Feature;

    constructor(feature: Feature, previous: boolean|undefined, now: boolean, reason: string, invoker: Feature) {
        this.feature = feature;
        this.previous = previous;
        this.now = now;
        this.reason = reason;
        this.invoker = invoker;
    }
}
