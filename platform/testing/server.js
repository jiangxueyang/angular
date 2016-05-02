'use strict';"use strict";
var core_1 = require('angular2/core');
var compiler_1 = require('angular2/compiler');
var parse5_adapter_1 = require('angular2/src/platform/server/parse5_adapter');
var animation_builder_1 = require('angular2/src/animate/animation_builder');
var animation_builder_mock_1 = require('angular2/src/mock/animation_builder_mock');
var directive_resolver_mock_1 = require('angular2/src/mock/directive_resolver_mock');
var view_resolver_mock_1 = require('angular2/src/mock/view_resolver_mock');
var mock_location_strategy_1 = require('angular2/src/mock/mock_location_strategy');
var application_ref_1 = require('angular2/src/core/application_ref');
var test_component_builder_1 = require('angular2/src/testing/test_component_builder');
var xhr_1 = require('angular2/src/compiler/xhr');
var utils_1 = require('angular2/src/testing/utils');
var compiler_2 = require('angular2/src/compiler/compiler');
var dom_tokens_1 = require('angular2/src/platform/dom/dom_tokens');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var api_1 = require('angular2/src/core/render/api');
var dom_renderer_1 = require('angular2/src/platform/dom/dom_renderer');
var shared_styles_host_1 = require('angular2/src/platform/dom/shared_styles_host');
var common_dom_1 = require('angular2/platform/common_dom');
var dom_events_1 = require('angular2/src/platform/dom/events/dom_events');
var common_1 = require('angular2/platform/common');
var utils_2 = require('angular2/src/testing/utils');
function initServerTests() {
    parse5_adapter_1.Parse5DomAdapter.makeCurrent();
    utils_1.BrowserDetection.setup();
}
/**
 * Default platform providers for testing.
 */
exports.TEST_SERVER_PLATFORM_PROVIDERS = 
/*@ts2dart_const*/ [
    core_1.PLATFORM_COMMON_PROVIDERS,
    /*@ts2dart_Provider*/ { provide: core_1.PLATFORM_INITIALIZER, useValue: initServerTests, multi: true }
];
function appDoc() {
    try {
        return dom_adapter_1.DOM.defaultDoc();
    }
    catch (e) {
        return null;
    }
}
/**
 * Default application providers for testing.
 */
exports.TEST_SERVER_APPLICATION_PROVIDERS = 
/*@ts2dart_const*/ [
    // TODO(julie: when angular2/platform/server is available, use that instead of making our own
    // list here.
    core_1.APPLICATION_COMMON_PROVIDERS,
    compiler_2.COMPILER_PROVIDERS,
    /* @ts2dart_Provider */ { provide: dom_tokens_1.DOCUMENT, useFactory: appDoc },
    /* @ts2dart_Provider */ { provide: dom_renderer_1.DomRootRenderer, useClass: dom_renderer_1.DomRootRenderer_ },
    /* @ts2dart_Provider */ { provide: api_1.RootRenderer, useExisting: dom_renderer_1.DomRootRenderer },
    common_dom_1.EventManager,
    /* @ts2dart_Provider */ { provide: common_dom_1.EVENT_MANAGER_PLUGINS, useClass: dom_events_1.DomEventsPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: xhr_1.XHR, useClass: xhr_1.XHR },
    /* @ts2dart_Provider */ { provide: core_1.APP_ID, useValue: 'a' },
    /* @ts2dart_Provider */ { provide: shared_styles_host_1.SharedStylesHost, useExisting: shared_styles_host_1.DomSharedStylesHost },
    shared_styles_host_1.DomSharedStylesHost,
    common_dom_1.ELEMENT_PROBE_PROVIDERS,
    /* @ts2dart_Provider */ { provide: compiler_1.DirectiveResolver, useClass: directive_resolver_mock_1.MockDirectiveResolver },
    /* @ts2dart_Provider */ { provide: compiler_1.ViewResolver, useClass: view_resolver_mock_1.MockViewResolver },
    utils_2.Log,
    test_component_builder_1.TestComponentBuilder,
    /* @ts2dart_Provider */ { provide: core_1.NgZone, useFactory: application_ref_1.createNgZone },
    /* @ts2dart_Provider */ { provide: common_1.LocationStrategy, useClass: mock_location_strategy_1.MockLocationStrategy },
    /* @ts2dart_Provider */ { provide: animation_builder_1.AnimationBuilder, useClass: animation_builder_mock_1.MockAnimationBuilder },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1xWENPY0RhSi50bXAvYW5ndWxhcjIvcGxhdGZvcm0vdGVzdGluZy9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQU9PLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLHlCQUE4QyxtQkFBbUIsQ0FBQyxDQUFBO0FBRWxFLCtCQUErQiw2Q0FBNkMsQ0FBQyxDQUFBO0FBRTdFLGtDQUErQix3Q0FBd0MsQ0FBQyxDQUFBO0FBQ3hFLHVDQUFtQywwQ0FBMEMsQ0FBQyxDQUFBO0FBQzlFLHdDQUFvQywyQ0FBMkMsQ0FBQyxDQUFBO0FBQ2hGLG1DQUErQixzQ0FBc0MsQ0FBQyxDQUFBO0FBQ3RFLHVDQUFtQywwQ0FBMEMsQ0FBQyxDQUFBO0FBRzlFLGdDQUEyQixtQ0FBbUMsQ0FBQyxDQUFBO0FBQy9ELHVDQUFtQyw2Q0FBNkMsQ0FBQyxDQUFBO0FBQ2pGLG9CQUFrQiwyQkFBMkIsQ0FBQyxDQUFBO0FBQzlDLHNCQUErQiw0QkFBNEIsQ0FBQyxDQUFBO0FBRTVELHlCQUFpQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ2xFLDJCQUF1QixzQ0FBc0MsQ0FBQyxDQUFBO0FBQzlELDRCQUFrQix1Q0FBdUMsQ0FBQyxDQUFBO0FBQzFELG9CQUEyQiw4QkFBOEIsQ0FBQyxDQUFBO0FBQzFELDZCQUFnRCx3Q0FBd0MsQ0FBQyxDQUFBO0FBQ3pGLG1DQUFvRCw4Q0FBOEMsQ0FBQyxDQUFBO0FBRW5HLDJCQUlPLDhCQUE4QixDQUFDLENBQUE7QUFDdEMsMkJBQThCLDZDQUE2QyxDQUFDLENBQUE7QUFDNUUsdUJBQStCLDBCQUEwQixDQUFDLENBQUE7QUFHMUQsc0JBQWtCLDRCQUE0QixDQUFDLENBQUE7QUFFL0M7SUFDRSxpQ0FBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMvQix3QkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMzQixDQUFDO0FBRUQ7O0dBRUc7QUFDVSxzQ0FBOEI7QUFDdkMsa0JBQWtCLENBQUE7SUFDaEIsZ0NBQXlCO0lBQ3pCLHFCQUFxQixDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUFvQixFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztDQUM5RixDQUFDO0FBRU47SUFDRSxJQUFJLENBQUM7UUFDSCxNQUFNLENBQUMsaUJBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUMxQixDQUFFO0lBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ1UseUNBQWlDO0FBQzFDLGtCQUFrQixDQUFBO0lBQ2hCLDZGQUE2RjtJQUM3RixhQUFhO0lBQ2IsbUNBQTRCO0lBQzVCLDZCQUFrQjtJQUNsQix1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxxQkFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUM7SUFDL0QsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsOEJBQWUsRUFBRSxRQUFRLEVBQUUsK0JBQWdCLEVBQUM7SUFDOUUsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsa0JBQVksRUFBRSxXQUFXLEVBQUUsOEJBQWUsRUFBQztJQUM3RSx5QkFBWTtJQUNaLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLGtDQUFxQixFQUFFLFFBQVEsRUFBRSw0QkFBZSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7SUFDaEcsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFHLEVBQUM7SUFDckQsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsYUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUM7SUFDeEQsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUscUNBQWdCLEVBQUUsV0FBVyxFQUFFLHdDQUFtQixFQUFDO0lBQ3JGLHdDQUFtQjtJQUNuQixvQ0FBdUI7SUFDdkIsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsNEJBQWlCLEVBQUUsUUFBUSxFQUFFLCtDQUFxQixFQUFDO0lBQ3JGLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLHVCQUFZLEVBQUUsUUFBUSxFQUFFLHFDQUFnQixFQUFDO0lBQzNFLFdBQUc7SUFDSCw2Q0FBb0I7SUFDcEIsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsYUFBTSxFQUFFLFVBQVUsRUFBRSw4QkFBWSxFQUFDO0lBQ25FLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFnQixFQUFFLFFBQVEsRUFBRSw2Q0FBb0IsRUFBQztJQUNuRix1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxvQ0FBZ0IsRUFBRSxRQUFRLEVBQUUsNkNBQW9CLEVBQUM7Q0FDcEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFQUF9JRCxcbiAgTmdab25lLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9JTklUSUFMSVpFUixcbiAgQVBQTElDQVRJT05fQ09NTU9OX1BST1ZJREVSUyxcbiAgUmVuZGVyZXJcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGl2ZVJlc29sdmVyLCBWaWV3UmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL2NvbXBpbGVyJztcblxuaW1wb3J0IHtQYXJzZTVEb21BZGFwdGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vc2VydmVyL3BhcnNlNV9hZGFwdGVyJztcblxuaW1wb3J0IHtBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9hbmltYXRpb25fYnVpbGRlcic7XG5pbXBvcnQge01vY2tBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay9hbmltYXRpb25fYnVpbGRlcl9tb2NrJztcbmltcG9ydCB7TW9ja0RpcmVjdGl2ZVJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay9kaXJlY3RpdmVfcmVzb2x2ZXJfbW9jayc7XG5pbXBvcnQge01vY2tWaWV3UmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9tb2NrL3ZpZXdfcmVzb2x2ZXJfbW9jayc7XG5pbXBvcnQge01vY2tMb2NhdGlvblN0cmF0ZWd5fSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay9tb2NrX2xvY2F0aW9uX3N0cmF0ZWd5JztcbmltcG9ydCB7TW9ja05nWm9uZX0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svbmdfem9uZV9tb2NrJztcblxuaW1wb3J0IHtjcmVhdGVOZ1pvbmV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2FwcGxpY2F0aW9uX3JlZic7XG5pbXBvcnQge1Rlc3RDb21wb25lbnRCdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvdGVzdGluZy90ZXN0X2NvbXBvbmVudF9idWlsZGVyJztcbmltcG9ydCB7WEhSfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIveGhyJztcbmltcG9ydCB7QnJvd3NlckRldGVjdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3Rlc3RpbmcvdXRpbHMnO1xuXG5pbXBvcnQge0NPTVBJTEVSX1BST1ZJREVSU30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2NvbXBpbGVyJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3Rva2Vucyc7XG5pbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5pbXBvcnQge1Jvb3RSZW5kZXJlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVuZGVyL2FwaSc7XG5pbXBvcnQge0RvbVJvb3RSZW5kZXJlciwgRG9tUm9vdFJlbmRlcmVyX30gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fcmVuZGVyZXInO1xuaW1wb3J0IHtEb21TaGFyZWRTdHlsZXNIb3N0LCBTaGFyZWRTdHlsZXNIb3N0fSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL3NoYXJlZF9zdHlsZXNfaG9zdCc7XG5cbmltcG9ydCB7XG4gIEV2ZW50TWFuYWdlcixcbiAgRVZFTlRfTUFOQUdFUl9QTFVHSU5TLFxuICBFTEVNRU5UX1BST0JFX1BST1ZJREVSU1xufSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9jb21tb25fZG9tJztcbmltcG9ydCB7RG9tRXZlbnRzUGx1Z2lufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2V2ZW50cy9kb21fZXZlbnRzJztcbmltcG9ydCB7TG9jYXRpb25TdHJhdGVneX0gZnJvbSAnYW5ndWxhcjIvcGxhdGZvcm0vY29tbW9uJztcblxuXG5pbXBvcnQge0xvZ30gZnJvbSAnYW5ndWxhcjIvc3JjL3Rlc3RpbmcvdXRpbHMnO1xuXG5mdW5jdGlvbiBpbml0U2VydmVyVGVzdHMoKSB7XG4gIFBhcnNlNURvbUFkYXB0ZXIubWFrZUN1cnJlbnQoKTtcbiAgQnJvd3NlckRldGVjdGlvbi5zZXR1cCgpO1xufVxuXG4vKipcbiAqIERlZmF1bHQgcGxhdGZvcm0gcHJvdmlkZXJzIGZvciB0ZXN0aW5nLlxuICovXG5leHBvcnQgY29uc3QgVEVTVF9TRVJWRVJfUExBVEZPUk1fUFJPVklERVJTOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9XG4gICAgLypAdHMyZGFydF9jb25zdCovW1xuICAgICAgUExBVEZPUk1fQ09NTU9OX1BST1ZJREVSUyxcbiAgICAgIC8qQHRzMmRhcnRfUHJvdmlkZXIqLyB7cHJvdmlkZTogUExBVEZPUk1fSU5JVElBTElaRVIsIHVzZVZhbHVlOiBpbml0U2VydmVyVGVzdHMsIG11bHRpOiB0cnVlfVxuICAgIF07XG5cbmZ1bmN0aW9uIGFwcERvYygpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gRE9NLmRlZmF1bHREb2MoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogRGVmYXVsdCBhcHBsaWNhdGlvbiBwcm92aWRlcnMgZm9yIHRlc3RpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBURVNUX1NFUlZFUl9BUFBMSUNBVElPTl9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID1cbiAgICAvKkB0czJkYXJ0X2NvbnN0Ki9bXG4gICAgICAvLyBUT0RPKGp1bGllOiB3aGVuIGFuZ3VsYXIyL3BsYXRmb3JtL3NlcnZlciBpcyBhdmFpbGFibGUsIHVzZSB0aGF0IGluc3RlYWQgb2YgbWFraW5nIG91ciBvd25cbiAgICAgIC8vIGxpc3QgaGVyZS5cbiAgICAgIEFQUExJQ0FUSU9OX0NPTU1PTl9QUk9WSURFUlMsXG4gICAgICBDT01QSUxFUl9QUk9WSURFUlMsXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRE9DVU1FTlQsIHVzZUZhY3Rvcnk6IGFwcERvY30sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRG9tUm9vdFJlbmRlcmVyLCB1c2VDbGFzczogRG9tUm9vdFJlbmRlcmVyX30sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogUm9vdFJlbmRlcmVyLCB1c2VFeGlzdGluZzogRG9tUm9vdFJlbmRlcmVyfSxcbiAgICAgIEV2ZW50TWFuYWdlcixcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHVzZUNsYXNzOiBEb21FdmVudHNQbHVnaW4sIG11bHRpOiB0cnVlfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBYSFIsIHVzZUNsYXNzOiBYSFJ9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IEFQUF9JRCwgdXNlVmFsdWU6ICdhJ30sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogU2hhcmVkU3R5bGVzSG9zdCwgdXNlRXhpc3Rpbmc6IERvbVNoYXJlZFN0eWxlc0hvc3R9LFxuICAgICAgRG9tU2hhcmVkU3R5bGVzSG9zdCxcbiAgICAgIEVMRU1FTlRfUFJPQkVfUFJPVklERVJTLFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IERpcmVjdGl2ZVJlc29sdmVyLCB1c2VDbGFzczogTW9ja0RpcmVjdGl2ZVJlc29sdmVyfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBWaWV3UmVzb2x2ZXIsIHVzZUNsYXNzOiBNb2NrVmlld1Jlc29sdmVyfSxcbiAgICAgIExvZyxcbiAgICAgIFRlc3RDb21wb25lbnRCdWlsZGVyLFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IE5nWm9uZSwgdXNlRmFjdG9yeTogY3JlYXRlTmdab25lfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBMb2NhdGlvblN0cmF0ZWd5LCB1c2VDbGFzczogTW9ja0xvY2F0aW9uU3RyYXRlZ3l9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IEFuaW1hdGlvbkJ1aWxkZXIsIHVzZUNsYXNzOiBNb2NrQW5pbWF0aW9uQnVpbGRlcn0sXG4gICAgXTtcbiJdfQ==