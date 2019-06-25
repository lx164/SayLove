"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var type_1 = require("../utils/type");
var lineString_1 = require("./lineString");
var Polygon = (function () {
    function Polygon(lines) {
        if (!type_1.isArray(lines)) {
            throw new TypeError("\"lines\" must be of type LineString[]. Received type " + typeof lines);
        }
        if (lines.length === 0) {
            throw new Error('Polygon must contain 1 linestring at least');
        }
        lines.forEach(function (line) {
            if (!(line instanceof lineString_1.LineString)) {
                throw new TypeError("\"lines\" must be of type LineString[]. Received type " + typeof line + "[]");
            }
            if (!lineString_1.LineString.isClosed(line)) {
                throw new Error("LineString " + line.points.map(function (p) { return p.toReadableString(); }) + " is not a closed cycle");
            }
        });
        this.lines = lines;
    }
    Polygon.prototype.parse = function (key) {
        var _a;
        return _a = {},
            _a[key] = {
                type: 'Polygon',
                coordinates: this.lines.map(function (line) {
                    return line.points.map(function (point) { return [point.longitude, point.latitude]; });
                })
            },
            _a;
    };
    Polygon.prototype.toJSON = function () {
        return {
            type: 'Polygon',
            coordinates: this.lines.map(function (line) {
                return line.points.map(function (point) { return [point.longitude, point.latitude]; });
            })
        };
    };
    Polygon.validate = function (polygon) {
        if (polygon.type !== 'Polygon' || !type_1.isArray(polygon.coordinates)) {
            return false;
        }
        for (var _i = 0, _a = polygon.coordinates; _i < _a.length; _i++) {
            var line = _a[_i];
            if (!this.isCloseLineString(line)) {
                return false;
            }
            for (var _b = 0, line_1 = line; _b < line_1.length; _b++) {
                var point = line_1[_b];
                if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                    return false;
                }
            }
        }
        return true;
    };
    Polygon.isCloseLineString = function (lineString) {
        var firstPoint = lineString[0];
        var lastPoint = lineString[lineString.length - 1];
        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
            return false;
        }
        return true;
    };
    Object.defineProperty(Polygon.prototype, "_internalType", {
        get: function () {
            return symbol_1.SYMBOL_GEO_MULTI_POLYGON;
        },
        enumerable: true,
        configurable: true
    });
    return Polygon;
}());
exports.Polygon = Polygon;
