"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("./symbol");
exports.getType = function (x) { return Object.prototype.toString.call(x).slice(8, -1).toLowerCase(); };
exports.isObject = function (x) { return exports.getType(x) === 'object'; };
exports.isString = function (x) { return exports.getType(x) === 'string'; };
exports.isNumber = function (x) { return exports.getType(x) === 'number'; };
exports.isPromise = function (x) { return exports.getType(x) === 'promise'; };
exports.isFunction = function (x) { return typeof x === 'function'; };
exports.isArray = function (x) { return Array.isArray(x); };
exports.isDate = function (x) { return exports.getType(x) === 'date'; };
exports.isRegExp = function (x) { return exports.getType(x) === 'regexp'; };
exports.isInternalObject = function (x) { return x && (x._internalType instanceof symbol_1.InternalSymbol); };
exports.isPlainObject = function (obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    var proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
};
