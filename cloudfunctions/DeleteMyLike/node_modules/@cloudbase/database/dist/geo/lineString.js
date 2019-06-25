"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var point_1 = require("./point");
var type_1 = require("../utils/type");
var LineString = (function () {
    function LineString(points) {
        if (!type_1.isArray(points)) {
            throw new TypeError("\"points\" must be of type Point[]. Received type " + typeof points);
        }
        if (points.length < 2) {
            throw new Error('"points" must contain 2 points at least');
        }
        points.forEach(function (point) {
            if (!(point instanceof point_1.Point)) {
                throw new TypeError("\"points\" must be of type Point[]. Received type " + typeof point + "[]");
            }
        });
        this.points = points;
    }
    LineString.prototype.parse = function (key) {
        var _a;
        return _a = {},
            _a[key] = {
                type: 'LineString',
                coordinates: this.points.map(function (point) { return point.toJSON().coordinates; })
            },
            _a;
    };
    LineString.prototype.toJSON = function () {
        return {
            type: 'LineString',
            coordinates: this.points.map(function (point) { return point.toJSON().coordinates; })
        };
    };
    LineString.validate = function (lineString) {
        if (lineString.type !== 'LineString' || !type_1.isArray(lineString.coordinates)) {
            return false;
        }
        for (var _i = 0, _a = lineString.coordinates; _i < _a.length; _i++) {
            var point = _a[_i];
            if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                return false;
            }
        }
        return true;
    };
    LineString.isClosed = function (lineString) {
        var firstPoint = lineString.points[0];
        var lastPoint = lineString.points[lineString.points.length - 1];
        if (firstPoint.latitude === lastPoint.latitude && firstPoint.longitude === lastPoint.longitude) {
            return true;
        }
    };
    Object.defineProperty(LineString.prototype, "_internalType", {
        get: function () {
            return symbol_1.SYMBOL_GEO_LINE_STRING;
        },
        enumerable: true,
        configurable: true
    });
    return LineString;
}());
exports.LineString = LineString;
