"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var type_1 = require("../utils/type");
var polygon_1 = require("./polygon");
var MultiPolygon = (function () {
    function MultiPolygon(polygons) {
        if (!type_1.isArray(polygons)) {
            throw new TypeError("\"polygons\" must be of type Polygon[]. Received type " + typeof polygons);
        }
        if (polygons.length === 0) {
            throw new Error('MultiPolygon must contain 1 polygon at least');
        }
        for (var _i = 0, polygons_1 = polygons; _i < polygons_1.length; _i++) {
            var polygon = polygons_1[_i];
            if (!(polygon instanceof polygon_1.Polygon)) {
                throw new TypeError("\"polygon\" must be of type Polygon[]. Received type " + typeof polygon + "[]");
            }
        }
        this.polygons = polygons;
    }
    MultiPolygon.prototype.parse = function (key) {
        var _a;
        return _a = {},
            _a[key] = {
                type: 'MultiPolygon',
                coordinates: this.polygons.map(function (polygon) {
                    return polygon.lines.map(function (line) {
                        return line.points.map(function (point) { return [point.longitude, point.latitude]; });
                    });
                })
            },
            _a;
    };
    MultiPolygon.prototype.toJSON = function () {
        return {
            type: 'MultiPolygon',
            coordinates: this.polygons.map(function (polygon) {
                return polygon.lines.map(function (line) {
                    return line.points.map(function (point) { return [point.longitude, point.latitude]; });
                });
            })
        };
    };
    MultiPolygon.validate = function (multiPolygon) {
        if (multiPolygon.type !== 'MultiPolygon' || !type_1.isArray(multiPolygon.coordinates)) {
            return false;
        }
        for (var _i = 0, _a = multiPolygon.coordinates; _i < _a.length; _i++) {
            var polygon = _a[_i];
            for (var _b = 0, polygon_2 = polygon; _b < polygon_2.length; _b++) {
                var line = polygon_2[_b];
                for (var _c = 0, line_1 = line; _c < line_1.length; _c++) {
                    var point = line_1[_c];
                    if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    Object.defineProperty(MultiPolygon.prototype, "_internalType", {
        get: function () {
            return symbol_1.SYMBOL_GEO_POLYGON;
        },
        enumerable: true,
        configurable: true
    });
    return MultiPolygon;
}());
exports.MultiPolygon = MultiPolygon;
