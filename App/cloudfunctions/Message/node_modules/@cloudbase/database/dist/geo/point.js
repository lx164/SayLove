"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validate_1 = require("../validate");
var symbol_1 = require("../helper/symbol");
var type_1 = require("../utils/type");
var Point = (function () {
    function Point(longitude, latitude) {
        validate_1.Validate.isGeopoint('longitude', longitude);
        validate_1.Validate.isGeopoint('latitude', latitude);
        this.longitude = longitude;
        this.latitude = latitude;
    }
    Point.prototype.parse = function (key) {
        var _a;
        return _a = {},
            _a[key] = {
                type: 'Point',
                coordinates: [this.longitude, this.latitude]
            },
            _a;
    };
    Point.prototype.toJSON = function () {
        return {
            type: 'Point',
            coordinates: [
                this.longitude,
                this.latitude,
            ],
        };
    };
    Point.prototype.toReadableString = function () {
        return "[" + this.longitude + "," + this.latitude + "]";
    };
    Point.validate = function (point) {
        return point.type === 'Point' &&
            type_1.isArray(point.coordinates) &&
            validate_1.Validate.isGeopoint('longitude', point.coordinates[0]) &&
            validate_1.Validate.isGeopoint('latitude', point.coordinates[1]);
    };
    Object.defineProperty(Point.prototype, "_internalType", {
        get: function () {
            return symbol_1.SYMBOL_GEO_POINT;
        },
        enumerable: true,
        configurable: true
    });
    return Point;
}());
exports.Point = Point;
