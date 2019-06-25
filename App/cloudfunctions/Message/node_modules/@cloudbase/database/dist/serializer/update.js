"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var update_1 = require("../commands/update");
var symbol_1 = require("../helper/symbol");
var type_1 = require("../utils/type");
var operator_map_1 = require("../operator-map");
var common_1 = require("./common");
var UpdateSerializer = (function () {
    function UpdateSerializer() {
    }
    UpdateSerializer.encode = function (query) {
        var stringifier = new UpdateSerializer();
        return stringifier.encodeUpdate(query);
    };
    UpdateSerializer.prototype.encodeUpdate = function (query) {
        if (update_1.isUpdateCommand(query)) {
            return this.encodeUpdateCommand(query);
        }
        else if (type_1.getType(query) === 'object') {
            return this.encodeUpdateObject(query);
        }
        else {
            return query;
        }
    };
    UpdateSerializer.prototype.encodeUpdateCommand = function (query) {
        if (query.fieldName === symbol_1.SYMBOL_UNSET_FIELD_NAME) {
            throw new Error('Cannot encode a comparison command with unset field name');
        }
        switch (query.operator) {
            case update_1.UPDATE_COMMANDS_LITERAL.SET:
            case update_1.UPDATE_COMMANDS_LITERAL.REMOVE:
            case update_1.UPDATE_COMMANDS_LITERAL.INC:
            case update_1.UPDATE_COMMANDS_LITERAL.MUL: {
                return this.encodeFieldUpdateCommand(query);
            }
            case update_1.UPDATE_COMMANDS_LITERAL.PUSH:
            case update_1.UPDATE_COMMANDS_LITERAL.POP:
            case update_1.UPDATE_COMMANDS_LITERAL.SHIFT:
            case update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT: {
                return this.encodeArrayUpdateCommand(query);
            }
            default: {
                return this.encodeFieldUpdateCommand(query);
            }
        }
    };
    UpdateSerializer.prototype.encodeFieldUpdateCommand = function (query) {
        var _a, _b, _c, _d;
        var $op = operator_map_1.operatorToString(query.operator);
        switch (query.operator) {
            case update_1.UPDATE_COMMANDS_LITERAL.REMOVE: {
                return _a = {},
                    _a[$op] = (_b = {},
                        _b[query.fieldName] = '',
                        _b),
                    _a;
            }
            case update_1.UPDATE_COMMANDS_LITERAL.SET:
            case update_1.UPDATE_COMMANDS_LITERAL.INC:
            case update_1.UPDATE_COMMANDS_LITERAL.MUL:
            default: {
                return _c = {},
                    _c[$op] = (_d = {},
                        _d[query.fieldName] = query.operands[0],
                        _d),
                    _c;
            }
        }
    };
    UpdateSerializer.prototype.encodeArrayUpdateCommand = function (query) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var $op = operator_map_1.operatorToString(query.operator);
        switch (query.operator) {
            case update_1.UPDATE_COMMANDS_LITERAL.PUSH: {
                var modifiers = {
                    $each: query.operands.map(common_1.encodeInternalDataType),
                };
                return _a = {},
                    _a[$op] = (_b = {},
                        _b[query.fieldName] = modifiers,
                        _b),
                    _a;
            }
            case update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT: {
                var modifiers = {
                    $each: query.operands.map(common_1.encodeInternalDataType),
                    $position: 0,
                };
                return _c = {},
                    _c[$op] = (_d = {},
                        _d[query.fieldName] = modifiers,
                        _d),
                    _c;
            }
            case update_1.UPDATE_COMMANDS_LITERAL.POP: {
                return _e = {},
                    _e[$op] = (_f = {},
                        _f[query.fieldName] = 1,
                        _f),
                    _e;
            }
            case update_1.UPDATE_COMMANDS_LITERAL.SHIFT: {
                return _g = {},
                    _g[$op] = (_h = {},
                        _h[query.fieldName] = -1,
                        _h),
                    _g;
            }
            default: {
                return _j = {},
                    _j[$op] = (_k = {},
                        _k[query.fieldName] = common_1.encodeInternalDataType(query.operands),
                        _k),
                    _j;
            }
        }
    };
    UpdateSerializer.prototype.encodeUpdateObject = function (query) {
        var flattened = common_1.flattenQueryObject(query);
        for (var key in flattened) {
            if (/^\$/.test(key))
                continue;
            var val = flattened[key];
            if (update_1.isUpdateCommand(val)) {
                flattened[key] = val._setFieldName(key);
                var condition = this.encodeUpdateCommand(flattened[key]);
                common_1.mergeConditionAfterEncode(flattened, condition, key);
            }
            else {
                flattened[key] = val = common_1.encodeInternalDataType(val);
                var $setCommand = new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.SET, [val], key);
                var condition = this.encodeUpdateCommand($setCommand);
                common_1.mergeConditionAfterEncode(flattened, condition, key);
            }
        }
        return flattened;
    };
    return UpdateSerializer;
}());
exports.UpdateSerializer = UpdateSerializer;
