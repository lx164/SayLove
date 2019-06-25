"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var ServerDate = (function () {
    function ServerDate(_a) {
        var _b = (_a === void 0 ? {} : _a).offset, offset = _b === void 0 ? 0 : _b;
        this.offset = offset;
    }
    Object.defineProperty(ServerDate.prototype, "_internalType", {
        get: function () {
            return symbol_1.SYMBOL_SERVER_DATE;
        },
        enumerable: true,
        configurable: true
    });
    ServerDate.prototype.parse = function () {
        return {
            $date: {
                offset: this.offset
            }
        };
    };
    return ServerDate;
}());
exports.ServerDate = ServerDate;
function ServerDateConstructor(opt) {
    return new ServerDate(opt);
}
exports.ServerDateConstructor = ServerDateConstructor;
