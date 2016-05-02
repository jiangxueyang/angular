'use strict';"use strict";
var core_1 = require('angular2/core');
var common_1 = require('angular2/platform/common');
var router_1 = require('./router');
var router_url_serializer_1 = require('./router_url_serializer');
var core_2 = require('angular2/core');
var exceptions_1 = require('angular2/src/facade/exceptions');
exports.ROUTER_PROVIDERS_COMMON = [
    router_1.RouterOutletMap,
    /*@ts2dart_Provider*/ { provide: router_url_serializer_1.RouterUrlSerializer, useClass: router_url_serializer_1.DefaultRouterUrlSerializer },
    /*@ts2dart_Provider*/ { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy }, common_1.Location,
    /*@ts2dart_Provider*/ {
        provide: router_1.Router,
        useFactory: routerFactory,
        deps: /*@ts2dart_const*/ [core_2.ApplicationRef, core_1.ComponentResolver, router_url_serializer_1.RouterUrlSerializer, router_1.RouterOutletMap, common_1.Location],
    },
];
function routerFactory(app, componentResolver, urlSerializer, routerOutletMap, location) {
    if (app.componentTypes.length == 0) {
        throw new exceptions_1.BaseException("Bootstrap at least one component before injecting Router.");
    }
    // TODO: vsavkin this should not be null
    var router = new router_1.Router(null, app.componentTypes[0], componentResolver, urlSerializer, routerOutletMap, location);
    app.registerDisposeListener(function () { return router.dispose(); });
    return router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Byb3ZpZGVyc19jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXVvdzY3dDEyLnRtcC9hbmd1bGFyMi9zcmMvYWx0X3JvdXRlci9yb3V0ZXJfcHJvdmlkZXJzX2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQTZDLGVBQWUsQ0FBQyxDQUFBO0FBQzdELHVCQUErRCwwQkFBMEIsQ0FBQyxDQUFBO0FBQzFGLHVCQUFzQyxVQUFVLENBQUMsQ0FBQTtBQUNqRCxzQ0FBOEQseUJBQXlCLENBQUMsQ0FBQTtBQUN4RixxQkFBNkIsZUFBZSxDQUFDLENBQUE7QUFDN0MsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFFaEQsK0JBQXVCLEdBQTRCO0lBQzlELHdCQUFlO0lBQ2YscUJBQXFCLENBQUMsRUFBQyxPQUFPLEVBQUUsMkNBQW1CLEVBQUUsUUFBUSxFQUFFLGtEQUEwQixFQUFDO0lBQzFGLHFCQUFxQixDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFnQixFQUFFLFFBQVEsRUFBRSw2QkFBb0IsRUFBQyxFQUFFLGlCQUFRO0lBQzNGLHFCQUFxQixDQUFDO1FBQ3BCLE9BQU8sRUFBRSxlQUFNO1FBQ2YsVUFBVSxFQUFFLGFBQWE7UUFDekIsSUFBSSxFQUFFLGtCQUFrQixDQUNwQixDQUFDLHFCQUFjLEVBQUUsd0JBQWlCLEVBQUUsMkNBQW1CLEVBQUUsd0JBQWUsRUFBRSxpQkFBUSxDQUFDO0tBQ3hGO0NBQ0YsQ0FBQztBQUVGLHVCQUF1QixHQUFtQixFQUFFLGlCQUFvQyxFQUN6RCxhQUFrQyxFQUFFLGVBQWdDLEVBQ3BFLFFBQWtCO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxJQUFJLDBCQUFhLENBQUMsMkRBQTJELENBQUMsQ0FBQztJQUN2RixDQUFDO0lBQ0Qsd0NBQXdDO0lBQ3hDLElBQUksTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFDN0QsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFNLE9BQUEsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFoQixDQUFnQixDQUFDLENBQUM7SUFDcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtPcGFxdWVUb2tlbiwgQ29tcG9uZW50UmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtMb2NhdGlvblN0cmF0ZWd5LCBQYXRoTG9jYXRpb25TdHJhdGVneSwgTG9jYXRpb259IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2NvbW1vbic7XG5pbXBvcnQge1JvdXRlciwgUm91dGVyT3V0bGV0TWFwfSBmcm9tICcuL3JvdXRlcic7XG5pbXBvcnQge1JvdXRlclVybFNlcmlhbGl6ZXIsIERlZmF1bHRSb3V0ZXJVcmxTZXJpYWxpemVyfSBmcm9tICcuL3JvdXRlcl91cmxfc2VyaWFsaXplcic7XG5pbXBvcnQge0FwcGxpY2F0aW9uUmVmfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcblxuZXhwb3J0IGNvbnN0IFJPVVRFUl9QUk9WSURFUlNfQ09NTU9OOiBhbnlbXSA9IC8qQHRzMmRhcnRfY29uc3QqL1tcbiAgUm91dGVyT3V0bGV0TWFwLFxuICAvKkB0czJkYXJ0X1Byb3ZpZGVyKi8ge3Byb3ZpZGU6IFJvdXRlclVybFNlcmlhbGl6ZXIsIHVzZUNsYXNzOiBEZWZhdWx0Um91dGVyVXJsU2VyaWFsaXplcn0sXG4gIC8qQHRzMmRhcnRfUHJvdmlkZXIqLyB7cHJvdmlkZTogTG9jYXRpb25TdHJhdGVneSwgdXNlQ2xhc3M6IFBhdGhMb2NhdGlvblN0cmF0ZWd5fSwgTG9jYXRpb24sXG4gIC8qQHRzMmRhcnRfUHJvdmlkZXIqLyB7XG4gICAgcHJvdmlkZTogUm91dGVyLFxuICAgIHVzZUZhY3Rvcnk6IHJvdXRlckZhY3RvcnksXG4gICAgZGVwczogLypAdHMyZGFydF9jb25zdCovXG4gICAgICAgIFtBcHBsaWNhdGlvblJlZiwgQ29tcG9uZW50UmVzb2x2ZXIsIFJvdXRlclVybFNlcmlhbGl6ZXIsIFJvdXRlck91dGxldE1hcCwgTG9jYXRpb25dLFxuICB9LFxuXTtcblxuZnVuY3Rpb24gcm91dGVyRmFjdG9yeShhcHA6IEFwcGxpY2F0aW9uUmVmLCBjb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50UmVzb2x2ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgIHVybFNlcmlhbGl6ZXI6IFJvdXRlclVybFNlcmlhbGl6ZXIsIHJvdXRlck91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLFxuICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogTG9jYXRpb24pOiBSb3V0ZXIge1xuICBpZiAoYXBwLmNvbXBvbmVudFR5cGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXCJCb290c3RyYXAgYXQgbGVhc3Qgb25lIGNvbXBvbmVudCBiZWZvcmUgaW5qZWN0aW5nIFJvdXRlci5cIik7XG4gIH1cbiAgLy8gVE9ETzogdnNhdmtpbiB0aGlzIHNob3VsZCBub3QgYmUgbnVsbFxuICBsZXQgcm91dGVyID0gbmV3IFJvdXRlcihudWxsLCBhcHAuY29tcG9uZW50VHlwZXNbMF0sIGNvbXBvbmVudFJlc29sdmVyLCB1cmxTZXJpYWxpemVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXJPdXRsZXRNYXAsIGxvY2F0aW9uKTtcbiAgYXBwLnJlZ2lzdGVyRGlzcG9zZUxpc3RlbmVyKCgpID0+IHJvdXRlci5kaXNwb3NlKCkpO1xuICByZXR1cm4gcm91dGVyO1xufSJdfQ==