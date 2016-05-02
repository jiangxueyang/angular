import { ListWrapper } from 'angular2/src/facade/collection';
import { unimplemented } from 'angular2/src/facade/exceptions';
import { isPresent } from 'angular2/src/facade/lang';
import { wtfCreateScope, wtfLeave } from '../profile/profile';
/**
 * Represents a container where one or more Views can be attached.
 *
 * The container can contain two kinds of Views. Host Views, created by instantiating a
 * {@link Component} via {@link #createComponent}, and Embedded Views, created by instantiating an
 * {@link TemplateRef Embedded Template} via {@link #createEmbeddedView}.
 *
 * The location of the View Container within the containing View is specified by the Anchor
 * `element`. Each View Container can have only one Anchor Element and each Anchor Element can only
 * have a single View Container.
 *
 * Root elements of Views attached to this container become siblings of the Anchor Element in
 * the Rendered View.
 *
 * To access a `ViewContainerRef` of an Element, you can either place a {@link Directive} injected
 * with `ViewContainerRef` on the Element, or you obtain it via a {@link ViewChild} query.
 */
export class ViewContainerRef {
    /**
     * Anchor element that specifies the location of this container in the containing View.
     * <!-- TODO: rename to anchorElement -->
     */
    get element() { return unimplemented(); }
    get injector() { return unimplemented(); }
    get parentInjector() { return unimplemented(); }
    /**
     * Returns the number of Views currently attached to this container.
     */
    get length() { return unimplemented(); }
    ;
}
export class ViewContainerRef_ {
    constructor(_element) {
        this._element = _element;
        /** @internal */
        this._createComponentInContainerScope = wtfCreateScope('ViewContainerRef#createComponent()');
        /** @internal */
        this._insertScope = wtfCreateScope('ViewContainerRef#insert()');
        /** @internal */
        this._removeScope = wtfCreateScope('ViewContainerRef#remove()');
        /** @internal */
        this._detachScope = wtfCreateScope('ViewContainerRef#detach()');
    }
    get(index) { return this._element.nestedViews[index].ref; }
    get length() {
        var views = this._element.nestedViews;
        return isPresent(views) ? views.length : 0;
    }
    get element() { return this._element.elementRef; }
    get injector() { return this._element.injector; }
    get parentInjector() { return this._element.parentInjector; }
    // TODO(rado): profile and decide whether bounds checks should be added
    // to the methods below.
    createEmbeddedView(templateRef, context = null, index = -1) {
        var viewRef = templateRef.createEmbeddedView(context);
        this.insert(viewRef, index);
        return viewRef;
    }
    createComponent(componentFactory, index = -1, injector = null, projectableNodes = null) {
        var s = this._createComponentInContainerScope();
        var contextInjector = isPresent(injector) ? injector : this._element.parentInjector;
        var componentRef = componentFactory.create(contextInjector, projectableNodes);
        this.insert(componentRef.hostView, index);
        return wtfLeave(s, componentRef);
    }
    // TODO(i): refactor insert+remove into move
    insert(viewRef, index = -1) {
        var s = this._insertScope();
        if (index == -1)
            index = this.length;
        var viewRef_ = viewRef;
        this._element.attachView(viewRef_.internalView, index);
        return wtfLeave(s, viewRef_);
    }
    indexOf(viewRef) {
        return ListWrapper.indexOf(this._element.nestedViews, viewRef.internalView);
    }
    // TODO(i): rename to destroy
    remove(index = -1) {
        var s = this._removeScope();
        if (index == -1)
            index = this.length - 1;
        var view = this._element.detachView(index);
        view.destroy();
        // view is intentionally not returned to the client.
        wtfLeave(s);
    }
    // TODO(i): refactor insert+remove into move
    detach(index = -1) {
        var s = this._detachScope();
        if (index == -1)
            index = this.length - 1;
        var view = this._element.detachView(index);
        return wtfLeave(s, view.ref);
    }
    clear() {
        for (var i = this.length - 1; i >= 0; i--) {
            this.remove(i);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb250YWluZXJfcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1TM2l4UXBzcy50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfY29udGFpbmVyX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdDQUFnQztPQUNuRCxFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUVyRCxFQUFDLFNBQVMsRUFBVSxNQUFNLDBCQUEwQjtPQUNwRCxFQUFDLGNBQWMsRUFBRSxRQUFRLEVBQWEsTUFBTSxvQkFBb0I7QUFTdkU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSDtJQUNFOzs7T0FHRztJQUNILElBQUksT0FBTyxLQUFpQixNQUFNLENBQWEsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWpFLElBQUksUUFBUSxLQUFlLE1BQU0sQ0FBVyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFOUQsSUFBSSxjQUFjLEtBQWUsTUFBTSxDQUFXLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQVlwRTs7T0FFRztJQUNILElBQUksTUFBTSxLQUFhLE1BQU0sQ0FBUyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBeUQxRCxDQUFDO0FBRUQ7SUFDRSxZQUFvQixRQUFvQjtRQUFwQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBdUJ4QyxnQkFBZ0I7UUFDaEIscUNBQWdDLEdBQzVCLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBV3pELGdCQUFnQjtRQUNoQixpQkFBWSxHQUFHLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBZTNELGdCQUFnQjtRQUNoQixpQkFBWSxHQUFHLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBWTNELGdCQUFnQjtRQUNoQixpQkFBWSxHQUFHLGNBQWMsQ0FBQywyQkFBMkIsQ0FBQyxD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Q3pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLG9EQUFvRDtRQUNwRCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDO0lBS0QsNENBQTRDO0lBQzVDLE1BQU0sQ0FBQyxLQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxLQUFLO1FBQ0gsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHt1bmltcGxlbWVudGVkfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtJbmplY3Rvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGkvaW5qZWN0b3InO1xuaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge3d0ZkNyZWF0ZVNjb3BlLCB3dGZMZWF2ZSwgV3RmU2NvcGVGbn0gZnJvbSAnLi4vcHJvZmlsZS9wcm9maWxlJztcblxuaW1wb3J0IHtBcHBFbGVtZW50fSBmcm9tICcuL2VsZW1lbnQnO1xuXG5pbXBvcnQge0VsZW1lbnRSZWZ9IGZyb20gJy4vZWxlbWVudF9yZWYnO1xuaW1wb3J0IHtUZW1wbGF0ZVJlZiwgVGVtcGxhdGVSZWZffSBmcm9tICcuL3RlbXBsYXRlX3JlZic7XG5pbXBvcnQge0VtYmVkZGVkVmlld1JlZiwgVmlld1JlZiwgVmlld1JlZl99IGZyb20gJy4vdmlld19yZWYnO1xuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5LCBDb21wb25lbnRSZWZ9IGZyb20gJy4vY29tcG9uZW50X2ZhY3RvcnknO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBjb250YWluZXIgd2hlcmUgb25lIG9yIG1vcmUgVmlld3MgY2FuIGJlIGF0dGFjaGVkLlxuICpcbiAqIFRoZSBjb250YWluZXIgY2FuIGNvbnRhaW4gdHdvIGtpbmRzIG9mIFZpZXdzLiBIb3N0IFZpZXdzLCBjcmVhdGVkIGJ5IGluc3RhbnRpYXRpbmcgYVxuICoge0BsaW5rIENvbXBvbmVudH0gdmlhIHtAbGluayAjY3JlYXRlQ29tcG9uZW50fSwgYW5kIEVtYmVkZGVkIFZpZXdzLCBjcmVhdGVkIGJ5IGluc3RhbnRpYXRpbmcgYW5cbiAqIHtAbGluayBUZW1wbGF0ZVJlZiBFbWJlZGRlZCBUZW1wbGF0ZX0gdmlhIHtAbGluayAjY3JlYXRlRW1iZWRkZWRWaWV3fS5cbiAqXG4gKiBUaGUgbG9jYXRpb24gb2YgdGhlIFZpZXcgQ29udGFpbmVyIHdpdGhpbiB0aGUgY29udGFpbmluZyBWaWV3IGlzIHNwZWNpZmllZCBieSB0aGUgQW5jaG9yXG4gKiBgZWxlbWVudGAuIEVhY2ggVmlldyBDb250YWluZXIgY2FuIGhhdmUgb25seSBvbmUgQW5jaG9yIEVsZW1lbnQgYW5kIGVhY2ggQW5jaG9yIEVsZW1lbnQgY2FuIG9ubHlcbiAqIGhhdmUgYSBzaW5nbGUgVmlldyBDb250YWluZXIuXG4gKlxuICogUm9vdCBlbGVtZW50cyBvZiBWaWV3cyBhdHRhY2hlZCB0byB0aGlzIGNvbnRhaW5lciBiZWNvbWUgc2libGluZ3Mgb2YgdGhlIEFuY2hvciBFbGVtZW50IGluXG4gKiB0aGUgUmVuZGVyZWQgVmlldy5cbiAqXG4gKiBUbyBhY2Nlc3MgYSBgVmlld0NvbnRhaW5lclJlZmAgb2YgYW4gRWxlbWVudCwgeW91IGNhbiBlaXRoZXIgcGxhY2UgYSB7QGxpbmsgRGlyZWN0aXZlfSBpbmplY3RlZFxuICogd2l0aCBgVmlld0NvbnRhaW5lclJlZmAgb24gdGhlIEVsZW1lbnQsIG9yIHlvdSBvYnRhaW4gaXQgdmlhIGEge0BsaW5rIFZpZXdDaGlsZH0gcXVlcnkuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaWV3Q29udGFpbmVyUmVmIHtcbiAgLyoqXG4gICAqIEFuY2hvciBlbGVtZW50IHRoYXQgc3BlY2lmaWVzIHRoZSBsb2NhdGlvbiBvZiB0aGlzIGNvbnRhaW5lciBpbiB0aGUgY29udGFpbmluZyBWaWV3LlxuICAgKiA8IS0tIFRPRE86IHJlbmFtZSB0byBhbmNob3JFbGVtZW50IC0tPlxuICAgKi9cbiAgZ2V0IGVsZW1lbnQoKTogRWxlbWVudFJlZiB7IHJldHVybiA8RWxlbWVudFJlZj51bmltcGxlbWVudGVkKCk7IH1cblxuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gPEluamVjdG9yPnVuaW1wbGVtZW50ZWQoKTsgfVxuXG4gIGdldCBwYXJlbnRJbmplY3RvcigpOiBJbmplY3RvciB7IHJldHVybiA8SW5qZWN0b3I+dW5pbXBsZW1lbnRlZCgpOyB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGFsbCBWaWV3cyBpbiB0aGlzIGNvbnRhaW5lci5cbiAgICovXG4gIGFic3RyYWN0IGNsZWFyKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHtAbGluayBWaWV3UmVmfSBmb3IgdGhlIFZpZXcgbG9jYXRlZCBpbiB0aGlzIGNvbnRhaW5lciBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0KGluZGV4OiBudW1iZXIpOiBWaWV3UmVmO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgVmlld3MgY3VycmVudGx5IGF0dGFjaGVkIHRvIHRoaXMgY29udGFpbmVyLlxuICAgKi9cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIgeyByZXR1cm4gPG51bWJlcj51bmltcGxlbWVudGVkKCk7IH07XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlcyBhbiBFbWJlZGRlZCBWaWV3IGJhc2VkIG9uIHRoZSB7QGxpbmsgVGVtcGxhdGVSZWYgYHRlbXBsYXRlUmVmYH0gYW5kIGluc2VydHMgaXRcbiAgICogaW50byB0aGlzIGNvbnRhaW5lciBhdCB0aGUgc3BlY2lmaWVkIGBpbmRleGAuXG4gICAqXG4gICAqIElmIGBpbmRleGAgaXMgbm90IHNwZWNpZmllZCwgdGhlIG5ldyBWaWV3IHdpbGwgYmUgaW5zZXJ0ZWQgYXMgdGhlIGxhc3QgVmlldyBpbiB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgVmlld1JlZn0gZm9yIHRoZSBuZXdseSBjcmVhdGVkIFZpZXcuXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVFbWJlZGRlZFZpZXc8Qz4odGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPEM+LCBjb250ZXh0PzogQyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PzogbnVtYmVyKTogRW1iZWRkZWRWaWV3UmVmPEM+O1xuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZXMgYSBzaW5nbGUge0BsaW5rIENvbXBvbmVudH0gYW5kIGluc2VydHMgaXRzIEhvc3QgVmlldyBpbnRvIHRoaXMgY29udGFpbmVyIGF0IHRoZVxuICAgKiBzcGVjaWZpZWQgYGluZGV4YC5cbiAgICpcbiAgICogVGhlIGNvbXBvbmVudCBpcyBpbnN0YW50aWF0ZWQgdXNpbmcgaXRzIHtAbGluayBDb21wb25lbnRGYWN0b3J5fSB3aGljaCBjYW4gYmVcbiAgICogb2J0YWluZWQgdmlhIHtAbGluayBDb21wb25lbnRSZXNvbHZlciNyZXNvbHZlQ29tcG9uZW50fS5cbiAgICpcbiAgICogSWYgYGluZGV4YCBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgbmV3IFZpZXcgd2lsbCBiZSBpbnNlcnRlZCBhcyB0aGUgbGFzdCBWaWV3IGluIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIFlvdSBjYW4gb3B0aW9uYWxseSBzcGVjaWZ5IHRoZSB7QGxpbmsgSW5qZWN0b3J9IHRoYXQgd2lsbCBiZSB1c2VkIGFzIHBhcmVudCBmb3IgdGhlIENvbXBvbmVudC5cbiAgICpcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIENvbXBvbmVudFJlZn0gb2YgdGhlIEhvc3QgVmlldyBjcmVhdGVkIGZvciB0aGUgbmV3bHkgaW5zdGFudGlhdGVkIENvbXBvbmVudC5cbiAgICovXG4gIGFic3RyYWN0IGNyZWF0ZUNvbXBvbmVudDxDPihjb21wb25lbnRGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PEM+LCBpbmRleD86IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdG9yPzogSW5qZWN0b3IsIHByb2plY3RhYmxlTm9kZXM/OiBhbnlbXVtdKTogQ29tcG9uZW50UmVmPEM+O1xuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgVmlldyBpZGVudGlmaWVkIGJ5IGEge0BsaW5rIFZpZXdSZWZ9IGludG8gdGhlIGNvbnRhaW5lciBhdCB0aGUgc3BlY2lmaWVkIGBpbmRleGAuXG4gICAqXG4gICAqIElmIGBpbmRleGAgaXMgbm90IHNwZWNpZmllZCwgdGhlIG5ldyBWaWV3IHdpbGwgYmUgaW5zZXJ0ZWQgYXMgdGhlIGxhc3QgVmlldyBpbiB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSBpbnNlcnRlZCB7QGxpbmsgVmlld1JlZn0uXG4gICAqL1xuICBhYnN0cmFjdCBpbnNlcnQodmlld1JlZjogVmlld1JlZiwgaW5kZXg/OiBudW1iZXIpOiBWaWV3UmVmO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgVmlldywgc3BlY2lmaWVkIHZpYSB7QGxpbmsgVmlld1JlZn0sIHdpdGhpbiB0aGUgY3VycmVudCBjb250YWluZXIgb3JcbiAgICogYC0xYCBpZiB0aGlzIGNvbnRhaW5lciBkb2Vzbid0IGNvbnRhaW4gdGhlIFZpZXcuXG4gICAqL1xuICBhYnN0cmFjdCBpbmRleE9mKHZpZXdSZWY6IFZpZXdSZWYpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGEgVmlldyBhdHRhY2hlZCB0byB0aGlzIGNvbnRhaW5lciBhdCB0aGUgc3BlY2lmaWVkIGBpbmRleGAuXG4gICAqXG4gICAqIElmIGBpbmRleGAgaXMgbm90IHNwZWNpZmllZCwgdGhlIGxhc3QgVmlldyBpbiB0aGUgY29udGFpbmVyIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICovXG4gIGFic3RyYWN0IHJlbW92ZShpbmRleD86IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFVzZSBhbG9uZyB3aXRoIHtAbGluayAjaW5zZXJ0fSB0byBtb3ZlIGEgVmlldyB3aXRoaW4gdGhlIGN1cnJlbnQgY29udGFpbmVyLlxuICAgKlxuICAgKiBJZiB0aGUgYGluZGV4YCBwYXJhbSBpcyBvbWl0dGVkLCB0aGUgbGFzdCB7QGxpbmsgVmlld1JlZn0gaXMgZGV0YWNoZWQuXG4gICAqL1xuICBhYnN0cmFjdCBkZXRhY2goaW5kZXg/OiBudW1iZXIpOiBWaWV3UmVmO1xufVxuXG5leHBvcnQgY2xhc3MgVmlld0NvbnRhaW5lclJlZl8gaW1wbGVtZW50cyBWaWV3Q29udGFpbmVyUmVmIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogQXBwRWxlbWVudCkge31cblxuICBnZXQoaW5kZXg6IG51bWJlcik6IFZpZXdSZWYgeyByZXR1cm4gdGhpcy5fZWxlbWVudC5uZXN0ZWRWaWV3c1tpbmRleF0ucmVmOyB9XG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICB2YXIgdmlld3MgPSB0aGlzLl9lbGVtZW50Lm5lc3RlZFZpZXdzO1xuICAgIHJldHVybiBpc1ByZXNlbnQodmlld3MpID8gdmlld3MubGVuZ3RoIDogMDtcbiAgfVxuXG4gIGdldCBlbGVtZW50KCk6IEVsZW1lbnRSZWYgeyByZXR1cm4gdGhpcy5fZWxlbWVudC5lbGVtZW50UmVmOyB9XG5cbiAgZ2V0IGluamVjdG9yKCk6IEluamVjdG9yIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuaW5qZWN0b3I7IH1cblxuICBnZXQgcGFyZW50SW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gdGhpcy5fZWxlbWVudC5wYXJlbnRJbmplY3RvcjsgfVxuXG4gIC8vIFRPRE8ocmFkbyk6IHByb2ZpbGUgYW5kIGRlY2lkZSB3aGV0aGVyIGJvdW5kcyBjaGVja3Mgc2hvdWxkIGJlIGFkZGVkXG4gIC8vIHRvIHRoZSBtZXRob2RzIGJlbG93LlxuICBjcmVhdGVFbWJlZGRlZFZpZXc8Qz4odGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPEM+LCBjb250ZXh0OiBDID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBudW1iZXIgPSAtMSk6IEVtYmVkZGVkVmlld1JlZjxDPiB7XG4gICAgdmFyIHZpZXdSZWY6IEVtYmVkZGVkVmlld1JlZjxhbnk+ID0gdGVtcGxhdGVSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbnRleHQpO1xuICAgIHRoaXMuaW5zZXJ0KHZpZXdSZWYsIGluZGV4KTtcbiAgICByZXR1cm4gdmlld1JlZjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NyZWF0ZUNvbXBvbmVudEluQ29udGFpbmVyU2NvcGU6IFd0ZlNjb3BlRm4gPVxuICAgICAgd3RmQ3JlYXRlU2NvcGUoJ1ZpZXdDb250YWluZXJSZWYjY3JlYXRlQ29tcG9uZW50KCknKTtcblxuICBjcmVhdGVDb21wb25lbnQ8Qz4oY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxDPiwgaW5kZXg6IG51bWJlciA9IC0xLFxuICAgICAgICAgICAgICAgICAgICAgaW5qZWN0b3I6IEluamVjdG9yID0gbnVsbCwgcHJvamVjdGFibGVOb2RlczogYW55W11bXSA9IG51bGwpOiBDb21wb25lbnRSZWY8Qz4ge1xuICAgIHZhciBzID0gdGhpcy5fY3JlYXRlQ29tcG9uZW50SW5Db250YWluZXJTY29wZSgpO1xuICAgIHZhciBjb250ZXh0SW5qZWN0b3IgPSBpc1ByZXNlbnQoaW5qZWN0b3IpID8gaW5qZWN0b3IgOiB0aGlzLl9lbGVtZW50LnBhcmVudEluamVjdG9yO1xuICAgIHZhciBjb21wb25lbnRSZWYgPSBjb21wb25lbnRGYWN0b3J5LmNyZWF0ZShjb250ZXh0SW5qZWN0b3IsIHByb2plY3RhYmxlTm9kZXMpO1xuICAgIHRoaXMuaW5zZXJ0KGNvbXBvbmVudFJlZi5ob3N0VmlldywgaW5kZXgpO1xuICAgIHJldHVybiB3dGZMZWF2ZShzLCBjb21wb25lbnRSZWYpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5zZXJ0U2NvcGUgPSB3dGZDcmVhdGVTY29wZSgnVmlld0NvbnRhaW5lclJlZiNpbnNlcnQoKScpO1xuXG4gIC8vIFRPRE8oaSk6IHJlZmFjdG9yIGluc2VydCtyZW1vdmUgaW50byBtb3ZlXG4gIGluc2VydCh2aWV3UmVmOiBWaWV3UmVmLCBpbmRleDogbnVtYmVyID0gLTEpOiBWaWV3UmVmIHtcbiAgICB2YXIgcyA9IHRoaXMuX2luc2VydFNjb3BlKCk7XG4gICAgaWYgKGluZGV4ID09IC0xKSBpbmRleCA9IHRoaXMubGVuZ3RoO1xuICAgIHZhciB2aWV3UmVmXyA9IDxWaWV3UmVmXzxhbnk+PnZpZXdSZWY7XG4gICAgdGhpcy5fZWxlbWVudC5hdHRhY2hWaWV3KHZpZXdSZWZfLmludGVybmFsVmlldywgaW5kZXgpO1xuICAgIHJldHVybiB3dGZMZWF2ZShzLCB2aWV3UmVmXyk7XG4gIH1cblxuICBpbmRleE9mKHZpZXdSZWY6IFZpZXdSZWYpOiBudW1iZXIge1xuICAgIHJldHVybiBMaXN0V3JhcHBlci5pbmRleE9mKHRoaXMuX2VsZW1lbnQubmVzdGVkVmlld3MsICg8Vmlld1JlZl88YW55Pj52aWV3UmVmKS5pbnRlcm5hbFZpZXcpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVtb3ZlU2NvcGUgPSB3dGZDcmVhdGVTY29wZSgnVmlld0NvbnRhaW5lclJlZiNyZW1vdmUoKScpO1xuXG4gIC8vIFRPRE8oaSk6IHJlbmFtZSB0byBkZXN0cm95XG4gIHJlbW92ZShpbmRleDogbnVtYmVyID0gLTEpOiB2b2lkIHtcbiAgICB2YXIgcyA9IHRoaXMuX3JlbW92ZVNjb3BlKCk7XG4gICAgaWYgKGluZGV4ID09IC0xKSBpbmRleCA9IHRoaXMubGVuZ3RoIC0gMTtcbiAgICB2YXIgdmlldyA9IHRoaXMuX2VsZW1lbnQuZGV0YWNoVmlldyhpbmRleCk7XG4gICAgdmlldy5kZXN0cm95KCk7XG4gICAgLy8gdmlldyBpcyBpbnRlbnRpb25hbGx5IG5vdCByZXR1cm5lZCB0byB0aGUgY2xpZW50LlxuICAgIHd0ZkxlYXZlKHMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGV0YWNoU2NvcGUgPSB3dGZDcmVhdGVTY29wZSgnVmlld0NvbnRhaW5lclJlZiNkZXRhY2goKScpO1xuXG4gIC8vIFRPRE8oaSk6IHJlZmFjdG9yIGluc2VydCtyZW1vdmUgaW50byBtb3ZlXG4gIGRldGFjaChpbmRleDogbnVtYmVyID0gLTEpOiBWaWV3UmVmIHtcbiAgICB2YXIgcyA9IHRoaXMuX2RldGFjaFNjb3BlKCk7XG4gICAgaWYgKGluZGV4ID09IC0xKSBpbmRleCA9IHRoaXMubGVuZ3RoIC0gMTtcbiAgICB2YXIgdmlldyA9IHRoaXMuX2VsZW1lbnQuZGV0YWNoVmlldyhpbmRleCk7XG4gICAgcmV0dXJuIHd0ZkxlYXZlKHMsIHZpZXcucmVmKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGZvciAodmFyIGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aGlzLnJlbW92ZShpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==