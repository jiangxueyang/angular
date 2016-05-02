'use strict';"use strict";
var provider_1 = require('./provider');
function isProviderLiteral(obj) {
    return obj && typeof obj == 'object' && obj.provide;
}
exports.isProviderLiteral = isProviderLiteral;
function createProvider(obj) {
    return new provider_1.Provider(obj.provide, obj);
}
exports.createProvider = createProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtdW93Njd0MTIudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2RpL3Byb3ZpZGVyX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlCQUF1QixZQUFZLENBQUMsQ0FBQTtBQUVwQywyQkFBa0MsR0FBUTtJQUN4QyxNQUFNLENBQUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQ3RELENBQUM7QUFGZSx5QkFBaUIsb0JBRWhDLENBQUE7QUFFRCx3QkFBK0IsR0FBUTtJQUNyQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUZlLHNCQUFjLGlCQUU3QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQcm92aWRlcn0gZnJvbSAnLi9wcm92aWRlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3ZpZGVyTGl0ZXJhbChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT0gJ29iamVjdCcgJiYgb2JqLnByb3ZpZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm92aWRlcihvYmo6IGFueSk6IFByb3ZpZGVyIHtcbiAgcmV0dXJuIG5ldyBQcm92aWRlcihvYmoucHJvdmlkZSwgb2JqKTtcbn1cbiJdfQ==