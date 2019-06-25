"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var type_1 = require("../utils/type");
var geo_1 = require("../geo");
var serverDate_1 = require("../serverDate");
function serialize(val) {
    return serializeHelper(val, [val]);
}
exports.serialize = serialize;
function serializeHelper(val, visited) {
    if (type_1.isInternalObject(val)) {
        switch (val._internalType) {
            case symbol_1.SYMBOL_GEO_POINT: {
                return val.toJSON();
            }
            case symbol_1.SYMBOL_SERVER_DATE: {
                return val.parse();
            }
            case symbol_1.SYMBOL_REGEXP: {
                return val.parse();
            }
            default: {
                return val.toJSON ? val.toJSON() : val;
            }
        }
    }
    else if (type_1.isDate(val)) {
        return {
            $date: +val,
        };
    }
    else if (type_1.isRegExp(val)) {
        return {
            $regex: val.source,
            $options: val.flags,
        };
    }
    else if (type_1.isArray(val)) {
        return val.map(function (item) {
            if (visited.indexOf(item) > -1) {
                throw new Error('Cannot convert circular structure to JSON');
            }
            return serializeHelper(item, visited.concat([
                item,
            ]));
        });
    }
    else if (type_1.isObject(val)) {
        var ret = __assign({}, val);
        for (var key in ret) {
            if (visited.indexOf(ret[key]) > -1) {
                throw new Error('Cannot convert circular structure to JSON');
            }
            ret[key] = serializeHelper(ret[key], visited.concat([
                ret[key],
            ]));
        }
        return ret;
    }
    else {
        return val;
    }
}
function deserialize(object) {
    var ret = __assign({}, object);
    for (var key in ret) {
        switch (key) {
            case '$date': {
                switch (type_1.getType(ret[key])) {
                    case 'number': {
                        return new Date(ret[key]);
                    }
                    case 'object': {
                        return new serverDate_1.ServerDate(ret[key]);
                    }
                }
                break;
            }
            case 'type': {
                switch (ret.type) {
                    case 'Point': {
                        if (type_1.isArray(ret.coordinates) && type_1.isNumber(ret.coordinates[0]) && type_1.isNumber(ret.coordinates[1])) {
                            return new geo_1.Point(ret.coordinates[0], ret.coordinates[1]);
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
    return object;
}
exports.deserialize = deserialize;
