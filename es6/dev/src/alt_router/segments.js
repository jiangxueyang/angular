import { StringMapWrapper, ListWrapper } from 'angular2/src/facade/collection';
import { isBlank, isPresent, stringify } from 'angular2/src/facade/lang';
export class Tree {
    constructor(root) {
        this._root = root;
    }
    get root() { return this._root.value; }
    parent(t) {
        let p = this.pathFromRoot(t);
        return p.length > 1 ? p[p.length - 2] : null;
    }
    children(t) {
        let n = _findNode(t, this._root);
        return isPresent(n) ? n.children.map(t => t.value) : null;
    }
    firstChild(t) {
        let n = _findNode(t, this._root);
        return isPresent(n) && n.children.length > 0 ? n.children[0].value : null;
    }
    pathFromRoot(t) { return _findPath(t, this._root, []).map(s => s.value); }
}
export class UrlTree extends Tree {
    constructor(root) {
        super(root);
    }
}
export class RouteTree extends Tree {
    constructor(root) {
        super(root);
    }
}
export function rootNode(tree) {
    return tree._root;
}
function _findNode(expected, c) {
    // TODO: vsavkin remove it once recognize is fixed
    if (expected instanceof RouteSegment && equalSegments(expected, c.value))
        return c;
    if (expected === c.value)
        return c;
    for (let cc of c.children) {
        let r = _findNode(expected, cc);
        if (isPresent(r))
            return r;
    }
    return null;
}
function _findPath(expected, c, collected) {
    collected.push(c);
    // TODO: vsavkin remove it once recognize is fixed
    if (expected instanceof RouteSegment && equalSegments(expected, c.value))
        return collected;
    if (expected === c.value)
        return collected;
    for (let cc of c.children) {
        let r = _findPath(expected, cc, ListWrapper.clone(collected));
        if (isPresent(r))
            return r;
    }
    return null;
}
export class TreeNode {
    constructor(value, children) {
        this.value = value;
        this.children = children;
    }
}
export class UrlSegment {
    constructor(segment, parameters, outlet) {
        this.segment = segment;
        this.parameters = parameters;
        this.outlet = outlet;
    }
    toString() {
        let outletPrefix = isBlank(this.outlet) ? "" : `${this.outlet}:`;
        let segmentPrefix = isBlank(this.segment) ? "" : this.segment;
        return `${outletPrefix}${segmentPrefix}${_serializeParams(this.parameters)}`;
    }
}
function _serializeParams(params) {
    let res = "";
    if (isPresent(params)) {
        StringMapWrapper.forEach(params, (v, k) => res += `;${k}=${v}`);
    }
    return res;
}
export class RouteSegment {
    constructor(urlSegments, parameters, outlet, type, componentFactory) {
        this.urlSegments = urlSegments;
        this.parameters = parameters;
        this.outlet = outlet;
        this._type = type;
        this._componentFactory = componentFactory;
    }
    getParam(param) {
        return isPresent(this.parameters) ? this.parameters[param] : null;
    }
    get type() { return this._type; }
    get stringifiedUrlSegments() { return this.urlSegments.map(s => s.toString()).join("/"); }
}
export function serializeRouteSegmentTree(tree) {
    return _serializeRouteSegmentTree(tree._root);
}
function _serializeRouteSegmentTree(node) {
    let v = node.value;
    let children = node.children.map(c => _serializeRouteSegmentTree(c)).join(", ");
    return `${v.outlet}:${v.stringifiedUrlSegments}(${stringify(v.type)}) [${children}]`;
}
export function equalSegments(a, b) {
    if (isBlank(a) && !isBlank(b))
        return false;
    if (!isBlank(a) && isBlank(b))
        return false;
    if (a._type !== b._type)
        return false;
    if (isBlank(a.parameters) && !isBlank(b.parameters))
        return false;
    if (!isBlank(a.parameters) && isBlank(b.parameters))
        return false;
    if (isBlank(a.parameters) && isBlank(b.parameters))
        return true;
    return StringMapWrapper.equals(a.parameters, b.parameters);
}
export function routeSegmentComponentFactory(a) {
    return a._componentFactory;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VnbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLVMzaXhRcHNzLnRtcC9hbmd1bGFyMi9zcmMvYWx0X3JvdXRlci9zZWdtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxFQUFDLGdCQUFnQixFQUFFLFdBQVcsRUFBQyxNQUFNLGdDQUFnQztPQUNyRSxFQUFPLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sMEJBQTBCO0FBRTVFO0lBSUUsWUFBWSxJQUFpQjtRQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQUMsQ0FBQztJQUVyRCxJQUFJLElBQUksS0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRTFDLE1BQU0sQ0FBQyxDQUFJO1FBQ1QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQy9DLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBSTtRQUNYLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDNUQsQ0FBQztJQUVELFVBQVUsQ0FBQyxDQUFJO1FBQ2IsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsTUFB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RSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNsRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVELDZDQUE2QyxDQUFlO0lBQzFELE1BQU0sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7QUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50RmFjdG9yeX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1N0cmluZ01hcFdyYXBwZXIsIExpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtUeXBlLCBpc0JsYW5rLCBpc1ByZXNlbnQsIHN0cmluZ2lmeX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuZXhwb3J0IGNsYXNzIFRyZWU8VD4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9yb290OiBUcmVlTm9kZTxUPjtcblxuICBjb25zdHJ1Y3Rvcihyb290OiBUcmVlTm9kZTxUPikgeyB0aGlzLl9yb290ID0gcm9vdDsgfVxuXG4gIGdldCByb290KCk6IFQgeyByZXR1cm4gdGhpcy5fcm9vdC52YWx1ZTsgfVxuXG4gIHBhcmVudCh0OiBUKTogVCB7XG4gICAgbGV0IHAgPSB0aGlzLnBhdGhGcm9tUm9vdCh0KTtcbiAgICByZXR1cm4gcC5sZW5ndGggPiAxID8gcFtwLmxlbmd0aCAtIDJdIDogbnVsbDtcbiAgfVxuXG4gIGNoaWxkcmVuKHQ6IFQpOiBUW10ge1xuICAgIGxldCBuID0gX2ZpbmROb2RlKHQsIHRoaXMuX3Jvb3QpO1xuICAgIHJldHVybiBpc1ByZXNlbnQobikgPyBuLmNoaWxkcmVuLm1hcCh0ID0+IHQudmFsdWUpIDogbnVsbDtcbiAgfVxuXG4gIGZpcnN0Q2hpbGQodDogVCk6IFQge1xuICAgIGxldCBuID0gX2ZpbmROb2RlKHQsIHRoaXMuX3Jvb3QpO1xuICAgIHJldHVybiBpc1ByZXNlbnQobikgJiYgbi5jaGlsZHJlbi5sZW5ndGggPiAwID8gbi5jaGlsZHJlblswXS52YWx1ZSA6IG51bGw7XG4gIH1cblxuICBwYXRoRnJvbVJvb3QodDogVCk6IFRbXSB7IHJldHVybiBfZmluZFBhdGgodCwgdGhpcy5fcm9vdCwgW10pLm1hcChzID0+IHMudmFsdWUpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBVcmxUcmVlIGV4dGVuZHMgVHJlZTxVcmxTZWdtZW50PiB7XG4gIGNvbnN0cnVjdG9yKHJvb3Q6IFRyZWVOb2RlPFVybFNlZ21lbnQ+KSB7IHN1cGVyKHJvb3QpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZVRyZWUgZXh0ZW5kcyBUcmVlPFJvdXRlU2VnbWVudD4ge1xuICBjb25zdHJ1Y3Rvcihyb290OiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+KSB7IHN1cGVyKHJvb3QpOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByb290Tm9kZTxUPih0cmVlOiBUcmVlPFQ+KTogVHJlZU5vZGU8VD4ge1xuICByZXR1cm4gdHJlZS5fcm9vdDtcbn1cblxuZnVuY3Rpb24gX2ZpbmROb2RlPFQ+KGV4cGVjdGVkOiBULCBjOiBUcmVlTm9kZTxUPik6IFRyZWVOb2RlPFQ+IHtcbiAgLy8gVE9ETzogdnNhdmtpbiByZW1vdmUgaXQgb25jZSByZWNvZ25pemUgaXMgZml4ZWRcbiAgaWYgKGV4cGVjdGVkIGluc3RhbmNlb2YgUm91dGVTZWdtZW50ICYmIGVxdWFsU2VnbWVudHMoPGFueT5leHBlY3RlZCwgPGFueT5jLnZhbHVlKSkgcmV0dXJuIGM7XG4gIGlmIChleHBlY3RlZCA9PT0gYy52YWx1ZSkgcmV0dXJuIGM7XG4gIGZvciAobGV0IGNjIG9mIGMuY2hpbGRyZW4pIHtcbiAgICBsZXQgciA9IF9maW5kTm9kZShleHBlY3RlZCwgY2MpO1xuICAgIGlmIChpc1ByZXNlbnQocikpIHJldHVybiByO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBfZmluZFBhdGg8VD4oZXhwZWN0ZWQ6IFQsIGM6IFRyZWVOb2RlPFQ+LCBjb2xsZWN0ZWQ6IFRyZWVOb2RlPFQ+W10pOiBUcmVlTm9kZTxUPltdIHtcbiAgY29sbGVjdGVkLnB1c2goYyk7XG5cbiAgLy8gVE9ETzogdnNhdmtpbiByZW1vdmUgaXQgb25jZSByZWNvZ25pemUgaXMgZml4ZWRcbiAgaWYgKGV4cGVjdGVkIGluc3RhbmNlb2YgUm91dGVTZWdtZW50ICYmIGVxdWFsU2VnbWVudHMoPGFueT5leHBlY3RlZCwgPGFueT5jLnZhbHVlKSlcbiAgICByZXR1cm4gY29sbGVjdGVkO1xuICBpZiAoZXhwZWN0ZWQgPT09IGMudmFsdWUpIHJldHVybiBjb2xsZWN0ZWQ7XG4gIGZvciAobGV0IGNjIG9mIGMuY2hpbGRyZW4pIHtcbiAgICBsZXQgciA9IF9maW5kUGF0aChleHBlY3RlZCwgY2MsIExpc3RXcmFwcGVyLmNsb25lKGNvbGxlY3RlZCkpO1xuICAgIGlmIChpc1ByZXNlbnQocikpIHJldHVybiByO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBjbGFzcyBUcmVlTm9kZTxUPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogVCwgcHVibGljIGNoaWxkcmVuOiBUcmVlTm9kZTxUPltdKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVXJsU2VnbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzZWdtZW50OiBhbnksIHB1YmxpYyBwYXJhbWV0ZXJzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSxcbiAgICAgICAgICAgICAgcHVibGljIG91dGxldDogc3RyaW5nKSB7fVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgbGV0IG91dGxldFByZWZpeCA9IGlzQmxhbmsodGhpcy5vdXRsZXQpID8gXCJcIiA6IGAke3RoaXMub3V0bGV0fTpgO1xuICAgIGxldCBzZWdtZW50UHJlZml4ID0gaXNCbGFuayh0aGlzLnNlZ21lbnQpID8gXCJcIiA6IHRoaXMuc2VnbWVudDtcbiAgICByZXR1cm4gYCR7b3V0bGV0UHJlZml4fSR7c2VnbWVudFByZWZpeH0ke19zZXJpYWxpemVQYXJhbXModGhpcy5wYXJhbWV0ZXJzKX1gO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9zZXJpYWxpemVQYXJhbXMocGFyYW1zOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IHN0cmluZyB7XG4gIGxldCByZXMgPSBcIlwiO1xuICBpZiAoaXNQcmVzZW50KHBhcmFtcykpIHtcbiAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2gocGFyYW1zLCAodiwgaykgPT4gcmVzICs9IGA7JHtrfT0ke3Z9YCk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNsYXNzIFJvdXRlU2VnbWVudCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3R5cGU6IFR5cGU7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB1cmxTZWdtZW50czogVXJsU2VnbWVudFtdLCBwdWJsaWMgcGFyYW1ldGVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sXG4gICAgICAgICAgICAgIHB1YmxpYyBvdXRsZXQ6IHN0cmluZywgdHlwZTogVHlwZSwgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxhbnk+KSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5fY29tcG9uZW50RmFjdG9yeSA9IGNvbXBvbmVudEZhY3Rvcnk7XG4gIH1cblxuICBnZXRQYXJhbShwYXJhbTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaXNQcmVzZW50KHRoaXMucGFyYW1ldGVycykgPyB0aGlzLnBhcmFtZXRlcnNbcGFyYW1dIDogbnVsbDtcbiAgfVxuXG4gIGdldCB0eXBlKCk6IFR5cGUgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxuXG4gIGdldCBzdHJpbmdpZmllZFVybFNlZ21lbnRzKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnVybFNlZ21lbnRzLm1hcChzID0+IHMudG9TdHJpbmcoKSkuam9pbihcIi9cIik7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZVJvdXRlU2VnbWVudFRyZWUodHJlZTogUm91dGVUcmVlKTogc3RyaW5nIHtcbiAgcmV0dXJuIF9zZXJpYWxpemVSb3V0ZVNlZ21lbnRUcmVlKHRyZWUuX3Jvb3QpO1xufVxuXG5mdW5jdGlvbiBfc2VyaWFsaXplUm91dGVTZWdtZW50VHJlZShub2RlOiBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+KTogc3RyaW5nIHtcbiAgbGV0IHYgPSBub2RlLnZhbHVlO1xuICBsZXQgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuLm1hcChjID0+IF9zZXJpYWxpemVSb3V0ZVNlZ21lbnRUcmVlKGMpKS5qb2luKFwiLCBcIik7XG4gIHJldHVybiBgJHt2Lm91dGxldH06JHt2LnN0cmluZ2lmaWVkVXJsU2VnbWVudHN9KCR7c3RyaW5naWZ5KHYudHlwZSl9KSBbJHtjaGlsZHJlbn1dYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsU2VnbWVudHMoYTogUm91dGVTZWdtZW50LCBiOiBSb3V0ZVNlZ21lbnQpOiBib29sZWFuIHtcbiAgaWYgKGlzQmxhbmsoYSkgJiYgIWlzQmxhbmsoYikpIHJldHVybiBmYWxzZTtcbiAgaWYgKCFpc0JsYW5rKGEpICYmIGlzQmxhbmsoYikpIHJldHVybiBmYWxzZTtcbiAgaWYgKGEuX3R5cGUgIT09IGIuX3R5cGUpIHJldHVybiBmYWxzZTtcbiAgaWYgKGlzQmxhbmsoYS5wYXJhbWV0ZXJzKSAmJiAhaXNCbGFuayhiLnBhcmFtZXRlcnMpKSByZXR1cm4gZmFsc2U7XG4gIGlmICghaXNCbGFuayhhLnBhcmFtZXRlcnMpICYmIGlzQmxhbmsoYi5wYXJhbWV0ZXJzKSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoaXNCbGFuayhhLnBhcmFtZXRlcnMpICYmIGlzQmxhbmsoYi5wYXJhbWV0ZXJzKSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBTdHJpbmdNYXBXcmFwcGVyLmVxdWFscyhhLnBhcmFtZXRlcnMsIGIucGFyYW1ldGVycyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByb3V0ZVNlZ21lbnRDb21wb25lbnRGYWN0b3J5KGE6IFJvdXRlU2VnbWVudCk6IENvbXBvbmVudEZhY3Rvcnk8YW55PiB7XG4gIHJldHVybiBhLl9jb21wb25lbnRGYWN0b3J5O1xufSJdfQ==