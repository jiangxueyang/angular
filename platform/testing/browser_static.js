'use strict';"use strict";
var core_1 = require('angular2/core');
var compiler_1 = require('angular2/compiler');
var browser_common_1 = require('angular2/src/platform/browser_common');
var browser_adapter_1 = require('angular2/src/platform/browser/browser_adapter');
var animation_builder_1 = require('angular2/src/animate/animation_builder');
var animation_builder_mock_1 = require('angular2/src/mock/animation_builder_mock');
var directive_resolver_mock_1 = require('angular2/src/mock/directive_resolver_mock');
var view_resolver_mock_1 = require('angular2/src/mock/view_resolver_mock');
var mock_location_strategy_1 = require('angular2/src/mock/mock_location_strategy');
var common_1 = require('angular2/platform/common');
var ng_zone_mock_1 = require('angular2/src/mock/ng_zone_mock');
var xhr_impl_1 = require("angular2/src/platform/browser/xhr_impl");
var compiler_2 = require('angular2/compiler');
var test_component_builder_1 = require('angular2/src/testing/test_component_builder');
var utils_1 = require('angular2/src/testing/utils');
var common_dom_1 = require('angular2/platform/common_dom');
var lang_1 = require('angular2/src/facade/lang');
var utils_2 = require('angular2/src/testing/utils');
function initBrowserTests() {
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    utils_1.BrowserDetection.setup();
}
function createNgZone() {
    return lang_1.IS_DART ? new ng_zone_mock_1.MockNgZone() : new core_1.NgZone({ enableLongStackTrace: true });
}
/**
 * Default platform providers for testing without a compiler.
 */
exports.TEST_BROWSER_STATIC_PLATFORM_PROVIDERS = 
/*@ts2dart_const*/ [
    core_1.PLATFORM_COMMON_PROVIDERS,
    /*@ts2dart_Provider*/ { provide: core_1.PLATFORM_INITIALIZER, useValue: initBrowserTests, multi: true }
];
exports.ADDITIONAL_TEST_BROWSER_PROVIDERS = 
/*@ts2dart_const*/ [
    /*@ts2dart_Provider*/ { provide: core_1.APP_ID, useValue: 'a' },
    common_dom_1.ELEMENT_PROBE_PROVIDERS,
    /*@ts2dart_Provider*/ { provide: compiler_1.DirectiveResolver, useClass: directive_resolver_mock_1.MockDirectiveResolver },
    /*@ts2dart_Provider*/ { provide: compiler_1.ViewResolver, useClass: view_resolver_mock_1.MockViewResolver },
    utils_2.Log,
    test_component_builder_1.TestComponentBuilder,
    /*@ts2dart_Provider*/ { provide: core_1.NgZone, useFactory: createNgZone },
    /*@ts2dart_Provider*/ { provide: common_1.LocationStrategy, useClass: mock_location_strategy_1.MockLocationStrategy },
    /*@ts2dart_Provider*/ { provide: animation_builder_1.AnimationBuilder, useClass: animation_builder_mock_1.MockAnimationBuilder },
];
/**
 * Default application providers for testing without a compiler.
 */
exports.TEST_BROWSER_STATIC_APPLICATION_PROVIDERS = 
/*@ts2dart_const*/ [
    browser_common_1.BROWSER_APP_COMMON_PROVIDERS,
    /*@ts2dart_Provider*/ { provide: compiler_2.XHR, useClass: xhr_impl_1.XHRImpl },
    exports.ADDITIONAL_TEST_BROWSER_PROVIDERS
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9zdGF0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXFYQ09jRGFKLnRtcC9hbmd1bGFyMi9wbGF0Zm9ybS90ZXN0aW5nL2Jyb3dzZXJfc3RhdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFNTyxlQUFlLENBQUMsQ0FBQTtBQUN2Qix5QkFBOEMsbUJBQW1CLENBQUMsQ0FBQTtBQUNsRSwrQkFBMkMsc0NBQXNDLENBQUMsQ0FBQTtBQUNsRixnQ0FBZ0MsK0NBQStDLENBQUMsQ0FBQTtBQUVoRixrQ0FBK0Isd0NBQXdDLENBQUMsQ0FBQTtBQUN4RSx1Q0FBbUMsMENBQTBDLENBQUMsQ0FBQTtBQUM5RSx3Q0FBb0MsMkNBQTJDLENBQUMsQ0FBQTtBQUNoRixtQ0FBK0Isc0NBQXNDLENBQUMsQ0FBQTtBQUN0RSx1Q0FBbUMsMENBQTBDLENBQUMsQ0FBQTtBQUM5RSx1QkFBK0IsMEJBQTBCLENBQUMsQ0FBQTtBQUMxRCw2QkFBeUIsZ0NBQWdDLENBQUMsQ0FBQTtBQUUxRCx5QkFBc0Isd0NBQXdDLENBQUMsQ0FBQTtBQUMvRCx5QkFBa0IsbUJBQW1CLENBQUMsQ0FBQTtBQUV0Qyx1Q0FJTyw2Q0FBNkMsQ0FBQyxDQUFBO0FBRXJELHNCQUErQiw0QkFBNEIsQ0FBQyxDQUFBO0FBRTVELDJCQUFzQyw4QkFBOEIsQ0FBQyxDQUFBO0FBRXJFLHFCQUFzQiwwQkFBMEIsQ0FBQyxDQUFBO0FBRWpELHNCQUFrQiw0QkFBNEIsQ0FBQyxDQUFBO0FBRS9DO0lBQ0UsbUNBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEMsd0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0IsQ0FBQztBQUVEO0lBQ0UsTUFBTSxDQUFDLGNBQU8sR0FBRyxJQUFJLHlCQUFVLEVBQUUsR0FBRyxJQUFJLGFBQU0sQ0FBQyxFQUFDLG9CQUFvQixFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQUVEOztHQUVHO0FBQ1UsOENBQXNDO0FBQy9DLGtCQUFrQixDQUFBO0lBQ2hCLGdDQUF5QjtJQUN6QixxQkFBcUIsQ0FBQSxFQUFDLE9BQU8sRUFBRSwyQkFBb0IsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztDQUM5RixDQUFDO0FBRU8seUNBQWlDO0FBQzFDLGtCQUFrQixDQUFBO0lBQ2hCLHFCQUFxQixDQUFDLEVBQUMsT0FBTyxFQUFFLGFBQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDO0lBQ3RELG9DQUF1QjtJQUN2QixxQkFBcUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSw0QkFBaUIsRUFBRSxRQUFRLEVBQUUsK0NBQXFCLEVBQUM7SUFDbkYscUJBQXFCLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQVksRUFBRSxRQUFRLEVBQUUscUNBQWdCLEVBQUM7SUFDekUsV0FBRztJQUNILDZDQUFvQjtJQUNwQixxQkFBcUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxhQUFNLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBQztJQUNqRSxxQkFBcUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBZ0IsRUFBRSxRQUFRLEVBQUUsNkNBQW9CLEVBQUM7SUFDakYscUJBQXFCLENBQUMsRUFBQyxPQUFPLEVBQUUsb0NBQWdCLEVBQUUsUUFBUSxFQUFFLDZDQUFvQixFQUFDO0NBQ2xGLENBQUM7QUFFTjs7R0FFRztBQUNVLGlEQUF5QztBQUNsRCxrQkFBa0IsQ0FBQTtJQUNoQiw2Q0FBNEI7SUFDNUIscUJBQXFCLENBQUMsRUFBQyxPQUFPLEVBQUUsY0FBRyxFQUFFLFFBQVEsRUFBRSxrQkFBTyxFQUFDO0lBQ3ZELHlDQUFpQztDQUNsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQVBQX0lELFxuICBOZ1pvbmUsXG4gIFByb3ZpZGVyLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9JTklUSUFMSVpFUlxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXIsIFZpZXdSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvY29tcGlsZXInO1xuaW1wb3J0IHtCUk9XU0VSX0FQUF9DT01NT05fUFJPVklERVJTfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlcl9jb21tb24nO1xuaW1wb3J0IHtCcm93c2VyRG9tQWRhcHRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvYnJvd3Nlcl9hZGFwdGVyJztcblxuaW1wb3J0IHtBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9hbmltYXRpb25fYnVpbGRlcic7XG5pbXBvcnQge01vY2tBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay9hbmltYXRpb25fYnVpbGRlcl9tb2NrJztcbmltcG9ydCB7TW9ja0RpcmVjdGl2ZVJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay9kaXJlY3RpdmVfcmVzb2x2ZXJfbW9jayc7XG5pbXBvcnQge01vY2tWaWV3UmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9tb2NrL3ZpZXdfcmVzb2x2ZXJfbW9jayc7XG5pbXBvcnQge01vY2tMb2NhdGlvblN0cmF0ZWd5fSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay9tb2NrX2xvY2F0aW9uX3N0cmF0ZWd5JztcbmltcG9ydCB7TG9jYXRpb25TdHJhdGVneX0gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vY29tbW9uJztcbmltcG9ydCB7TW9ja05nWm9uZX0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svbmdfem9uZV9tb2NrJztcblxuaW1wb3J0IHtYSFJJbXBsfSBmcm9tIFwiYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIveGhyX2ltcGxcIjtcbmltcG9ydCB7WEhSfSBmcm9tICdhbmd1bGFyMi9jb21waWxlcic7XG5cbmltcG9ydCB7XG4gIFRlc3RDb21wb25lbnRCdWlsZGVyLFxuICBDb21wb25lbnRGaXh0dXJlQXV0b0RldGVjdCxcbiAgQ29tcG9uZW50Rml4dHVyZU5vTmdab25lXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfY29tcG9uZW50X2J1aWxkZXInO1xuXG5pbXBvcnQge0Jyb3dzZXJEZXRlY3Rpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3V0aWxzJztcblxuaW1wb3J0IHtFTEVNRU5UX1BST0JFX1BST1ZJREVSU30gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vY29tbW9uX2RvbSc7XG5cbmltcG9ydCB7SVNfREFSVH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuaW1wb3J0IHtMb2d9IGZyb20gJ2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3V0aWxzJztcblxuZnVuY3Rpb24gaW5pdEJyb3dzZXJUZXN0cygpIHtcbiAgQnJvd3NlckRvbUFkYXB0ZXIubWFrZUN1cnJlbnQoKTtcbiAgQnJvd3NlckRldGVjdGlvbi5zZXR1cCgpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOZ1pvbmUoKTogTmdab25lIHtcbiAgcmV0dXJuIElTX0RBUlQgPyBuZXcgTW9ja05nWm9uZSgpIDogbmV3IE5nWm9uZSh7ZW5hYmxlTG9uZ1N0YWNrVHJhY2U6IHRydWV9KTtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHBsYXRmb3JtIHByb3ZpZGVycyBmb3IgdGVzdGluZyB3aXRob3V0IGEgY29tcGlsZXIuXG4gKi9cbmV4cG9ydCBjb25zdCBURVNUX0JST1dTRVJfU1RBVElDX1BMQVRGT1JNX1BST1ZJREVSUzogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqL1tcbiAgICAgIFBMQVRGT1JNX0NPTU1PTl9QUk9WSURFUlMsXG4gICAgICAvKkB0czJkYXJ0X1Byb3ZpZGVyKi97cHJvdmlkZTogUExBVEZPUk1fSU5JVElBTElaRVIsIHVzZVZhbHVlOiBpbml0QnJvd3NlclRlc3RzLCBtdWx0aTogdHJ1ZX1cbiAgICBdO1xuXG5leHBvcnQgY29uc3QgQURESVRJT05BTF9URVNUX0JST1dTRVJfUFJPVklERVJTOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW1xuICAgICAgLypAdHMyZGFydF9Qcm92aWRlciovIHtwcm92aWRlOiBBUFBfSUQsIHVzZVZhbHVlOiAnYSd9LFxuICAgICAgRUxFTUVOVF9QUk9CRV9QUk9WSURFUlMsXG4gICAgICAvKkB0czJkYXJ0X1Byb3ZpZGVyKi8ge3Byb3ZpZGU6IERpcmVjdGl2ZVJlc29sdmVyLCB1c2VDbGFzczogTW9ja0RpcmVjdGl2ZVJlc29sdmVyfSxcbiAgICAgIC8qQHRzMmRhcnRfUHJvdmlkZXIqLyB7cHJvdmlkZTogVmlld1Jlc29sdmVyLCB1c2VDbGFzczogTW9ja1ZpZXdSZXNvbHZlcn0sXG4gICAgICBMb2csXG4gICAgICBUZXN0Q29tcG9uZW50QnVpbGRlcixcbiAgICAgIC8qQHRzMmRhcnRfUHJvdmlkZXIqLyB7cHJvdmlkZTogTmdab25lLCB1c2VGYWN0b3J5OiBjcmVhdGVOZ1pvbmV9LFxuICAgICAgLypAdHMyZGFydF9Qcm92aWRlciovIHtwcm92aWRlOiBMb2NhdGlvblN0cmF0ZWd5LCB1c2VDbGFzczogTW9ja0xvY2F0aW9uU3RyYXRlZ3l9LFxuICAgICAgLypAdHMyZGFydF9Qcm92aWRlciovIHtwcm92aWRlOiBBbmltYXRpb25CdWlsZGVyLCB1c2VDbGFzczogTW9ja0FuaW1hdGlvbkJ1aWxkZXJ9LFxuICAgIF07XG5cbi8qKlxuICogRGVmYXVsdCBhcHBsaWNhdGlvbiBwcm92aWRlcnMgZm9yIHRlc3Rpbmcgd2l0aG91dCBhIGNvbXBpbGVyLlxuICovXG5leHBvcnQgY29uc3QgVEVTVF9CUk9XU0VSX1NUQVRJQ19BUFBMSUNBVElPTl9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID1cbiAgICAvKkB0czJkYXJ0X2NvbnN0Ki9bXG4gICAgICBCUk9XU0VSX0FQUF9DT01NT05fUFJPVklERVJTLFxuICAgICAgLypAdHMyZGFydF9Qcm92aWRlciovIHtwcm92aWRlOiBYSFIsIHVzZUNsYXNzOiBYSFJJbXBsfSxcbiAgICAgIEFERElUSU9OQUxfVEVTVF9CUk9XU0VSX1BST1ZJREVSU1xuICAgIF07XG4iXX0=