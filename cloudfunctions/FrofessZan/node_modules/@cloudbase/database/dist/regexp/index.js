"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var RegExp = (function () {
    function RegExp(_a) {
        var regexp = _a.regexp, options = _a.options;
        if (!regexp) {
            throw new TypeError('regexp must be a string');
        }
        this.$regex = regexp;
        this.$options = options;
    }
    RegExp.prototype.parse = function () {
        return {
            $regex: this.$regex,
            $options: this.$options
        };
    };
    Object.defineProperty(RegExp.prototype, "_internalType", {
        get: function () {
            return symbol_1.SYMBOL_REGEXP;
        },
        enumerable: true,
        configurable: true
    });
    return RegExp;
}());
exports.RegExp = RegExp;
function RegExpConstructor(param) {
    return new RegExp(param);
}
exports.RegExpConstructor = RegExpConstructor;
