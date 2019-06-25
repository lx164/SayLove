"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_1 = require("./commands/query");
var logic_1 = require("./commands/logic");
var update_1 = require("./commands/update");
var type_1 = require("./utils/type");
exports.Command = {
    eq: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.EQ, [val]);
    },
    neq: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.NEQ, [val]);
    },
    lt: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.LT, [val]);
    },
    lte: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.LTE, [val]);
    },
    gt: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GT, [val]);
    },
    gte: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GTE, [val]);
    },
    in: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.IN, val);
    },
    nin: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.NIN, val);
    },
    geoNear: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_NEAR, [val]);
    },
    geoWithin: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_WITHIN, [val]);
    },
    geoIntersects: function (val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_INTERSECTS, [val]);
    },
    and: function () {
        var __expressions__ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            __expressions__[_i] = arguments[_i];
        }
        var expressions = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new logic_1.LogicCommand(logic_1.LOGIC_COMMANDS_LITERAL.AND, expressions);
    },
    or: function () {
        var __expressions__ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            __expressions__[_i] = arguments[_i];
        }
        var expressions = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new logic_1.LogicCommand(logic_1.LOGIC_COMMANDS_LITERAL.OR, expressions);
    },
    set: function (val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.SET, [val]);
    },
    remove: function () {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.REMOVE, []);
    },
    inc: function (val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.INC, [val]);
    },
    mul: function (val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.MUL, [val]);
    },
    push: function () {
        var __values__ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            __values__[_i] = arguments[_i];
        }
        var values = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.PUSH, values);
    },
    pop: function () {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.POP, []);
    },
    shift: function () {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.SHIFT, []);
    },
    unshift: function () {
        var __values__ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            __values__[_i] = arguments[_i];
        }
        var values = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT, values);
    },
};
exports.default = exports.Command;
