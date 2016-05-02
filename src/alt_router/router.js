'use strict';"use strict";
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var async_1 = require('angular2/src/facade/async');
var collection_2 = require('angular2/src/facade/collection');
var exceptions_1 = require('angular2/src/facade/exceptions');
var recognize_1 = require('./recognize');
var link_1 = require('./link');
var segments_1 = require('./segments');
var lifecycle_reflector_1 = require('./lifecycle_reflector');
var constants_1 = require('./constants');
var RouterOutletMap = (function () {
    function RouterOutletMap() {
        /** @internal */
        this._outlets = {};
    }
    RouterOutletMap.prototype.registerOutlet = function (name, outlet) { this._outlets[name] = outlet; };
    return RouterOutletMap;
}());
exports.RouterOutletMap = RouterOutletMap;
var Router = (function () {
    function Router(_rootComponent, _rootComponentType, _componentResolver, _urlSerializer, _routerOutletMap, _location) {
        this._rootComponent = _rootComponent;
        this._rootComponentType = _rootComponentType;
        this._componentResolver = _componentResolver;
        this._urlSerializer = _urlSerializer;
        this._routerOutletMap = _routerOutletMap;
        this._location = _location;
        this._changes = new async_1.EventEmitter();
        this._prevTree = this._createInitialTree();
        this._setUpLocationChangeListener();
        this.navigateByUrl(this._location.path());
    }
    Object.defineProperty(Router.prototype, "urlTree", {
        get: function () { return this._urlTree; },
        enumerable: true,
        configurable: true
    });
    Router.prototype.navigateByUrl = function (url) {
        return this._navigate(this._urlSerializer.parse(url));
    };
    Router.prototype.navigate = function (changes, segment) {
        return this._navigate(this.createUrlTree(changes, segment));
    };
    Router.prototype.dispose = function () { async_1.ObservableWrapper.dispose(this._locationSubscription); };
    Router.prototype._createInitialTree = function () {
        var root = new segments_1.RouteSegment([new segments_1.UrlSegment("", null, null)], null, constants_1.DEFAULT_OUTLET_NAME, this._rootComponentType, null);
        return new segments_1.RouteTree(new segments_1.TreeNode(root, []));
    };
    Router.prototype._setUpLocationChangeListener = function () {
        var _this = this;
        this._locationSubscription = this._location.subscribe(function (change) { _this._navigate(_this._urlSerializer.parse(change['url'])); });
    };
    Router.prototype._navigate = function (url) {
        var _this = this;
        this._urlTree = url;
        return recognize_1.recognize(this._componentResolver, this._rootComponentType, url)
            .then(function (currTree) {
            return new _LoadSegments(currTree, _this._prevTree)
                .load(_this._routerOutletMap, _this._rootComponent)
                .then(function (updated) {
                if (updated) {
                    _this._prevTree = currTree;
                    _this._location.go(_this._urlSerializer.serialize(_this._urlTree));
                    _this._changes.emit(null);
                }
            });
        });
    };
    Router.prototype.createUrlTree = function (changes, segment) {
        if (lang_1.isPresent(this._prevTree)) {
            var s = lang_1.isPresent(segment) ? segment : this._prevTree.root;
            return link_1.link(s, this._prevTree, this.urlTree, changes);
        }
        else {
            return null;
        }
    };
    Router.prototype.serializeUrl = function (url) { return this._urlSerializer.serialize(url); };
    Object.defineProperty(Router.prototype, "changes", {
        get: function () { return this._changes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "routeTree", {
        get: function () { return this._prevTree; },
        enumerable: true,
        configurable: true
    });
    return Router;
}());
exports.Router = Router;
var _LoadSegments = (function () {
    function _LoadSegments(currTree, prevTree) {
        this.currTree = currTree;
        this.prevTree = prevTree;
        this.deactivations = [];
        this.performMutation = true;
    }
    _LoadSegments.prototype.load = function (parentOutletMap, rootComponent) {
        var _this = this;
        var prevRoot = lang_1.isPresent(this.prevTree) ? segments_1.rootNode(this.prevTree) : null;
        var currRoot = segments_1.rootNode(this.currTree);
        return this.canDeactivate(currRoot, prevRoot, parentOutletMap, rootComponent)
            .then(function (res) {
            _this.performMutation = true;
            if (res) {
                _this.loadChildSegments(currRoot, prevRoot, parentOutletMap, [rootComponent]);
            }
            return res;
        });
    };
    _LoadSegments.prototype.canDeactivate = function (currRoot, prevRoot, outletMap, rootComponent) {
        var _this = this;
        this.performMutation = false;
        this.loadChildSegments(currRoot, prevRoot, outletMap, [rootComponent]);
        var allPaths = async_1.PromiseWrapper.all(this.deactivations.map(function (r) { return _this.checkCanDeactivatePath(r); }));
        return allPaths.then(function (values) { return values.filter(function (v) { return v; }).length === values.length; });
    };
    _LoadSegments.prototype.checkCanDeactivatePath = function (path) {
        var _this = this;
        var curr = async_1.PromiseWrapper.resolve(true);
        var _loop_1 = function(p) {
            curr = curr.then(function (_) {
                if (lifecycle_reflector_1.hasLifecycleHook("routerCanDeactivate", p)) {
                    return p.routerCanDeactivate(_this.prevTree, _this.currTree);
                }
                else {
                    return _;
                }
            });
        };
        for (var _i = 0, _a = collection_1.ListWrapper.reversed(path); _i < _a.length; _i++) {
            var p = _a[_i];
            _loop_1(p);
        }
        return curr;
    };
    _LoadSegments.prototype.loadChildSegments = function (currNode, prevNode, outletMap, components) {
        var _this = this;
        var prevChildren = lang_1.isPresent(prevNode) ?
            prevNode.children.reduce(function (m, c) {
                m[c.value.outlet] = c;
                return m;
            }, {}) :
            {};
        currNode.children.forEach(function (c) {
            _this.loadSegments(c, prevChildren[c.value.outlet], outletMap, components);
            collection_2.StringMapWrapper.delete(prevChildren, c.value.outlet);
        });
        collection_2.StringMapWrapper.forEach(prevChildren, function (v, k) { return _this.unloadOutlet(outletMap._outlets[k], components); });
    };
    _LoadSegments.prototype.loadSegments = function (currNode, prevNode, parentOutletMap, components) {
        var curr = currNode.value;
        var prev = lang_1.isPresent(prevNode) ? prevNode.value : null;
        var outlet = this.getOutlet(parentOutletMap, currNode.value);
        if (segments_1.equalSegments(curr, prev)) {
            this.loadChildSegments(currNode, prevNode, outlet.outletMap, components.concat([outlet.loadedComponent]));
        }
        else {
            this.unloadOutlet(outlet, components);
            if (this.performMutation) {
                var outletMap = new RouterOutletMap();
                var loadedComponent = this.loadNewSegment(outletMap, curr, prev, outlet);
                this.loadChildSegments(currNode, prevNode, outletMap, components.concat([loadedComponent]));
            }
        }
    };
    _LoadSegments.prototype.loadNewSegment = function (outletMap, curr, prev, outlet) {
        var resolved = core_1.ReflectiveInjector.resolve([core_1.provide(RouterOutletMap, { useValue: outletMap }), core_1.provide(segments_1.RouteSegment, { useValue: curr })]);
        var ref = outlet.load(segments_1.routeSegmentComponentFactory(curr), resolved, outletMap);
        if (lifecycle_reflector_1.hasLifecycleHook("routerOnActivate", ref.instance)) {
            ref.instance.routerOnActivate(curr, prev, this.currTree, this.prevTree);
        }
        return ref.instance;
    };
    _LoadSegments.prototype.getOutlet = function (outletMap, segment) {
        var outlet = outletMap._outlets[segment.outlet];
        if (lang_1.isBlank(outlet)) {
            if (segment.outlet == constants_1.DEFAULT_OUTLET_NAME) {
                throw new exceptions_1.BaseException("Cannot find default outlet");
            }
            else {
                throw new exceptions_1.BaseException("Cannot find the outlet " + segment.outlet);
            }
        }
        return outlet;
    };
    _LoadSegments.prototype.unloadOutlet = function (outlet, components) {
        var _this = this;
        if (lang_1.isPresent(outlet) && outlet.isLoaded) {
            collection_2.StringMapWrapper.forEach(outlet.outletMap._outlets, function (v, k) { return _this.unloadOutlet(v, components); });
            if (this.performMutation) {
                outlet.unload();
            }
            else {
                this.deactivations.push(components.concat([outlet.loadedComponent]));
            }
        }
    };
    return _LoadSegments;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC11b3c2N3QxMi50bXAvYW5ndWxhcjIvc3JjL2FsdF9yb3V0ZXIvcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBcUUsZUFBZSxDQUFDLENBQUE7QUFFckYscUJBQXVDLDBCQUEwQixDQUFDLENBQUE7QUFDbEUsMkJBQTBCLGdDQUFnQyxDQUFDLENBQUE7QUFDM0Qsc0JBS08sMkJBQTJCLENBQUMsQ0FBQTtBQUNuQywyQkFBK0IsZ0NBQWdDLENBQUMsQ0FBQTtBQUNoRSwyQkFBNEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUc3RCwwQkFBd0IsYUFBYSxDQUFDLENBQUE7QUFFdEMscUJBQW1CLFFBQVEsQ0FBQyxDQUFBO0FBRTVCLHlCQVVPLFlBQVksQ0FBQyxDQUFBO0FBQ3BCLG9DQUErQix1QkFBdUIsQ0FBQyxDQUFBO0FBQ3ZELDBCQUFrQyxhQUFhLENBQUMsQ0FBQTtBQUVoRDtJQUFBO1FBQ0UsZ0JBQWdCO1FBQ2hCLGFBQVEsR0FBbUMsRUFBRSxDQUFDO0lBRWhELENBQUM7SUFEQyx3Q0FBYyxHQUFkLFVBQWUsSUFBWSxFQUFFLE1BQW9CLElBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVGLHNCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSx1QkFBZSxrQkFJM0IsQ0FBQTtBQUVEO0lBTUUsZ0JBQW9CLGNBQXNCLEVBQVUsa0JBQXdCLEVBQ3hELGtCQUFxQyxFQUNyQyxjQUFtQyxFQUNuQyxnQkFBaUMsRUFBVSxTQUFtQjtRQUg5RCxtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBTTtRQUN4RCx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3JDLG1CQUFjLEdBQWQsY0FBYyxDQUFxQjtRQUNuQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWlCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUwxRSxhQUFRLEdBQXVCLElBQUksb0JBQVksRUFBUSxDQUFDO1FBTTlELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELHNCQUFJLDJCQUFPO2FBQVgsY0FBeUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUVoRCw4QkFBYSxHQUFiLFVBQWMsR0FBVztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCx5QkFBUSxHQUFSLFVBQVMsT0FBYyxFQUFFLE9BQXNCO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELHdCQUFPLEdBQVAsY0FBa0IseUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRSxtQ0FBa0IsR0FBMUI7UUFDRSxJQUFJLElBQUksR0FBRyxJQUFJLHVCQUFZLENBQUMsQ0FBQyxJQUFJLHFCQUFVLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSwrQkFBbUIsRUFDM0QsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxJQUFJLG9CQUFTLENBQUMsSUFBSSxtQkFBUSxDQUFlLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyw2Q0FBNEIsR0FBcEM7UUFBQSxpQkFHQztRQUZDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FDakQsVUFBQyxNQUFNLElBQU8sS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVPLDBCQUFTLEdBQWpCLFVBQWtCLEdBQVk7UUFBOUIsaUJBY0M7UUFiQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNwQixNQUFNLENBQUMscUJBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQzthQUNsRSxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ1osTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFJLENBQUMsU0FBUyxDQUFDO2lCQUM3QyxJQUFJLENBQUMsS0FBSSxDQUFDLGdCQUFnQixFQUFFLEtBQUksQ0FBQyxjQUFjLENBQUM7aUJBQ2hELElBQUksQ0FBQyxVQUFBLE9BQU87Z0JBQ1gsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDWixLQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztvQkFDMUIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCw4QkFBYSxHQUFiLFVBQWMsT0FBYyxFQUFFLE9BQXNCO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsR0FBRyxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUMzRCxNQUFNLENBQUMsV0FBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBRUQsNkJBQVksR0FBWixVQUFhLEdBQVksSUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpGLHNCQUFJLDJCQUFPO2FBQVgsY0FBa0MsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUV6RCxzQkFBSSw2QkFBUzthQUFiLGNBQTZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDdkQsYUFBQztBQUFELENBQUMsQUFwRUQsSUFvRUM7QUFwRVksY0FBTSxTQW9FbEIsQ0FBQTtBQUdEO0lBSUUsdUJBQW9CLFFBQW1CLEVBQVUsUUFBbUI7UUFBaEQsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFINUQsa0JBQWEsR0FBZSxFQUFFLENBQUM7UUFDL0Isb0JBQWUsR0FBWSxJQUFJLENBQUM7SUFFK0IsQ0FBQztJQUV4RSw0QkFBSSxHQUFKLFVBQUssZUFBZ0MsRUFBRSxhQUFxQjtRQUE1RCxpQkFZQztRQVhDLElBQUksUUFBUSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLG1CQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN6RSxJQUFJLFFBQVEsR0FBRyxtQkFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV2QyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxhQUFhLENBQUM7YUFDeEUsSUFBSSxDQUFDLFVBQUEsR0FBRztZQUNQLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUMvRSxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVPLHFDQUFhLEdBQXJCLFVBQXNCLFFBQWdDLEVBQUUsUUFBZ0MsRUFDbEUsU0FBMEIsRUFBRSxhQUFxQjtRQUR2RSxpQkFPQztRQUxDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFFdkUsSUFBSSxRQUFRLEdBQUcsc0JBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FBQyxDQUFDO1FBQy9GLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBaUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQTlDLENBQThDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRU8sOENBQXNCLEdBQTlCLFVBQStCLElBQWM7UUFBN0MsaUJBWUM7UUFYQyxJQUFJLElBQUksR0FBRyxzQkFBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QztZQUNFLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztnQkFDaEIsRUFBRSxDQUFDLENBQUMsc0NBQWdCLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxNQUFNLENBQWlCLENBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFJLENBQUMsUUFBUSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDOUUsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNYLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQzs7UUFQTCxHQUFHLENBQUMsQ0FBVSxVQUEwQixFQUExQixLQUFBLHdCQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUExQixjQUEwQixFQUExQixJQUEwQixDQUFDO1lBQXBDLElBQUksQ0FBQyxTQUFBOztTQVFUO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyx5Q0FBaUIsR0FBekIsVUFBMEIsUUFBZ0MsRUFBRSxRQUFnQyxFQUNsRSxTQUEwQixFQUFFLFVBQW9CO1FBRDFFLGlCQWtCQztRQWhCQyxJQUFJLFlBQVksR0FBRyxnQkFBUyxDQUFDLFFBQVEsQ0FBQztZQUNmLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUNwQixVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLENBQUMsRUFDRCxFQUFFLENBQUM7WUFDUCxFQUFFLENBQUM7UUFFMUIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQ3pCLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMxRSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCw2QkFBZ0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUNaLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsRUFBcEQsQ0FBb0QsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFFRCxvQ0FBWSxHQUFaLFVBQWEsUUFBZ0MsRUFBRSxRQUFnQyxFQUNsRSxlQUFnQyxFQUFFLFVBQW9CO1FBQ2pFLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN2RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFN0QsRUFBRSxDQUFDLENBQUMsd0JBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQ3BDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLFNBQVMsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO2dCQUN0QyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTyxzQ0FBYyxHQUF0QixVQUF1QixTQUEwQixFQUFFLElBQWtCLEVBQUUsSUFBa0IsRUFDbEUsTUFBb0I7UUFDekMsSUFBSSxRQUFRLEdBQUcseUJBQWtCLENBQUMsT0FBTyxDQUNyQyxDQUFDLGNBQU8sQ0FBQyxlQUFlLEVBQUUsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDLENBQUMsRUFBRSxjQUFPLENBQUMsdUJBQVksRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLHVDQUE0QixDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvRSxFQUFFLENBQUMsQ0FBQyxzQ0FBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELEdBQUcsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDdEIsQ0FBQztJQUVPLGlDQUFTLEdBQWpCLFVBQWtCLFNBQTBCLEVBQUUsT0FBcUI7UUFDakUsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLCtCQUFtQixDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxJQUFJLDBCQUFhLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxJQUFJLDBCQUFhLENBQUMsNEJBQTBCLE9BQU8sQ0FBQyxNQUFRLENBQUMsQ0FBQztZQUN0RSxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVPLG9DQUFZLEdBQXBCLFVBQXFCLE1BQW9CLEVBQUUsVUFBb0I7UUFBL0QsaUJBVUM7UUFUQyxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLDZCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFDekIsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQztZQUNyRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RSxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFwSEQsSUFvSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09uSW5pdCwgcHJvdmlkZSwgUmVmbGVjdGl2ZUluamVjdG9yLCBDb21wb25lbnRSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1JvdXRlck91dGxldH0gZnJvbSAnLi9kaXJlY3RpdmVzL3JvdXRlcl9vdXRsZXQnO1xuaW1wb3J0IHtUeXBlLCBpc0JsYW5rLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtcbiAgRXZlbnRFbWl0dGVyLFxuICBPYnNlcnZhYmxlLFxuICBQcm9taXNlV3JhcHBlcixcbiAgT2JzZXJ2YWJsZVdyYXBwZXJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge1N0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1JvdXRlclVybFNlcmlhbGl6ZXJ9IGZyb20gJy4vcm91dGVyX3VybF9zZXJpYWxpemVyJztcbmltcG9ydCB7Q2FuRGVhY3RpdmF0ZX0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7cmVjb2duaXplfSBmcm9tICcuL3JlY29nbml6ZSc7XG5pbXBvcnQge0xvY2F0aW9ufSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9jb21tb24nO1xuaW1wb3J0IHtsaW5rfSBmcm9tICcuL2xpbmsnO1xuXG5pbXBvcnQge1xuICBlcXVhbFNlZ21lbnRzLFxuICByb3V0ZVNlZ21lbnRDb21wb25lbnRGYWN0b3J5LFxuICBSb3V0ZVNlZ21lbnQsXG4gIFVybFRyZWUsXG4gIFJvdXRlVHJlZSxcbiAgcm9vdE5vZGUsXG4gIFRyZWVOb2RlLFxuICBVcmxTZWdtZW50LFxuICBzZXJpYWxpemVSb3V0ZVNlZ21lbnRUcmVlXG59IGZyb20gJy4vc2VnbWVudHMnO1xuaW1wb3J0IHtoYXNMaWZlY3ljbGVIb29rfSBmcm9tICcuL2xpZmVjeWNsZV9yZWZsZWN0b3InO1xuaW1wb3J0IHtERUZBVUxUX09VVExFVF9OQU1FfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXJPdXRsZXRNYXAge1xuICAvKiogQGludGVybmFsICovXG4gIF9vdXRsZXRzOiB7W25hbWU6IHN0cmluZ106IFJvdXRlck91dGxldH0gPSB7fTtcbiAgcmVnaXN0ZXJPdXRsZXQobmFtZTogc3RyaW5nLCBvdXRsZXQ6IFJvdXRlck91dGxldCk6IHZvaWQgeyB0aGlzLl9vdXRsZXRzW25hbWVdID0gb3V0bGV0OyB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICBwcml2YXRlIF9wcmV2VHJlZTogUm91dGVUcmVlO1xuICBwcml2YXRlIF91cmxUcmVlOiBVcmxUcmVlO1xuICBwcml2YXRlIF9sb2NhdGlvblN1YnNjcmlwdGlvbjogYW55O1xuICBwcml2YXRlIF9jaGFuZ2VzOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm9vdENvbXBvbmVudDogT2JqZWN0LCBwcml2YXRlIF9yb290Q29tcG9uZW50VHlwZTogVHlwZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudFJlc29sdmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF91cmxTZXJpYWxpemVyOiBSb3V0ZXJVcmxTZXJpYWxpemVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9yb3V0ZXJPdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCwgcHJpdmF0ZSBfbG9jYXRpb246IExvY2F0aW9uKSB7XG4gICAgdGhpcy5fcHJldlRyZWUgPSB0aGlzLl9jcmVhdGVJbml0aWFsVHJlZSgpO1xuICAgIHRoaXMuX3NldFVwTG9jYXRpb25DaGFuZ2VMaXN0ZW5lcigpO1xuICAgIHRoaXMubmF2aWdhdGVCeVVybCh0aGlzLl9sb2NhdGlvbi5wYXRoKCkpO1xuICB9XG5cbiAgZ2V0IHVybFRyZWUoKTogVXJsVHJlZSB7IHJldHVybiB0aGlzLl91cmxUcmVlOyB9XG5cbiAgbmF2aWdhdGVCeVVybCh1cmw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9uYXZpZ2F0ZSh0aGlzLl91cmxTZXJpYWxpemVyLnBhcnNlKHVybCkpO1xuICB9XG5cbiAgbmF2aWdhdGUoY2hhbmdlczogYW55W10sIHNlZ21lbnQ/OiBSb3V0ZVNlZ21lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fbmF2aWdhdGUodGhpcy5jcmVhdGVVcmxUcmVlKGNoYW5nZXMsIHNlZ21lbnQpKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKTogdm9pZCB7IE9ic2VydmFibGVXcmFwcGVyLmRpc3Bvc2UodGhpcy5fbG9jYXRpb25TdWJzY3JpcHRpb24pOyB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlSW5pdGlhbFRyZWUoKTogUm91dGVUcmVlIHtcbiAgICBsZXQgcm9vdCA9IG5ldyBSb3V0ZVNlZ21lbnQoW25ldyBVcmxTZWdtZW50KFwiXCIsIG51bGwsIG51bGwpXSwgbnVsbCwgREVGQVVMVF9PVVRMRVRfTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm9vdENvbXBvbmVudFR5cGUsIG51bGwpO1xuICAgIHJldHVybiBuZXcgUm91dGVUcmVlKG5ldyBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+KHJvb3QsIFtdKSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRVcExvY2F0aW9uQ2hhbmdlTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fbG9jYXRpb25TdWJzY3JpcHRpb24gPSB0aGlzLl9sb2NhdGlvbi5zdWJzY3JpYmUoXG4gICAgICAgIChjaGFuZ2UpID0+IHsgdGhpcy5fbmF2aWdhdGUodGhpcy5fdXJsU2VyaWFsaXplci5wYXJzZShjaGFuZ2VbJ3VybCddKSk7IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfbmF2aWdhdGUodXJsOiBVcmxUcmVlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5fdXJsVHJlZSA9IHVybDtcbiAgICByZXR1cm4gcmVjb2duaXplKHRoaXMuX2NvbXBvbmVudFJlc29sdmVyLCB0aGlzLl9yb290Q29tcG9uZW50VHlwZSwgdXJsKVxuICAgICAgICAudGhlbihjdXJyVHJlZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBfTG9hZFNlZ21lbnRzKGN1cnJUcmVlLCB0aGlzLl9wcmV2VHJlZSlcbiAgICAgICAgICAgICAgLmxvYWQodGhpcy5fcm91dGVyT3V0bGV0TWFwLCB0aGlzLl9yb290Q29tcG9uZW50KVxuICAgICAgICAgICAgICAudGhlbih1cGRhdGVkID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlZCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fcHJldlRyZWUgPSBjdXJyVHJlZTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2F0aW9uLmdvKHRoaXMuX3VybFNlcmlhbGl6ZXIuc2VyaWFsaXplKHRoaXMuX3VybFRyZWUpKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZXMuZW1pdChudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZVVybFRyZWUoY2hhbmdlczogYW55W10sIHNlZ21lbnQ/OiBSb3V0ZVNlZ21lbnQpOiBVcmxUcmVlIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3ByZXZUcmVlKSkge1xuICAgICAgbGV0IHMgPSBpc1ByZXNlbnQoc2VnbWVudCkgPyBzZWdtZW50IDogdGhpcy5fcHJldlRyZWUucm9vdDtcbiAgICAgIHJldHVybiBsaW5rKHMsIHRoaXMuX3ByZXZUcmVlLCB0aGlzLnVybFRyZWUsIGNoYW5nZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzZXJpYWxpemVVcmwodXJsOiBVcmxUcmVlKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3VybFNlcmlhbGl6ZXIuc2VyaWFsaXplKHVybCk7IH1cblxuICBnZXQgY2hhbmdlcygpOiBPYnNlcnZhYmxlPHZvaWQ+IHsgcmV0dXJuIHRoaXMuX2NoYW5nZXM7IH1cblxuICBnZXQgcm91dGVUcmVlKCk6IFJvdXRlVHJlZSB7IHJldHVybiB0aGlzLl9wcmV2VHJlZTsgfVxufVxuXG5cbmNsYXNzIF9Mb2FkU2VnbWVudHMge1xuICBwcml2YXRlIGRlYWN0aXZhdGlvbnM6IE9iamVjdFtdW10gPSBbXTtcbiAgcHJpdmF0ZSBwZXJmb3JtTXV0YXRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY3VyclRyZWU6IFJvdXRlVHJlZSwgcHJpdmF0ZSBwcmV2VHJlZTogUm91dGVUcmVlKSB7fVxuXG4gIGxvYWQocGFyZW50T3V0bGV0TWFwOiBSb3V0ZXJPdXRsZXRNYXAsIHJvb3RDb21wb25lbnQ6IE9iamVjdCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGxldCBwcmV2Um9vdCA9IGlzUHJlc2VudCh0aGlzLnByZXZUcmVlKSA/IHJvb3ROb2RlKHRoaXMucHJldlRyZWUpIDogbnVsbDtcbiAgICBsZXQgY3VyclJvb3QgPSByb290Tm9kZSh0aGlzLmN1cnJUcmVlKTtcblxuICAgIHJldHVybiB0aGlzLmNhbkRlYWN0aXZhdGUoY3VyclJvb3QsIHByZXZSb290LCBwYXJlbnRPdXRsZXRNYXAsIHJvb3RDb21wb25lbnQpXG4gICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgdGhpcy5wZXJmb3JtTXV0YXRpb24gPSB0cnVlO1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZENoaWxkU2VnbWVudHMoY3VyclJvb3QsIHByZXZSb290LCBwYXJlbnRPdXRsZXRNYXAsIFtyb290Q29tcG9uZW50XSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5EZWFjdGl2YXRlKGN1cnJSb290OiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+LCBwcmV2Um9vdDogVHJlZU5vZGU8Um91dGVTZWdtZW50PixcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCByb290Q29tcG9uZW50OiBPYmplY3QpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICB0aGlzLnBlcmZvcm1NdXRhdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMubG9hZENoaWxkU2VnbWVudHMoY3VyclJvb3QsIHByZXZSb290LCBvdXRsZXRNYXAsIFtyb290Q29tcG9uZW50XSk7XG5cbiAgICBsZXQgYWxsUGF0aHMgPSBQcm9taXNlV3JhcHBlci5hbGwodGhpcy5kZWFjdGl2YXRpb25zLm1hcChyID0+IHRoaXMuY2hlY2tDYW5EZWFjdGl2YXRlUGF0aChyKSkpO1xuICAgIHJldHVybiBhbGxQYXRocy50aGVuKCh2YWx1ZXM6IGJvb2xlYW5bXSkgPT4gdmFsdWVzLmZpbHRlcih2ID0+IHYpLmxlbmd0aCA9PT0gdmFsdWVzLmxlbmd0aCk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQ2FuRGVhY3RpdmF0ZVBhdGgocGF0aDogT2JqZWN0W10pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBsZXQgY3VyciA9IFByb21pc2VXcmFwcGVyLnJlc29sdmUodHJ1ZSk7XG4gICAgZm9yIChsZXQgcCBvZiBMaXN0V3JhcHBlci5yZXZlcnNlZChwYXRoKSkge1xuICAgICAgY3VyciA9IGN1cnIudGhlbihfID0+IHtcbiAgICAgICAgaWYgKGhhc0xpZmVjeWNsZUhvb2soXCJyb3V0ZXJDYW5EZWFjdGl2YXRlXCIsIHApKSB7XG4gICAgICAgICAgcmV0dXJuICg8Q2FuRGVhY3RpdmF0ZT5wKS5yb3V0ZXJDYW5EZWFjdGl2YXRlKHRoaXMucHJldlRyZWUsIHRoaXMuY3VyclRyZWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnI7XG4gIH1cblxuICBwcml2YXRlIGxvYWRDaGlsZFNlZ21lbnRzKGN1cnJOb2RlOiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+LCBwcmV2Tm9kZTogVHJlZU5vZGU8Um91dGVTZWdtZW50PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCwgY29tcG9uZW50czogT2JqZWN0W10pOiB2b2lkIHtcbiAgICBsZXQgcHJldkNoaWxkcmVuID0gaXNQcmVzZW50KHByZXZOb2RlKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2Tm9kZS5jaGlsZHJlbi5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG0sIGMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1bYy52YWx1ZS5vdXRsZXRdID0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge30pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHt9O1xuXG4gICAgY3Vyck5vZGUuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgIHRoaXMubG9hZFNlZ21lbnRzKGMsIHByZXZDaGlsZHJlbltjLnZhbHVlLm91dGxldF0sIG91dGxldE1hcCwgY29tcG9uZW50cyk7XG4gICAgICBTdHJpbmdNYXBXcmFwcGVyLmRlbGV0ZShwcmV2Q2hpbGRyZW4sIGMudmFsdWUub3V0bGV0KTtcbiAgICB9KTtcblxuICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChwcmV2Q2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2LCBrKSA9PiB0aGlzLnVubG9hZE91dGxldChvdXRsZXRNYXAuX291dGxldHNba10sIGNvbXBvbmVudHMpKTtcbiAgfVxuXG4gIGxvYWRTZWdtZW50cyhjdXJyTm9kZTogVHJlZU5vZGU8Um91dGVTZWdtZW50PiwgcHJldk5vZGU6IFRyZWVOb2RlPFJvdXRlU2VnbWVudD4sXG4gICAgICAgICAgICAgICBwYXJlbnRPdXRsZXRNYXA6IFJvdXRlck91dGxldE1hcCwgY29tcG9uZW50czogT2JqZWN0W10pOiB2b2lkIHtcbiAgICBsZXQgY3VyciA9IGN1cnJOb2RlLnZhbHVlO1xuICAgIGxldCBwcmV2ID0gaXNQcmVzZW50KHByZXZOb2RlKSA/IHByZXZOb2RlLnZhbHVlIDogbnVsbDtcbiAgICBsZXQgb3V0bGV0ID0gdGhpcy5nZXRPdXRsZXQocGFyZW50T3V0bGV0TWFwLCBjdXJyTm9kZS52YWx1ZSk7XG5cbiAgICBpZiAoZXF1YWxTZWdtZW50cyhjdXJyLCBwcmV2KSkge1xuICAgICAgdGhpcy5sb2FkQ2hpbGRTZWdtZW50cyhjdXJyTm9kZSwgcHJldk5vZGUsIG91dGxldC5vdXRsZXRNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuY29uY2F0KFtvdXRsZXQubG9hZGVkQ29tcG9uZW50XSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVubG9hZE91dGxldChvdXRsZXQsIGNvbXBvbmVudHMpO1xuICAgICAgaWYgKHRoaXMucGVyZm9ybU11dGF0aW9uKSB7XG4gICAgICAgIGxldCBvdXRsZXRNYXAgPSBuZXcgUm91dGVyT3V0bGV0TWFwKCk7XG4gICAgICAgIGxldCBsb2FkZWRDb21wb25lbnQgPSB0aGlzLmxvYWROZXdTZWdtZW50KG91dGxldE1hcCwgY3VyciwgcHJldiwgb3V0bGV0KTtcbiAgICAgICAgdGhpcy5sb2FkQ2hpbGRTZWdtZW50cyhjdXJyTm9kZSwgcHJldk5vZGUsIG91dGxldE1hcCwgY29tcG9uZW50cy5jb25jYXQoW2xvYWRlZENvbXBvbmVudF0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvYWROZXdTZWdtZW50KG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCBjdXJyOiBSb3V0ZVNlZ21lbnQsIHByZXY6IFJvdXRlU2VnbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6IFJvdXRlck91dGxldCk6IE9iamVjdCB7XG4gICAgbGV0IHJlc29sdmVkID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUoXG4gICAgICAgIFtwcm92aWRlKFJvdXRlck91dGxldE1hcCwge3VzZVZhbHVlOiBvdXRsZXRNYXB9KSwgcHJvdmlkZShSb3V0ZVNlZ21lbnQsIHt1c2VWYWx1ZTogY3Vycn0pXSk7XG4gICAgbGV0IHJlZiA9IG91dGxldC5sb2FkKHJvdXRlU2VnbWVudENvbXBvbmVudEZhY3RvcnkoY3VyciksIHJlc29sdmVkLCBvdXRsZXRNYXApO1xuICAgIGlmIChoYXNMaWZlY3ljbGVIb29rKFwicm91dGVyT25BY3RpdmF0ZVwiLCByZWYuaW5zdGFuY2UpKSB7XG4gICAgICByZWYuaW5zdGFuY2Uucm91dGVyT25BY3RpdmF0ZShjdXJyLCBwcmV2LCB0aGlzLmN1cnJUcmVlLCB0aGlzLnByZXZUcmVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0T3V0bGV0KG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCBzZWdtZW50OiBSb3V0ZVNlZ21lbnQpOiBSb3V0ZXJPdXRsZXQge1xuICAgIGxldCBvdXRsZXQgPSBvdXRsZXRNYXAuX291dGxldHNbc2VnbWVudC5vdXRsZXRdO1xuICAgIGlmIChpc0JsYW5rKG91dGxldCkpIHtcbiAgICAgIGlmIChzZWdtZW50Lm91dGxldCA9PSBERUZBVUxUX09VVExFVF9OQU1FKSB7XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBDYW5ub3QgZmluZCBkZWZhdWx0IG91dGxldGApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYENhbm5vdCBmaW5kIHRoZSBvdXRsZXQgJHtzZWdtZW50Lm91dGxldH1gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dGxldDtcbiAgfVxuXG4gIHByaXZhdGUgdW5sb2FkT3V0bGV0KG91dGxldDogUm91dGVyT3V0bGV0LCBjb21wb25lbnRzOiBPYmplY3RbXSk6IHZvaWQge1xuICAgIGlmIChpc1ByZXNlbnQob3V0bGV0KSAmJiBvdXRsZXQuaXNMb2FkZWQpIHtcbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChvdXRsZXQub3V0bGV0TWFwLl9vdXRsZXRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2LCBrKSA9PiB0aGlzLnVubG9hZE91dGxldCh2LCBjb21wb25lbnRzKSk7XG4gICAgICBpZiAodGhpcy5wZXJmb3JtTXV0YXRpb24pIHtcbiAgICAgICAgb3V0bGV0LnVubG9hZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRpb25zLnB1c2goY29tcG9uZW50cy5jb25jYXQoW291dGxldC5sb2FkZWRDb21wb25lbnRdKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59Il19