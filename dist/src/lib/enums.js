"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.PaymentMethod = exports.DeliveryStatus = exports.ProductCategory = void 0;
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["ELECTRONICS"] = "electronics";
    ProductCategory["CLOTHING"] = "clothing";
    ProductCategory["SPORTS_AND_OUTDOORS"] = "sports_and_outdoor";
    ProductCategory["FOOTWEAR"] = "footwear";
    ProductCategory["BOOKS"] = "books";
})(ProductCategory = exports.ProductCategory || (exports.ProductCategory = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["DELIVERED"] = "delivered";
    DeliveryStatus["PENDING"] = "pending";
})(DeliveryStatus = exports.DeliveryStatus || (exports.DeliveryStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["ONLINE"] = "online";
    PaymentMethod["CASH"] = "cash";
})(PaymentMethod = exports.PaymentMethod || (exports.PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["PENDING"] = "pending";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
//# sourceMappingURL=enums.js.map