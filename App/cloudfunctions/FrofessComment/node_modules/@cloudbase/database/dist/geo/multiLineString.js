"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var type_1 = require("../utils/type");
var lineString_1 = require("./lineString");
var MultiLineString = (function () {
    function MultiLineString(lines) {
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
        });
        this.lines = lines;
    }
    MultiLineString.prototype.parse = function (key) {
        var _a;
        return _a = {},
            _a[key] = {
                type: 'MultiLineString',
                coordinates: this.lines.map(function (line) {
                    return line.points.map(function (point) { return [point.longitude, point.latitude]; });
                })
            },
            _a;
    };
    MultiLineString.prototype.toJSON = function () {
        return {
            type: 'MultiLineString',
            coordinates: this.lines.map(function (line) {
                return line.points.map(function (point) { return [point.longitude, point.latitude]; });
            })
        };
    };
    MultiLineString.validate = function (multiLineString) {
        if (multiLineString.type !== 'MultiLineString' || !type_1.isArray(multiLineString.coordinates)) {
            return false;
        }
        for (var _i = 0, _a = multiLineString.coordinates; _i < _a.length; _i++) {
            var line = _a[_i];
            for (var _b = 0, line_1 = line; _b < line_1.length; _b++) {
                var point = line_1[_b];
                if (!type_1.isNumber(point[0]) || !type_1.isNumber(point[1])) {
                    return false;
                }
            }
        }
        return true;
    };
    Object.defineProperty(MultiLineString.prototype, "_internalType", {
        get: function () {
            return symbol_1.SYMBOL_GEO_MULTI_LINE_STRING;
        },
        enumerable: true,
        configurable: true
    });
    return MultiLineString;
}());
exports.MultiLineString = MultiLineString;
