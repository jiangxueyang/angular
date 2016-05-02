import { Type } from 'angular2/src/facade/lang';
import { CanActivate } from './lifecycle_annotations_impl';
import { reflector } from 'angular2/src/core/reflection/reflection';
export function hasLifecycleHook(e, type) {
    if (!(type instanceof Type))
        return false;
    return e.name in type.prototype;
}
export function getCanActivateHook(type) {
    var annotations = reflector.annotations(type);
    for (let i = 0; i < annotations.length; i += 1) {
        let annotation = annotations[i];
        if (annotation instanceof CanActivate) {
            return annotation.fn;
        }
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVfbGlmZWN5Y2xlX3JlZmxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtUzNpeFFwc3MudG1wL2FuZ3VsYXIyL3NyYy9yb3V0ZXIvbGlmZWN5Y2xlL3JvdXRlX2xpZmVjeWNsZV9yZWZsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxJQUFJLEVBQVUsTUFBTSwwQkFBMEI7T0FDL0MsRUFBcUIsV0FBVyxFQUFDLE1BQU0sOEJBQThCO09BQ3JFLEVBQUMsU0FBUyxFQUFDLE1BQU0seUNBQXlDO0FBRWpFLGlDQUFpQyxDQUFxQixFQUFFLElBQUk7SUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDMUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQVMsSUFBSyxDQUFDLFNBQVMsQ0FBQztBQUN4QyxDQUFDO0FBRUQsbUNBQW1DLElBQUk7SUFDckMsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQy9DLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxVQUFVLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUN2QixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUeXBlLCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtSb3V0ZUxpZmVjeWNsZUhvb2ssIENhbkFjdGl2YXRlfSBmcm9tICcuL2xpZmVjeWNsZV9hbm5vdGF0aW9uc19pbXBsJztcbmltcG9ydCB7cmVmbGVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3JlZmxlY3Rpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzTGlmZWN5Y2xlSG9vayhlOiBSb3V0ZUxpZmVjeWNsZUhvb2ssIHR5cGUpOiBib29sZWFuIHtcbiAgaWYgKCEodHlwZSBpbnN0YW5jZW9mIFR5cGUpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBlLm5hbWUgaW4oPGFueT50eXBlKS5wcm90b3R5cGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYW5BY3RpdmF0ZUhvb2sodHlwZSk6IEZ1bmN0aW9uIHtcbiAgdmFyIGFubm90YXRpb25zID0gcmVmbGVjdG9yLmFubm90YXRpb25zKHR5cGUpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFubm90YXRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgbGV0IGFubm90YXRpb24gPSBhbm5vdGF0aW9uc1tpXTtcbiAgICBpZiAoYW5ub3RhdGlvbiBpbnN0YW5jZW9mIENhbkFjdGl2YXRlKSB7XG4gICAgICByZXR1cm4gYW5ub3RhdGlvbi5mbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==