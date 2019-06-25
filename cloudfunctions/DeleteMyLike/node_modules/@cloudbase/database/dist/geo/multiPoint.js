"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var point_1 = require("./point");
var type_1 = require("../utils/type");
var MultiPoint = (function () {
    function MultiPoint(points) {
        if (!type_1.isArray(points)) {
            throw new TypeError("\"points\" must be of type Point[]. Received type " + typeof points);
        }
        if (points.length === 0) {
            throw new Error('"points" must contain 1 point at least');
        }
        points.forEach(function (point) {
            if (!(point instanceof point_1.Point)) {
                throw new TypeError("\"points\" must be of type Point[]. Received type " + typeof point + "[]");
            }
        });
        this.points = points;
    }
    MultiPoint.prototype.parse = function (key) {
        var _a;
        return _a = {},
            _a[key] = {
                type: 'MultiPoint',
                coordinates: this.points.map(function (point) { return point.toJSON().coordinates; })
            },
            _a;
    };
    MultiPoint.prototype.toJSON = function () {
        return {
            type: 'MultiPoint',
            coordinates: this.points.map(function (point) { return point.toJSON().coordinates; })
        };
    };
    MultiPoint.validate = function (multiPoint) {
        if (multiPoint.type !== 'MultiPoint' || !type_1.isArray(multiPoint.coordinates)) {
            return false;
        }
        for (var _i = 0, _a = multiPoint.coordinates; _i < _a.length; _i++) {
            var point = _a[_i];
            if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(MultiPoint.prototype, "_internalType", {
        get: function () {
            return symbol_1.SYMBOL_GEO_MULTI_POINT;
        },
        enumerable: true,
        configurable: true
    });
    return MultiPoint;
}());
exports.MultiPoint = MultiPoint;
