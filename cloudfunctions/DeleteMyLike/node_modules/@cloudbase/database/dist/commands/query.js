"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var logic_1 = require("./logic");
var symbol_1 = require("../helper/symbol");
var geo_1 = require("../geo");
var type_1 = require("../utils/type");
exports.EQ = 'eq';
exports.NEQ = 'neq';
exports.GT = 'gt';
exports.GTE = 'gte';
exports.LT = 'lt';
exports.LTE = 'lte';
exports.IN = 'in';
exports.NIN = 'nin';
var QUERY_COMMANDS_LITERAL;
(function (QUERY_COMMANDS_LITERAL) {
    QUERY_COMMANDS_LITERAL["EQ"] = "eq";
    QUERY_COMMANDS_LITERAL["NEQ"] = "neq";
    QUERY_COMMANDS_LITERAL["GT"] = "gt";
    QUERY_COMMANDS_LITERAL["GTE"] = "gte";
    QUERY_COMMANDS_LITERAL["LT"] = "lt";
    QUERY_COMMANDS_LITERAL["LTE"] = "lte";
    QUERY_COMMANDS_LITERAL["IN"] = "in";
    QUERY_COMMANDS_LITERAL["NIN"] = "nin";
    QUERY_COMMANDS_LITERAL["GEO_NEAR"] = "geoNear";
    QUERY_COMMANDS_LITERAL["GEO_WITHIN"] = "geoWithin";
    QUERY_COMMANDS_LITERAL["GEO_INTERSECTS"] = "geoIntersects";
})(QUERY_COMMANDS_LITERAL = exports.QUERY_COMMANDS_LITERAL || (exports.QUERY_COMMANDS_LITERAL = {}));
var QueryCommand = (function (_super) {
    __extends(QueryCommand, _super);
    function QueryCommand(operator, operands, fieldName) {
        var _this = _super.call(this, operator, operands, fieldName) || this;
        _this.operator = operator;
        _this._internalType = symbol_1.SYMBOL_QUERY_COMMAND;
        return _this;
    }
    QueryCommand.prototype._setFieldName = function (fieldName) {
        var command = new QueryCommand(this.operator, this.operands, fieldName);
        return command;
    };
    QueryCommand.prototype.eq = function (val) {
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.EQ, [val], this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.neq = function (val) {
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.NEQ, [val], this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.gt = function (val) {
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.GT, [val], this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.gte = function (val) {
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.GTE, [val], this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.lt = function (val) {
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.LT, [val], this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.lte = function (val) {
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.LTE, [val], this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.in = function (list) {
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.IN, list, this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.nin = function (list) {
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.NIN, list, this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.geoNear = function (val) {
        if (!(val.geometry instanceof geo_1.Point)) {
            throw new TypeError("\"geometry\" must be of type Point. Received type " + typeof val.geometry);
        }
        if (val.maxDistance !== undefined && !type_1.isNumber(val.maxDistance)) {
            throw new TypeError("\"maxDistance\" must be of type Number. Received type " + typeof val.maxDistance);
        }
        if (val.minDistance !== undefined && !type_1.isNumber(val.minDistance)) {
            throw new TypeError("\"minDistance\" must be of type Number. Received type " + typeof val.minDistance);
        }
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_NEAR, [val], this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.geoWithin = function (val) {
        if (!(val.geometry instanceof geo_1.MultiPolygon) && !(val.geometry instanceof geo_1.Polygon)) {
            throw new TypeError("\"geometry\" must be of type Polygon or MultiPolygon. Received type " + typeof val.geometry);
        }
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_WITHIN, [val], this.fieldName);
        return this.and(command);
    };
    QueryCommand.prototype.geoIntersects = function (val) {
        if (!(val.geometry instanceof geo_1.Point) &&
            !(val.geometry instanceof geo_1.LineString) &&
            !(val.geometry instanceof geo_1.Polygon) &&
            !(val.geometry instanceof geo_1.MultiPoint) &&
            !(val.geometry instanceof geo_1.MultiLineString) &&
            !(val.geometry instanceof geo_1.MultiPolygon)) {
            throw new TypeError("\"geometry\" must be of type Point, LineString, Polygon, MultiPoint, MultiLineString or MultiPolygon. Received type " + typeof val.geometry);
        }
        var command = new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_INTERSECTS, [val], this.fieldName);
        return this.and(command);
    };
    return QueryCommand;
}(logic_1.LogicCommand));
exports.QueryCommand = QueryCommand;
function isQueryCommand(object) {
    return object && object instanceof QueryCommand && object._internalType === symbol_1.SYMBOL_QUERY_COMMAND;
}
exports.isQueryCommand = isQueryCommand;
function isKnownQueryCommand(object) {
    return isQueryCommand(object) && object.operator.toUpperCase() in QUERY_COMMANDS_LITERAL;
}
exports.isKnownQueryCommand = isKnownQueryCommand;
function isComparisonCommand(object) {
    return isQueryCommand(object);
}
exports.isComparisonCommand = isComparisonCommand;
exports.default = QueryCommand;
