'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var message_bus_1 = require('angular2/src/web_workers/shared/message_bus');
var ng_zone_1 = require('angular2/src/core/zone/ng_zone');
var core_1 = require('angular2/core');
var common_dom_1 = require('angular2/platform/common_dom');
var di_1 = require('angular2/src/core/di');
// TODO change these imports once dom_adapter is moved out of core
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var dom_events_1 = require('angular2/src/platform/dom/events/dom_events');
var key_events_1 = require('angular2/src/platform/dom/events/key_events');
var dom_tokens_1 = require('angular2/src/platform/dom/dom_tokens');
var dom_renderer_1 = require('angular2/src/platform/dom/dom_renderer');
var shared_styles_host_1 = require('angular2/src/platform/dom/shared_styles_host');
var browser_details_1 = require('angular2/src/animate/browser_details');
var animation_builder_1 = require('angular2/src/animate/animation_builder');
var compiler_1 = require('angular2/compiler');
var xhr_impl_1 = require('angular2/src/platform/browser/xhr_impl');
var testability_1 = require('angular2/src/core/testability/testability');
var testability_2 = require('angular2/src/platform/browser/testability');
var browser_adapter_1 = require('./browser/browser_adapter');
var wtf_init_1 = require('angular2/src/core/profile/wtf_init');
var renderer_1 = require('angular2/src/web_workers/ui/renderer');
var xhr_impl_2 = require('angular2/src/web_workers/ui/xhr_impl');
var service_message_broker_1 = require('angular2/src/web_workers/shared/service_message_broker');
var client_message_broker_1 = require('angular2/src/web_workers/shared/client_message_broker');
var browser_platform_location_1 = require('angular2/src/platform/browser/location/browser_platform_location');
var serializer_1 = require('angular2/src/web_workers/shared/serializer');
var api_1 = require('angular2/src/web_workers/shared/api');
var render_store_1 = require('angular2/src/web_workers/shared/render_store');
var hammer_gestures_1 = require('angular2/src/platform/dom/events/hammer_gestures');
exports.WORKER_SCRIPT = new di_1.OpaqueToken("WebWorkerScript");
// Message based Worker classes that listen on the MessageBus
exports.WORKER_RENDER_MESSAGING_PROVIDERS = 
/*@ts2dart_const*/ [renderer_1.MessageBasedRenderer, xhr_impl_2.MessageBasedXHRImpl];
exports.WORKER_RENDER_PLATFORM_MARKER = 
/*@ts2dart_const*/ new di_1.OpaqueToken('WorkerRenderPlatformMarker');
exports.WORKER_RENDER_PLATFORM = [
    core_1.PLATFORM_COMMON_PROVIDERS,
    /*@ts2dart_const*/ ({ provide: exports.WORKER_RENDER_PLATFORM_MARKER, useValue: true }),
    /* @ts2dart_Provider */ { provide: core_1.PLATFORM_INITIALIZER, useValue: initWebWorkerRenderPlatform, multi: true }
];
/**
 * A list of {@link Provider}s. To use the router in a Worker enabled application you must
 * include these providers when setting up the render thread.
 */
exports.WORKER_RENDER_ROUTER = 
/*@ts2dart_const*/ [browser_platform_location_1.BrowserPlatformLocation];
exports.WORKER_RENDER_APPLICATION_COMMON = 
/*@ts2dart_const*/ [
    core_1.APPLICATION_COMMON_PROVIDERS,
    exports.WORKER_RENDER_MESSAGING_PROVIDERS,
    /* @ts2dart_Provider */ { provide: core_1.ExceptionHandler, useFactory: _exceptionHandler, deps: [] },
    /* @ts2dart_Provider */ { provide: dom_tokens_1.DOCUMENT, useFactory: _document, deps: [] },
    // TODO(jteplitz602): Investigate if we definitely need EVENT_MANAGER on the render thread
    // #5298
    /* @ts2dart_Provider */ { provide: common_dom_1.EVENT_MANAGER_PLUGINS, useClass: dom_events_1.DomEventsPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: common_dom_1.EVENT_MANAGER_PLUGINS, useClass: key_events_1.KeyEventsPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: common_dom_1.EVENT_MANAGER_PLUGINS, useClass: hammer_gestures_1.HammerGesturesPlugin, multi: true },
    /* @ts2dart_Provider */ { provide: hammer_gestures_1.HAMMER_GESTURE_CONFIG, useClass: hammer_gestures_1.HammerGestureConfig },
    /* @ts2dart_Provider */ { provide: dom_renderer_1.DomRootRenderer, useClass: dom_renderer_1.DomRootRenderer_ },
    /* @ts2dart_Provider */ { provide: core_1.RootRenderer, useExisting: dom_renderer_1.DomRootRenderer },
    /* @ts2dart_Provider */ { provide: shared_styles_host_1.SharedStylesHost, useExisting: shared_styles_host_1.DomSharedStylesHost },
    /* @ts2dart_Provider */ { provide: compiler_1.XHR, useClass: xhr_impl_1.XHRImpl },
    xhr_impl_2.MessageBasedXHRImpl,
    /* @ts2dart_Provider */ { provide: service_message_broker_1.ServiceMessageBrokerFactory, useClass: service_message_broker_1.ServiceMessageBrokerFactory_ },
    /* @ts2dart_Provider */ { provide: client_message_broker_1.ClientMessageBrokerFactory, useClass: client_message_broker_1.ClientMessageBrokerFactory_ },
    serializer_1.Serializer,
    /* @ts2dart_Provider */ { provide: api_1.ON_WEB_WORKER, useValue: false },
    render_store_1.RenderStore,
    shared_styles_host_1.DomSharedStylesHost,
    testability_1.Testability,
    browser_details_1.BrowserDetails,
    animation_builder_1.AnimationBuilder,
    common_dom_1.EventManager
];
function initializeGenericWorkerRenderer(injector) {
    var bus = injector.get(message_bus_1.MessageBus);
    var zone = injector.get(ng_zone_1.NgZone);
    bus.attachToZone(zone);
    zone.runGuarded(function () {
        exports.WORKER_RENDER_MESSAGING_PROVIDERS.forEach(function (token) { injector.get(token).start(); });
    });
}
exports.initializeGenericWorkerRenderer = initializeGenericWorkerRenderer;
function initWebWorkerRenderPlatform() {
    browser_adapter_1.BrowserDomAdapter.makeCurrent();
    wtf_init_1.wtfInit();
    testability_2.BrowserGetTestability.init();
}
exports.initWebWorkerRenderPlatform = initWebWorkerRenderPlatform;
function _exceptionHandler() {
    return new core_1.ExceptionHandler(dom_adapter_1.DOM, !lang_1.IS_DART);
}
function _document() {
    return dom_adapter_1.DOM.defaultDoc();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3JlbmRlcl9jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXVvdzY3dDEyLnRtcC9hbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcl9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFzQiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ2pELDRCQUF5Qiw2Q0FBNkMsQ0FBQyxDQUFBO0FBQ3ZFLHdCQUFxQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3RELHFCQVlPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLDJCQUFrRCw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2pGLG1CQUF1RCxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlFLGtFQUFrRTtBQUNsRSw0QkFBa0IsdUNBQXVDLENBQUMsQ0FBQTtBQUMxRCwyQkFBOEIsNkNBQTZDLENBQUMsQ0FBQTtBQUM1RSwyQkFBOEIsNkNBQTZDLENBQUMsQ0FBQTtBQUM1RSwyQkFBdUIsc0NBQXNDLENBQUMsQ0FBQTtBQUM5RCw2QkFBZ0Qsd0NBQXdDLENBQUMsQ0FBQTtBQUN6RixtQ0FBb0QsOENBQThDLENBQUMsQ0FBQTtBQUNuRyxnQ0FBNkIsc0NBQXNDLENBQUMsQ0FBQTtBQUNwRSxrQ0FBK0Isd0NBQXdDLENBQUMsQ0FBQTtBQUN4RSx5QkFBa0IsbUJBQW1CLENBQUMsQ0FBQTtBQUN0Qyx5QkFBc0Isd0NBQXdDLENBQUMsQ0FBQTtBQUMvRCw0QkFBMEIsMkNBQTJDLENBQUMsQ0FBQTtBQUN0RSw0QkFBb0MsMkNBQTJDLENBQUMsQ0FBQTtBQUNoRixnQ0FBZ0MsMkJBQTJCLENBQUMsQ0FBQTtBQUM1RCx5QkFBc0Isb0NBQW9DLENBQUMsQ0FBQTtBQUMzRCx5QkFBbUMsc0NBQXNDLENBQUMsQ0FBQTtBQUMxRSx5QkFBa0Msc0NBQXNDLENBQUMsQ0FBQTtBQUN6RSx1Q0FHTyx3REFBd0QsQ0FBQyxDQUFBO0FBQ2hFLHNDQUdPLHVEQUF1RCxDQUFDLENBQUE7QUFDL0QsMENBRU8sa0VBQWtFLENBQUMsQ0FBQTtBQUMxRSwyQkFBeUIsNENBQTRDLENBQUMsQ0FBQTtBQUN0RSxvQkFBNEIscUNBQXFDLENBQUMsQ0FBQTtBQUNsRSw2QkFBMEIsOENBQThDLENBQUMsQ0FBQTtBQUN6RSxnQ0FJTyxrREFBa0QsQ0FBQyxDQUFBO0FBRTdDLHFCQUFhLEdBQW1DLElBQUksZ0JBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRWhHLDZEQUE2RDtBQUNoRCx5Q0FBaUM7QUFDMUMsa0JBQWtCLENBQUEsQ0FBQywrQkFBb0IsRUFBRSw4QkFBbUIsQ0FBQyxDQUFDO0FBRXJELHFDQUE2QjtBQUN0QyxrQkFBa0IsQ0FBQyxJQUFJLGdCQUFXLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV4RCw4QkFBc0IsR0FBNkQ7SUFDOUYsZ0NBQXlCO0lBQ3pCLGtCQUFrQixDQUFDLENBQXlCLEVBQUMsT0FBTyxFQUFFLHFDQUE2QixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUNyRyx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSwyQkFBb0IsRUFBRSxRQUFRLEVBQUUsMkJBQTJCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztDQUM1RyxDQUFDO0FBRUY7OztHQUdHO0FBQ1UsNEJBQW9CO0FBQzdCLGtCQUFrQixDQUFBLENBQUMsbURBQXVCLENBQUMsQ0FBQztBQUVuQyx3Q0FBZ0M7QUFDekMsa0JBQWtCLENBQUE7SUFDaEIsbUNBQTRCO0lBQzVCLHlDQUFpQztJQUNqQyx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSx1QkFBZ0IsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUM1Rix1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxxQkFBUSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQztJQUM1RSwwRkFBMEY7SUFDMUYsUUFBUTtJQUNSLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLGtDQUFxQixFQUFFLFFBQVEsRUFBRSw0QkFBZSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7SUFDaEcsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsa0NBQXFCLEVBQUUsUUFBUSxFQUFFLDRCQUFlLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztJQUNoRyx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQ0FBcUIsRUFBRSxRQUFRLEVBQUUsc0NBQW9CLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztJQUNyRyx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSx1Q0FBcUIsRUFBRSxRQUFRLEVBQUUscUNBQW1CLEVBQUM7SUFDdkYsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsOEJBQWUsRUFBRSxRQUFRLEVBQUUsK0JBQWdCLEVBQUM7SUFDOUUsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsbUJBQVksRUFBRSxXQUFXLEVBQUUsOEJBQWUsRUFBQztJQUM3RSx1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxxQ0FBZ0IsRUFBRSxXQUFXLEVBQUUsd0NBQW1CLEVBQUM7SUFDckYsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsY0FBRyxFQUFFLFFBQVEsRUFBRSxrQkFBTyxFQUFDO0lBQ3pELDhCQUFtQjtJQUNuQix1QkFBdUIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxvREFBMkIsRUFBRSxRQUFRLEVBQUUscURBQTRCLEVBQUM7SUFDdEcsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsa0RBQTBCLEVBQUUsUUFBUSxFQUFFLG1EQUEyQixFQUFDO0lBQ3BHLHVCQUFVO0lBQ1YsdUJBQXVCLENBQUMsRUFBQyxPQUFPLEVBQUUsbUJBQWEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDO0lBQ2pFLDBCQUFXO0lBQ1gsd0NBQW1CO0lBQ25CLHlCQUFXO0lBQ1gsZ0NBQWM7SUFDZCxvQ0FBZ0I7SUFDaEIseUJBQVk7Q0FDYixDQUFDO0FBRU4seUNBQWdELFFBQWtCO0lBQ2hFLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsd0JBQVUsQ0FBQyxDQUFDO0lBQ25DLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFDO0lBQ2hDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNkLHlDQUFpQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssSUFBTyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBUmUsdUNBQStCLGtDQVE5QyxDQUFBO0FBRUQ7SUFDRSxtQ0FBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNoQyxrQkFBTyxFQUFFLENBQUM7SUFDVixtQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQixDQUFDO0FBSmUsbUNBQTJCLDhCQUkxQyxDQUFBO0FBRUQ7SUFDRSxNQUFNLENBQUMsSUFBSSx1QkFBZ0IsQ0FBQyxpQkFBRyxFQUFFLENBQUMsY0FBTyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVEO0lBQ0UsTUFBTSxDQUFDLGlCQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVNfREFSVH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TWVzc2FnZUJ1c30gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdlX2J1cyc7XG5pbXBvcnQge05nWm9uZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvem9uZS9uZ196b25lJztcbmltcG9ydCB7XG4gIFBMQVRGT1JNX0RJUkVDVElWRVMsXG4gIFBMQVRGT1JNX1BJUEVTLFxuICBDb21wb25lbnRSZWYsXG4gIEV4Y2VwdGlvbkhhbmRsZXIsXG4gIFJlZmxlY3RvcixcbiAgcmVmbGVjdG9yLFxuICBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxuICBSb290UmVuZGVyZXIsXG4gIFBMQVRGT1JNX0lOSVRJQUxJWkVSLFxuICBBUFBfSU5JVElBTElaRVJcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge0VWRU5UX01BTkFHRVJfUExVR0lOUywgRXZlbnRNYW5hZ2VyfSBmcm9tICdhbmd1bGFyMi9wbGF0Zm9ybS9jb21tb25fZG9tJztcbmltcG9ydCB7cHJvdmlkZSwgUHJvdmlkZXIsIEluamVjdG9yLCBPcGFxdWVUb2tlbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuLy8gVE9ETyBjaGFuZ2UgdGhlc2UgaW1wb3J0cyBvbmNlIGRvbV9hZGFwdGVyIGlzIG1vdmVkIG91dCBvZiBjb3JlXG5pbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5pbXBvcnQge0RvbUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMvZG9tX2V2ZW50cyc7XG5pbXBvcnQge0tleUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMva2V5X2V2ZW50cyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV90b2tlbnMnO1xuaW1wb3J0IHtEb21Sb290UmVuZGVyZXIsIERvbVJvb3RSZW5kZXJlcl99IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3JlbmRlcmVyJztcbmltcG9ydCB7RG9tU2hhcmVkU3R5bGVzSG9zdCwgU2hhcmVkU3R5bGVzSG9zdH0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9zaGFyZWRfc3R5bGVzX2hvc3QnO1xuaW1wb3J0IHtCcm93c2VyRGV0YWlsc30gZnJvbSAnYW5ndWxhcjIvc3JjL2FuaW1hdGUvYnJvd3Nlcl9kZXRhaWxzJztcbmltcG9ydCB7QW5pbWF0aW9uQnVpbGRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2FuaW1hdGUvYW5pbWF0aW9uX2J1aWxkZXInO1xuaW1wb3J0IHtYSFJ9IGZyb20gJ2FuZ3VsYXIyL2NvbXBpbGVyJztcbmltcG9ydCB7WEhSSW1wbH0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIveGhyX2ltcGwnO1xuaW1wb3J0IHtUZXN0YWJpbGl0eX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvdGVzdGFiaWxpdHkvdGVzdGFiaWxpdHknO1xuaW1wb3J0IHtCcm93c2VyR2V0VGVzdGFiaWxpdHl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyL3Rlc3RhYmlsaXR5JztcbmltcG9ydCB7QnJvd3NlckRvbUFkYXB0ZXJ9IGZyb20gJy4vYnJvd3Nlci9icm93c2VyX2FkYXB0ZXInO1xuaW1wb3J0IHt3dGZJbml0fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9wcm9maWxlL3d0Zl9pbml0JztcbmltcG9ydCB7TWVzc2FnZUJhc2VkUmVuZGVyZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy91aS9yZW5kZXJlcic7XG5pbXBvcnQge01lc3NhZ2VCYXNlZFhIUkltcGx9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy91aS94aHJfaW1wbCc7XG5pbXBvcnQge1xuICBTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3RvcnksXG4gIFNlcnZpY2VNZXNzYWdlQnJva2VyRmFjdG9yeV9cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJ2aWNlX21lc3NhZ2VfYnJva2VyJztcbmltcG9ydCB7XG4gIENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5LFxuICBDbGllbnRNZXNzYWdlQnJva2VyRmFjdG9yeV9cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9jbGllbnRfbWVzc2FnZV9icm9rZXInO1xuaW1wb3J0IHtcbiAgQnJvd3NlclBsYXRmb3JtTG9jYXRpb25cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXIvbG9jYXRpb24vYnJvd3Nlcl9wbGF0Zm9ybV9sb2NhdGlvbic7XG5pbXBvcnQge1NlcmlhbGl6ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplcic7XG5pbXBvcnQge09OX1dFQl9XT1JLRVJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvYXBpJztcbmltcG9ydCB7UmVuZGVyU3RvcmV9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvcmVuZGVyX3N0b3JlJztcbmltcG9ydCB7XG4gIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyxcbiAgSGFtbWVyR2VzdHVyZUNvbmZpZyxcbiAgSGFtbWVyR2VzdHVyZXNQbHVnaW5cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMvaGFtbWVyX2dlc3R1cmVzJztcblxuZXhwb3J0IGNvbnN0IFdPUktFUl9TQ1JJUFQ6IE9wYXF1ZVRva2VuID0gLypAdHMyZGFydF9jb25zdCovIG5ldyBPcGFxdWVUb2tlbihcIldlYldvcmtlclNjcmlwdFwiKTtcblxuLy8gTWVzc2FnZSBiYXNlZCBXb3JrZXIgY2xhc3NlcyB0aGF0IGxpc3RlbiBvbiB0aGUgTWVzc2FnZUJ1c1xuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfTUVTU0FHSU5HX1BST1ZJREVSUzogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqL1tNZXNzYWdlQmFzZWRSZW5kZXJlciwgTWVzc2FnZUJhc2VkWEhSSW1wbF07XG5cbmV4cG9ydCBjb25zdCBXT1JLRVJfUkVOREVSX1BMQVRGT1JNX01BUktFUiA9XG4gICAgLypAdHMyZGFydF9jb25zdCovIG5ldyBPcGFxdWVUb2tlbignV29ya2VyUmVuZGVyUGxhdGZvcm1NYXJrZXInKTtcblxuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfUExBVEZPUk06IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID0gLypAdHMyZGFydF9jb25zdCovW1xuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxuICAvKkB0czJkYXJ0X2NvbnN0Ki8gKC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBXT1JLRVJfUkVOREVSX1BMQVRGT1JNX01BUktFUiwgdXNlVmFsdWU6IHRydWV9KSxcbiAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IFBMQVRGT1JNX0lOSVRJQUxJWkVSLCB1c2VWYWx1ZTogaW5pdFdlYldvcmtlclJlbmRlclBsYXRmb3JtLCBtdWx0aTogdHJ1ZX1cbl07XG5cbi8qKlxuICogQSBsaXN0IG9mIHtAbGluayBQcm92aWRlcn1zLiBUbyB1c2UgdGhlIHJvdXRlciBpbiBhIFdvcmtlciBlbmFibGVkIGFwcGxpY2F0aW9uIHlvdSBtdXN0XG4gKiBpbmNsdWRlIHRoZXNlIHByb3ZpZGVycyB3aGVuIHNldHRpbmcgdXAgdGhlIHJlbmRlciB0aHJlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBXT1JLRVJfUkVOREVSX1JPVVRFUjogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqL1tCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbl07XG5cbmV4cG9ydCBjb25zdCBXT1JLRVJfUkVOREVSX0FQUExJQ0FUSU9OX0NPTU1PTjogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIC8qQHRzMmRhcnRfY29uc3QqL1tcbiAgICAgIEFQUExJQ0FUSU9OX0NPTU1PTl9QUk9WSURFUlMsXG4gICAgICBXT1JLRVJfUkVOREVSX01FU1NBR0lOR19QUk9WSURFUlMsXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRXhjZXB0aW9uSGFuZGxlciwgdXNlRmFjdG9yeTogX2V4Y2VwdGlvbkhhbmRsZXIsIGRlcHM6IFtdfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBET0NVTUVOVCwgdXNlRmFjdG9yeTogX2RvY3VtZW50LCBkZXBzOiBbXX0sXG4gICAgICAvLyBUT0RPKGp0ZXBsaXR6NjAyKTogSW52ZXN0aWdhdGUgaWYgd2UgZGVmaW5pdGVseSBuZWVkIEVWRU5UX01BTkFHRVIgb24gdGhlIHJlbmRlciB0aHJlYWRcbiAgICAgIC8vICM1Mjk4XG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB1c2VDbGFzczogRG9tRXZlbnRzUGx1Z2luLCBtdWx0aTogdHJ1ZX0sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB1c2VDbGFzczogS2V5RXZlbnRzUGx1Z2luLCBtdWx0aTogdHJ1ZX0sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogRVZFTlRfTUFOQUdFUl9QTFVHSU5TLCB1c2VDbGFzczogSGFtbWVyR2VzdHVyZXNQbHVnaW4sIG11bHRpOiB0cnVlfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBIQU1NRVJfR0VTVFVSRV9DT05GSUcsIHVzZUNsYXNzOiBIYW1tZXJHZXN0dXJlQ29uZmlnfSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBEb21Sb290UmVuZGVyZXIsIHVzZUNsYXNzOiBEb21Sb290UmVuZGVyZXJffSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBSb290UmVuZGVyZXIsIHVzZUV4aXN0aW5nOiBEb21Sb290UmVuZGVyZXJ9LFxuICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IFNoYXJlZFN0eWxlc0hvc3QsIHVzZUV4aXN0aW5nOiBEb21TaGFyZWRTdHlsZXNIb3N0fSxcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBYSFIsIHVzZUNsYXNzOiBYSFJJbXBsfSxcbiAgICAgIE1lc3NhZ2VCYXNlZFhIUkltcGwsXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5LCB1c2VDbGFzczogU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5X30sXG4gICAgICAvKiBAdHMyZGFydF9Qcm92aWRlciAqLyB7cHJvdmlkZTogQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksIHVzZUNsYXNzOiBDbGllbnRNZXNzYWdlQnJva2VyRmFjdG9yeV99LFxuICAgICAgU2VyaWFsaXplcixcbiAgICAgIC8qIEB0czJkYXJ0X1Byb3ZpZGVyICovIHtwcm92aWRlOiBPTl9XRUJfV09SS0VSLCB1c2VWYWx1ZTogZmFsc2V9LFxuICAgICAgUmVuZGVyU3RvcmUsXG4gICAgICBEb21TaGFyZWRTdHlsZXNIb3N0LFxuICAgICAgVGVzdGFiaWxpdHksXG4gICAgICBCcm93c2VyRGV0YWlscyxcbiAgICAgIEFuaW1hdGlvbkJ1aWxkZXIsXG4gICAgICBFdmVudE1hbmFnZXJcbiAgICBdO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUdlbmVyaWNXb3JrZXJSZW5kZXJlcihpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgdmFyIGJ1cyA9IGluamVjdG9yLmdldChNZXNzYWdlQnVzKTtcbiAgbGV0IHpvbmUgPSBpbmplY3Rvci5nZXQoTmdab25lKTtcbiAgYnVzLmF0dGFjaFRvWm9uZSh6b25lKTtcblxuICB6b25lLnJ1bkd1YXJkZWQoKCkgPT4ge1xuICAgIFdPUktFUl9SRU5ERVJfTUVTU0FHSU5HX1BST1ZJREVSUy5mb3JFYWNoKCh0b2tlbikgPT4geyBpbmplY3Rvci5nZXQodG9rZW4pLnN0YXJ0KCk7IH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRXZWJXb3JrZXJSZW5kZXJQbGF0Zm9ybSgpOiB2b2lkIHtcbiAgQnJvd3NlckRvbUFkYXB0ZXIubWFrZUN1cnJlbnQoKTtcbiAgd3RmSW5pdCgpO1xuICBCcm93c2VyR2V0VGVzdGFiaWxpdHkuaW5pdCgpO1xufVxuXG5mdW5jdGlvbiBfZXhjZXB0aW9uSGFuZGxlcigpOiBFeGNlcHRpb25IYW5kbGVyIHtcbiAgcmV0dXJuIG5ldyBFeGNlcHRpb25IYW5kbGVyKERPTSwgIUlTX0RBUlQpO1xufVxuXG5mdW5jdGlvbiBfZG9jdW1lbnQoKTogYW55IHtcbiAgcmV0dXJuIERPTS5kZWZhdWx0RG9jKCk7XG59XG4iXX0=