import Feature from "../entities/Feature";
import FeatureError from "../entities/FeatureError";
import MandatoryChildGroup from "../entities/childGroups/MandatoryChildGroup";
import OptionalChildGroup from "../entities/childGroups/OptionalChildGroup";
import OrChildGroup from "../entities/childGroups/OrChildGroup";
import ExclusiveChildGroup from "../entities/childGroups/ExclusiveChildGroup";
import ExcludeConstraint from "../entities/crossTreeConstraints/ExcludeConstraint";
import RequireConstraint from "../entities/crossTreeConstraints/RequireConstraint";

var groupTypes = {
    "mandatory": MandatoryChildGroup,
    "optional": OptionalChildGroup,
    "or": OrChildGroup,
    "exclusive": ExclusiveChildGroup,
};

export default function Model(rootName) {
    var root = new Feature(rootName);
    var nameMap = {};
    var features = [root,];
    var selectionStarted = false;
    var changes = [];

    nameMap[rootName] = root;

    //? if(EXPOSE_INNERTS) {
    this.nameMap = nameMap;
    this.features = features;
    this.root = root;
    this.changes = changes;
    //? }

    this.selectionStarted = function() {
        return selectionStarted;
    };

    this.getFeaturenames = function() {
        return features.map(f => f.name);
    };

    this.addFeature = function(parentName, childName, groupType) {
        if (selectionStarted) {
            throw new Error("modifications after starting the feature selection are not allowed");
        }

        var parent = nameMap[parentName];
        if (!parent) {
            throw new Error("unable to add feature " + childName + ": unknown parent " + parentName);
        }
        if (nameMap[childName]) {
            throw new Error("unable to add feature " + childName + ": feature with this name already exists");
        }
        if (!groupTypes[groupType]) {
            throw new Error("unable to add feature " + childName + ": unknown groupType " + groupType);
        }
        var group = parent.children.find(cg => cg.type === groupType);
        if (!group) {
            group = new groupTypes[groupType](parent);
            parent.children.push(group);
        }
        var child = new Feature(childName, parent, group);

        nameMap[childName] = child;
        group.features.push(child);
        features.push(child);

        //? if(RETURN_INNERTS) {
        return child;
        //? }

        //? if(RETURN_SELF) {
        // eslint-disable-next-line no-unreachable
        return this;
        //? }
    };

    this.renameFeature = function(oldname, newname) {
        var feature = nameMap[oldname];
        if (!feature) {
            throw new Error("unable to rename feature: unknown feature " + oldname);
        }
        if (nameMap[newname]) {
            throw new Error("unable to rename feature: a feature with name " + newname + " already exists");
        }

        feature.name = newname;
        delete nameMap[oldname];
        nameMap[newname] = feature;

        //? if(RETURN_INNERTS) {
        return feature;
        //? }

        //? if(RETURN_SELF) {
        // eslint-disable-next-line no-unreachable
        return this;
        //? }
    };

    this.moveFeature = function(featureName, newParentName, newType) {
        if (selectionStarted) {
            throw new Error("modifications after starting the feature selection are not allowed");
        }
        if (featureName === newParentName) {
            throw new Error("unable to move feature " + featureName + ": a feature can not be its own child");
        }

        var feature = nameMap[featureName];
        if (!feature) {
            throw new Error("unable to move feature " + featureName + ": unknown feature " + featureName);
        }
        if (root === feature) {
            throw new Error("unable to move feature " + featureName + ": the root of a model cannot be moved");
        }

        var newParent = nameMap[newParentName];
        if (!newParent) {
            throw new Error("unable to move feature " + featureName + ": unknown parent " + newParent);
        }
        if (!groupTypes[newType]) {
            throw new Error("unable to move feature " + featureName + ": unknown groupType " + newType);
        }

        if (feature.hasDecendant(newParent)) {
            throw new Error("unable to move feature " + featureName + ": the new parent is currently a descendant of this feature");
        }

        feature.childGroup.features.splice(feature.childGroup.features.indexOf(feature), 1);

        var newGroup = newParent.children.find(cg => cg.type === newType);
        if (!newGroup) {
            newGroup = new groupTypes[newType](newParent);
            newParent.children.push(newGroup);
        }
        newGroup.features.push(feature);
        feature.childGroup = newGroup;
        feature.parent = newParent;

        //? if(RETURN_INNERTS) {
        return feature;
        //? }

        //? if(RETURN_SELF) {
        // eslint-disable-next-line no-unreachable
        return this;
        //? }
    };

    this.addCrossTreeConstraint = function(type, features) {
        switch (type) {
            case "exclude":
                return this.addExclude(features[0], features[1]);
            case "require":
                return this.addRequire(features[0], features[1]);
            default:
                throw new Error("unable to add constraint of unknown type " + type);
        }
    };

    this.addExclude = function(feature1Name, feature2Name) {
        if (selectionStarted) {
            throw new Error("modifications after starting the feature selection are not allowed");
        }

        var feature1 = nameMap[feature1Name];
        if (!feature1) {
            throw new Error("unable to add exclude constraint: unknown feature " + feature1Name);
        }
        var feature2 = nameMap[feature2Name];
        if (!feature2) {
            throw new Error("unable to add exclude constraint: unknown feature " + feature2Name);
        }
        var constraint = new ExcludeConstraint(feature1, feature2);
        feature1.crossTreeConstraints.push(constraint);
        feature2.crossTreeConstraints.push(constraint);

        //? if(RETURN_INNERTS) {
        return constraint;
        //? }

        //? if(RETURN_SELF) {
        // eslint-disable-next-line no-unreachable
        return this;
        //? }
    };

    this.addRequire = function(feature1Name, feature2Name) {
        if (selectionStarted) {
            throw new Error("modifications after starting the feature selection are not allowed");
        }

        var feature1 = nameMap[feature1Name];
        if (!feature1) {
            throw new Error("unable to add require constraint: unknown feature " + feature1Name);
        }
        var feature2 = nameMap[feature2Name];
        if (!feature2) {
            throw new Error("unable to add require constraint: unknown feature " + feature2Name);
        }

        var constraint = new RequireConstraint(feature1, feature2);
        feature1.crossTreeConstraints.push(constraint);
        feature2.crossTreeConstraints.push(constraint);

        //? if(RETURN_INNERTS) {
        return constraint;
        //? }

        //? if(RETURN_SELF) {
        // eslint-disable-next-line no-unreachable
        return this;
        //? }
    };

    this.selectFeaturePositive = function(featurename) {
        return this.selectFeature(featurename, true);
    };

    this.selectFeatureNegative = function(featurename) {
        return this.selectFeature(featurename, false);
    };

    this.selectionOf = function(featurename) {
        var feature = nameMap[featurename];
        if (!feature) {
            throw new Error("unknown feature " + featurename);
        }
        return feature.selection;
    };

    this.startSelection = function() {
        if (!selectionStarted) {
            selectionStarted = true;
            this.selectFeature(root.name, "root feature has to be selected");
        }
    };

    this.selectFeature = function(featurename, type, reason) {
        this.startSelection();
        var feature = nameMap[featurename];
        if (!feature) {
            throw new Error("unable to select feature: unknown feature " + featurename);
        }
        try {
            var result;
            if (type)
                result = feature.selectPositive(reason || "user selected");
            else
                result = feature.selectNegative(reason || "user selected");
            changes.push(result);
            //? if(RETURN_INNERTS) {
            return result;
            //? }

            //? if(RETURN_SELF) {
            // eslint-disable-next-line no-unreachable
            return this;
            //? }
        } catch (e) {
            if (e instanceof FeatureError) {
                e.stack.revert();

                //? if (RETURN_INNERTS) {
                throw e;
                //? } else {
                // eslint-disable-next-line no-unreachable
                throw new Error("selection of feature failed: " + e.reason + ": " + e.name);
                //? }
            } else {
                throw e;
            }
        }
    };

    this.serializeModel = function(serializer, options) {
        if (typeof serializer === "function") {
            return serializer(root, options);
        }
        return serializer.serializeModel(root, options);
    };

    this.serializeConfiguration = function(serializer, options) {
        return serializer.serializeConfiguration(root, options);
    };

    this.deserializeConfiguration = function(serializer, configuration, options) {
        return serializer.deserializeConfiguration(this, configuration, options);
    };

    this.revertLastSelection = function() {
        if (!changes.length) throw new Error("nothing to revert");
        var lastChange = changes.pop();
        lastChange.revert();
        if (!changes.length) selectionStarted = false;
    };
}
