import { RouteSegment, TreeNode, rootNode, RouteTree } from './segments';
import { RoutesMetadata } from './metadata/metadata';
import { isBlank, isPresent, stringify } from 'angular2/src/facade/lang';
import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { PromiseWrapper } from 'angular2/src/facade/promise';
import { BaseException } from 'angular2/src/facade/exceptions';
import { DEFAULT_OUTLET_NAME } from './constants';
import { reflector } from 'angular2/src/core/reflection/reflection';
// TODO: vsavkin: recognize should take the old tree and merge it
export function recognize(componentResolver, type, url) {
    let matched = new _MatchResult(type, [url.root], null, rootNode(url).children, []);
    return _constructSegment(componentResolver, matched).then(roots => new RouteTree(roots[0]));
}
function _recognize(componentResolver, parentType, url) {
    let metadata = _readMetadata(parentType); // should read from the factory instead
    if (isBlank(metadata)) {
        throw new BaseException(`Component '${stringify(parentType)}' does not have route configuration`);
    }
    let match;
    try {
        match = _match(metadata, url);
    }
    catch (e) {
        return PromiseWrapper.reject(e, null);
    }
    let main = _constructSegment(componentResolver, match);
    let aux = _recognizeMany(componentResolver, parentType, match.aux).then(_checkOutletNameUniqueness);
    return PromiseWrapper.all([main, aux]).then(ListWrapper.flatten);
}
function _recognizeMany(componentResolver, parentType, urls) {
    let recognized = urls.map(u => _recognize(componentResolver, parentType, u));
    return PromiseWrapper.all(recognized).then(ListWrapper.flatten);
}
function _constructSegment(componentResolver, matched) {
    return componentResolver.resolveComponent(matched.component)
        .then(factory => {
        let urlOutlet = matched.consumedUrlSegments.length === 0 ||
            isBlank(matched.consumedUrlSegments[0].outlet) ?
            DEFAULT_OUTLET_NAME :
            matched.consumedUrlSegments[0].outlet;
        let segment = new RouteSegment(matched.consumedUrlSegments, matched.parameters, urlOutlet, matched.component, factory);
        if (matched.leftOverUrl.length > 0) {
            return _recognizeMany(componentResolver, matched.component, matched.leftOverUrl)
                .then(children => [new TreeNode(segment, children)]);
        }
        else {
            return _recognizeLeftOvers(componentResolver, matched.component)
                .then(children => [new TreeNode(segment, children)]);
        }
    });
}
function _recognizeLeftOvers(componentResolver, parentType) {
    return componentResolver.resolveComponent(parentType)
        .then(factory => {
        let metadata = _readMetadata(parentType);
        if (isBlank(metadata)) {
            return [];
        }
        let r = metadata.routes.filter(r => r.path == "" || r.path == "/");
        if (r.length === 0) {
            return PromiseWrapper.resolve([]);
        }
        else {
            return _recognizeLeftOvers(componentResolver, r[0].component)
                .then(children => {
                return componentResolver.resolveComponent(r[0].component)
                    .then(factory => {
                    let segment = new RouteSegment([], null, DEFAULT_OUTLET_NAME, r[0].component, factory);
                    return [new TreeNode(segment, children)];
                });
            });
        }
    });
}
function _match(metadata, url) {
    for (let r of metadata.routes) {
        let matchingResult = _matchWithParts(r, url);
        if (isPresent(matchingResult)) {
            return matchingResult;
        }
    }
    let availableRoutes = metadata.routes.map(r => `'${r.path}'`).join(", ");
    throw new BaseException(`Cannot match any routes. Current segment: '${url.value}'. Available routes: [${availableRoutes}].`);
}
function _matchWithParts(route, url) {
    let path = route.path.startsWith("/") ? route.path.substring(1) : route.path;
    if (path == "*") {
        return new _MatchResult(route.component, [], null, [], []);
    }
    let parts = path.split("/");
    let positionalParams = {};
    let consumedUrlSegments = [];
    let lastParent = null;
    let lastSegment = null;
    let current = url;
    for (let i = 0; i < parts.length; ++i) {
        if (isBlank(current))
            return null;
        let p = parts[i];
        let isLastSegment = i === parts.length - 1;
        let isLastParent = i === parts.length - 2;
        let isPosParam = p.startsWith(":");
        if (!isPosParam && p != current.value.segment)
            return null;
        if (isLastSegment) {
            lastSegment = current;
        }
        if (isLastParent) {
            lastParent = current;
        }
        if (isPosParam) {
            positionalParams[p.substring(1)] = current.value.segment;
        }
        consumedUrlSegments.push(current.value);
        current = ListWrapper.first(current.children);
    }
    if (isPresent(current) && isBlank(current.value.segment)) {
        lastParent = lastSegment;
        lastSegment = current;
    }
    let p = lastSegment.value.parameters;
    let parameters = StringMapWrapper.merge(isBlank(p) ? {} : p, positionalParams);
    let axuUrlSubtrees = isPresent(lastParent) ? lastParent.children.slice(1) : [];
    return new _MatchResult(route.component, consumedUrlSegments, parameters, lastSegment.children, axuUrlSubtrees);
}
function _checkOutletNameUniqueness(nodes) {
    let names = {};
    nodes.forEach(n => {
        let segmentWithSameOutletName = names[n.value.outlet];
        if (isPresent(segmentWithSameOutletName)) {
            let p = segmentWithSameOutletName.stringifiedUrlSegments;
            let c = n.value.stringifiedUrlSegments;
            throw new BaseException(`Two segments cannot have the same outlet name: '${p}' and '${c}'.`);
        }
        names[n.value.outlet] = n.value;
    });
    return nodes;
}
class _MatchResult {
    constructor(component, consumedUrlSegments, parameters, leftOverUrl, aux) {
        this.component = component;
        this.consumedUrlSegments = consumedUrlSegments;
        this.parameters = parameters;
        this.leftOverUrl = leftOverUrl;
        this.aux = aux;
    }
}
function _readMetadata(componentType) {
    let metadata = reflector.annotations(componentType).filter(f => f instanceof RoutesMetadata);
    return ListWrapper.first(metadata);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb2duaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1TM2l4UXBzcy50bXAvYW5ndWxhcjIvc3JjL2FsdF9yb3V0ZXIvcmVjb2duaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsWUFBWSxFQUFvQixRQUFRLEVBQUUsUUFBUSxFQUFXLFNBQVMsRUFBQyxNQUFNLFlBQVk7T0FDMUYsRUFBQyxjQUFjLEVBQWdCLE1BQU0scUJBQXFCO09BQzFELEVBQU8sT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSwwQkFBMEI7T0FDckUsRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDckUsRUFBQyxjQUFjLEVBQUMsTUFBTSw2QkFBNkI7T0FDbkQsRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7T0FFckQsRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGFBQWE7T0FDeEMsRUFBQyxTQUFTLEVBQUMsTUFBTSx5Q0FBeUM7QUFFakUsaUVBQWlFO0FBQ2pFLDBCQUEwQixpQkFBb0MsRUFBRSxJQUFVLEVBQ2hELEdBQVk7SUFDcEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25GLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQUVELG9CQUFvQixpQkFBb0MsRUFBRSxVQUFnQixFQUN0RCxHQUF5QjtJQUMzQyxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsVUFB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QUMsc0JBQXNCLENBQUM7WUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztZQUN2QyxNQUFNLElBQUksYUFBYSxDQUFDLG1EQUFtRCxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRixDQUFDO1FBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQ7SUFDRSxZQUFtQixTQUFlLEVBQVMsbUJBQWlDLEVBQ3pELFVBQW1DLEVBQ25DLFdBQW1DLEVBQVMsR0FBMkI7UUFGdkUsY0FBUyxHQUFULFNBQVMsQ0FBTTtRQUFTLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBYztRQUN6RCxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNuQyxnQkFBVyxHQUFYLFdBQVcsQ0FBd0I7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUF3QjtJQUFHLENBQUM7QUFDaEcsQ0FBQztBQUVELHVCQUF1QixhQUFtQjtJQUN4QyxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLGNBQWMsQ0FBQyxDQUFDO0lBQzdGLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JvdXRlU2VnbWVudCwgVXJsU2VnbWVudCwgVHJlZSwgVHJlZU5vZGUsIHJvb3ROb2RlLCBVcmxUcmVlLCBSb3V0ZVRyZWV9IGZyb20gJy4vc2VnbWVudHMnO1xuaW1wb3J0IHtSb3V0ZXNNZXRhZGF0YSwgUm91dGVNZXRhZGF0YX0gZnJvbSAnLi9tZXRhZGF0YS9tZXRhZGF0YSc7XG5pbXBvcnQge1R5cGUsIGlzQmxhbmssIGlzUHJlc2VudCwgc3RyaW5naWZ5fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7UHJvbWlzZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvcHJvbWlzZSc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0NvbXBvbmVudFJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7REVGQVVMVF9PVVRMRVRfTkFNRX0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtyZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5cbi8vIFRPRE86IHZzYXZraW46IHJlY29nbml6ZSBzaG91bGQgdGFrZSB0aGUgb2xkIHRyZWUgYW5kIG1lcmdlIGl0XG5leHBvcnQgZnVuY3Rpb24gcmVjb2duaXplKGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRSZXNvbHZlciwgdHlwZTogVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBVcmxUcmVlKTogUHJvbWlzZTxSb3V0ZVRyZWU+IHtcbiAgbGV0IG1hdGNoZWQgPSBuZXcgX01hdGNoUmVzdWx0KHR5cGUsIFt1cmwucm9vdF0sIG51bGwsIHJvb3ROb2RlKHVybCkuY2hpbGRyZW4sIFtdKTtcbiAgcmV0dXJuIF9jb25zdHJ1Y3RTZWdtZW50KGNvbXBvbmVudFJlc29sdmVyLCBtYXRjaGVkKS50aGVuKHJvb3RzID0+IG5ldyBSb3V0ZVRyZWUocm9vdHNbMF0pKTtcbn1cblxuZnVuY3Rpb24gX3JlY29nbml6ZShjb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50UmVzb2x2ZXIsIHBhcmVudFR5cGU6IFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHVybDogVHJlZU5vZGU8VXJsU2VnbWVudD4pOiBQcm9taXNlPFRyZWVOb2RlPFJvdXRlU2VnbWVudD5bXT4ge1xuICBsZXQgbWV0YWRhdGEgPSBfcmVhZE1ldGFkYXRhKHBhcmVudFR5cGUpOyAgLy8gc2hvdWxkIHJlYWQgZnJvbSB0aGUgZmFjdG9yeSBpbnN0ZWFkXG4gIGlmIChpc0JsYW5rKG1ldGFkYXRhKSkge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICBgQ29tcG9uZW50ICcke3N0cmluZ2lmeShwYXJlbnRUeXBlKX0nIGRvZXMgbm90IGhhdmUgcm91dGUgY29uZmlndXJhdGlvbmApO1xuICB9XG5cbiAgbGV0IG1hdGNoO1xuICB0cnkge1xuICAgIG1hdGNoID0gX21hdGNoKG1ldGFkYXRhLCB1cmwpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLnJlamVjdChlLCBudWxsKTtcbiAgfVxuXG4gIGxldCBtYWluID0gX2NvbnN0cnVjdFNlZ21lbnQoY29tcG9uZW50UmVzb2x2ZXIsIG1hdGNoKTtcbiAgbGV0IGF1eCA9XG4gICAgICBfcmVjb2duaXplTWFueShjb21wb25lbnRSZXNvbHZlciwgcGFyZW50VHlwZSwgbWF0Y2guYXV4KS50aGVuKF9jaGVja091dGxldE5hbWVVbmlxdWVuZXNzKTtcbiAgcmV0dXJuIFByb21pc2VXcmFwcGVyLmFsbChbbWFpbiwgYXV4XSkudGhlbihMaXN0V3JhcHBlci5mbGF0dGVuKTtcbn1cblxuZnVuY3Rpb24gX3JlY29nbml6ZU1hbnkoY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudFJlc29sdmVyLCBwYXJlbnRUeXBlOiBUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsczogVHJlZU5vZGU8VXJsU2VnbWVudD5bXSk6IFByb21pc2U8VHJlZU5vZGU8Um91dGVTZWdtZW50PltdPiB7XG4gIGxldCByZWNvZ25pemVkID0gdXJscy5tYXAodSA9PiBfcmVjb2duaXplKGNvbXBvbmVudFJlc29sdmVyLCBwYXJlbnRUeXBlLCB1KSk7XG4gIHJldHVybiBQcm9taXNlV3JhcHBlci5hbGwocmVjb2duaXplZCkudGhlbihMaXN0V3JhcHBlci5mbGF0dGVuKTtcbn1cblxuZnVuY3Rpb24gX2NvbnN0cnVjdFNlZ21lbnQoY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudFJlc29sdmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZDogX01hdGNoUmVzdWx0KTogUHJvbWlzZTxUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+W10+IHtcbiAgcmV0dXJuIGNvbXBvbmVudFJlc29sdmVyLnJlc29sdmVDb21wb25lbnQobWF0Y2hlZC5jb21wb25lbnQpXG4gICAgICAudGhlbihmYWN0b3J5ID0+IHtcbiAgICAgICAgbGV0IHVybE91dGxldCA9IG1hdGNoZWQuY29uc3VtZWRVcmxTZWdtZW50cy5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNCbGFuayhtYXRjaGVkLmNvbnN1bWVkVXJsU2VnbWVudHNbMF0ub3V0bGV0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9PVVRMRVRfTkFNRSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZC5jb25zdW1lZFVybFNlZ21lbnRzWzBdLm91dGxldDtcblxuICAgICAgICBsZXQgc2VnbWVudCA9IG5ldyBSb3V0ZVNlZ21lbnQobWF0Y2hlZC5jb25zdW1lZFVybFNlZ21lbnRzLCBtYXRjaGVkLnBhcmFtZXRlcnMsIHVybE91dGxldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWQuY29tcG9uZW50LCBmYWN0b3J5KTtcblxuICAgICAgICBpZiAobWF0Y2hlZC5sZWZ0T3ZlclVybC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZWNvZ25pemVNYW55KGNvbXBvbmVudFJlc29sdmVyLCBtYXRjaGVkLmNvbXBvbmVudCwgbWF0Y2hlZC5sZWZ0T3ZlclVybClcbiAgICAgICAgICAgICAgLnRoZW4oY2hpbGRyZW4gPT4gW25ldyBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+KHNlZ21lbnQsIGNoaWxkcmVuKV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfcmVjb2duaXplTGVmdE92ZXJzKGNvbXBvbmVudFJlc29sdmVyLCBtYXRjaGVkLmNvbXBvbmVudClcbiAgICAgICAgICAgICAgLnRoZW4oY2hpbGRyZW4gPT4gW25ldyBUcmVlTm9kZTxSb3V0ZVNlZ21lbnQ+KHNlZ21lbnQsIGNoaWxkcmVuKV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbn1cblxuZnVuY3Rpb24gX3JlY29nbml6ZUxlZnRPdmVycyhjb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50UmVzb2x2ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFR5cGU6IFR5cGUpOiBQcm9taXNlPFRyZWVOb2RlPFJvdXRlU2VnbWVudD5bXT4ge1xuICByZXR1cm4gY29tcG9uZW50UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudChwYXJlbnRUeXBlKVxuICAgICAgLnRoZW4oZmFjdG9yeSA9PiB7XG4gICAgICAgIGxldCBtZXRhZGF0YSA9IF9yZWFkTWV0YWRhdGEocGFyZW50VHlwZSk7XG4gICAgICAgIGlmIChpc0JsYW5rKG1ldGFkYXRhKSkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByID0gKDxhbnlbXT5tZXRhZGF0YS5yb3V0ZXMpLmZpbHRlcihyID0+IHIucGF0aCA9PSBcIlwiIHx8IHIucGF0aCA9PSBcIi9cIik7XG4gICAgICAgIGlmIChyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5yZXNvbHZlKFtdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gX3JlY29nbml6ZUxlZnRPdmVycyhjb21wb25lbnRSZXNvbHZlciwgclswXS5jb21wb25lbnQpXG4gICAgICAgICAgICAgIC50aGVuKGNoaWxkcmVuID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudChyWzBdLmNvbXBvbmVudClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZmFjdG9yeSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHNlZ21lbnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUm91dGVTZWdtZW50KFtdLCBudWxsLCBERUZBVUxUX09VVExFVF9OQU1FLCByWzBdLmNvbXBvbmVudCwgZmFjdG9yeSk7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtuZXcgVHJlZU5vZGU8Um91dGVTZWdtZW50PihzZWdtZW50LCBjaGlsZHJlbildO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBfbWF0Y2gobWV0YWRhdGE6IFJvdXRlc01ldGFkYXRhLCB1cmw6IFRyZWVOb2RlPFVybFNlZ21lbnQ+KTogX01hdGNoUmVzdWx0IHtcbiAgZm9yIChsZXQgciBvZiBtZXRhZGF0YS5yb3V0ZXMpIHtcbiAgICBsZXQgbWF0Y2hpbmdSZXN1bHQgPSBfbWF0Y2hXaXRoUGFydHMociwgdXJsKTtcbiAgICBpZiAoaXNQcmVzZW50KG1hdGNoaW5nUmVzdWx0KSkge1xuICAgICAgcmV0dXJuIG1hdGNoaW5nUmVzdWx0O1xuICAgIH1cbiAgfVxuICBsZXQgYXZhaWxhYmxlUm91dGVzID0gbWV0YWRhdGEucm91dGVzLm1hcChyID0+IGAnJHtyLnBhdGh9J2ApLmpvaW4oXCIsIFwiKTtcbiAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICBgQ2Fubm90IG1hdGNoIGFueSByb3V0ZXMuIEN1cnJlbnQgc2VnbWVudDogJyR7dXJsLnZhbHVlfScuIEF2YWlsYWJsZSByb3V0ZXM6IFske2F2YWlsYWJsZVJvdXRlc31dLmApO1xufVxuXG5mdW5jdGlvbiBfbWF0Y2hXaXRoUGFydHMocm91dGU6IFJvdXRlTWV0YWRhdGEsIHVybDogVHJlZU5vZGU8VXJsU2VnbWVudD4pOiBfTWF0Y2hSZXN1bHQge1xuICBsZXQgcGF0aCA9IHJvdXRlLnBhdGguc3RhcnRzV2l0aChcIi9cIikgPyByb3V0ZS5wYXRoLnN1YnN0cmluZygxKSA6IHJvdXRlLnBhdGg7XG5cbiAgaWYgKHBhdGggPT0gXCIqXCIpIHtcbiAgICByZXR1cm4gbmV3IF9NYXRjaFJlc3VsdChyb3V0ZS5jb21wb25lbnQsIFtdLCBudWxsLCBbXSwgW10pO1xuICB9XG5cbiAgbGV0IHBhcnRzID0gcGF0aC5zcGxpdChcIi9cIik7XG4gIGxldCBwb3NpdGlvbmFsUGFyYW1zID0ge307XG4gIGxldCBjb25zdW1lZFVybFNlZ21lbnRzID0gW107XG5cbiAgbGV0IGxhc3RQYXJlbnQ6IFRyZWVOb2RlPFVybFNlZ21lbnQ+ID0gbnVsbDtcbiAgbGV0IGxhc3RTZWdtZW50OiBUcmVlTm9kZTxVcmxTZWdtZW50PiA9IG51bGw7XG5cbiAgbGV0IGN1cnJlbnQgPSB1cmw7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoaXNCbGFuayhjdXJyZW50KSkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgcCA9IHBhcnRzW2ldO1xuICAgIGxldCBpc0xhc3RTZWdtZW50ID0gaSA9PT0gcGFydHMubGVuZ3RoIC0gMTtcbiAgICBsZXQgaXNMYXN0UGFyZW50ID0gaSA9PT0gcGFydHMubGVuZ3RoIC0gMjtcbiAgICBsZXQgaXNQb3NQYXJhbSA9IHAuc3RhcnRzV2l0aChcIjpcIik7XG5cbiAgICBpZiAoIWlzUG9zUGFyYW0gJiYgcCAhPSBjdXJyZW50LnZhbHVlLnNlZ21lbnQpIHJldHVybiBudWxsO1xuICAgIGlmIChpc0xhc3RTZWdtZW50KSB7XG4gICAgICBsYXN0U2VnbWVudCA9IGN1cnJlbnQ7XG4gICAgfVxuICAgIGlmIChpc0xhc3RQYXJlbnQpIHtcbiAgICAgIGxhc3RQYXJlbnQgPSBjdXJyZW50O1xuICAgIH1cblxuICAgIGlmIChpc1Bvc1BhcmFtKSB7XG4gICAgICBwb3NpdGlvbmFsUGFyYW1zW3Auc3Vic3RyaW5nKDEpXSA9IGN1cnJlbnQudmFsdWUuc2VnbWVudDtcbiAgICB9XG5cbiAgICBjb25zdW1lZFVybFNlZ21lbnRzLnB1c2goY3VycmVudC52YWx1ZSk7XG5cbiAgICBjdXJyZW50ID0gTGlzdFdyYXBwZXIuZmlyc3QoY3VycmVudC5jaGlsZHJlbik7XG4gIH1cblxuICBpZiAoaXNQcmVzZW50KGN1cnJlbnQpICYmIGlzQmxhbmsoY3VycmVudC52YWx1ZS5zZWdtZW50KSkge1xuICAgIGxhc3RQYXJlbnQgPSBsYXN0U2VnbWVudDtcbiAgICBsYXN0U2VnbWVudCA9IGN1cnJlbnQ7XG4gIH1cblxuICBsZXQgcCA9IGxhc3RTZWdtZW50LnZhbHVlLnBhcmFtZXRlcnM7XG4gIGxldCBwYXJhbWV0ZXJzID1cbiAgICAgIDx7W2tleTogc3RyaW5nXTogc3RyaW5nfT5TdHJpbmdNYXBXcmFwcGVyLm1lcmdlKGlzQmxhbmsocCkgPyB7fSA6IHAsIHBvc2l0aW9uYWxQYXJhbXMpO1xuICBsZXQgYXh1VXJsU3VidHJlZXMgPSBpc1ByZXNlbnQobGFzdFBhcmVudCkgPyBsYXN0UGFyZW50LmNoaWxkcmVuLnNsaWNlKDEpIDogW107XG5cbiAgcmV0dXJuIG5ldyBfTWF0Y2hSZXN1bHQocm91dGUuY29tcG9uZW50LCBjb25zdW1lZFVybFNlZ21lbnRzLCBwYXJhbWV0ZXJzLCBsYXN0U2VnbWVudC5jaGlsZHJlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXh1VXJsU3VidHJlZXMpO1xufVxuXG5mdW5jdGlvbiBfY2hlY2tPdXRsZXROYW1lVW5pcXVlbmVzcyhub2RlczogVHJlZU5vZGU8Um91dGVTZWdtZW50PltdKTogVHJlZU5vZGU8Um91dGVTZWdtZW50PltdIHtcbiAgbGV0IG5hbWVzID0ge307XG4gIG5vZGVzLmZvckVhY2gobiA9PiB7XG4gICAgbGV0IHNlZ21lbnRXaXRoU2FtZU91dGxldE5hbWUgPSBuYW1lc1tuLnZhbHVlLm91dGxldF07XG4gICAgaWYgKGlzUHJlc2VudChzZWdtZW50V2l0aFNhbWVPdXRsZXROYW1lKSkge1xuICAgICAgbGV0IHAgPSBzZWdtZW50V2l0aFNhbWVPdXRsZXROYW1lLnN0cmluZ2lmaWVkVXJsU2VnbWVudHM7XG4gICAgICBsZXQgYyA9IG4udmFsdWUuc3RyaW5naWZpZWRVcmxTZWdtZW50cztcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBUd28gc2VnbWVudHMgY2Fubm90IGhhdmUgdGhlIHNhbWUgb3V0bGV0IG5hbWU6ICcke3B9JyBhbmQgJyR7Y30nLmApO1xuICAgIH1cbiAgICBuYW1lc1tuLnZhbHVlLm91dGxldF0gPSBuLnZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIG5vZGVzO1xufVxuXG5jbGFzcyBfTWF0Y2hSZXN1bHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29tcG9uZW50OiBUeXBlLCBwdWJsaWMgY29uc3VtZWRVcmxTZWdtZW50czogVXJsU2VnbWVudFtdLFxuICAgICAgICAgICAgICBwdWJsaWMgcGFyYW1ldGVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sXG4gICAgICAgICAgICAgIHB1YmxpYyBsZWZ0T3ZlclVybDogVHJlZU5vZGU8VXJsU2VnbWVudD5bXSwgcHVibGljIGF1eDogVHJlZU5vZGU8VXJsU2VnbWVudD5bXSkge31cbn1cblxuZnVuY3Rpb24gX3JlYWRNZXRhZGF0YShjb21wb25lbnRUeXBlOiBUeXBlKSB7XG4gIGxldCBtZXRhZGF0YSA9IHJlZmxlY3Rvci5hbm5vdGF0aW9ucyhjb21wb25lbnRUeXBlKS5maWx0ZXIoZiA9PiBmIGluc3RhbmNlb2YgUm91dGVzTWV0YWRhdGEpO1xuICByZXR1cm4gTGlzdFdyYXBwZXIuZmlyc3QobWV0YWRhdGEpO1xufSJdfQ==