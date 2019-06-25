"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
var query_1 = require("./query");
exports.AND = 'and';
exports.OR = 'or';
exports.NOT = 'not';
exports.NOR = 'nor';
var LOGIC_COMMANDS_LITERAL;
(function (LOGIC_COMMANDS_LITERAL) {
    LOGIC_COMMANDS_LITERAL["AND"] = "and";
    LOGIC_COMMANDS_LITERAL["OR"] = "or";
    LOGIC_COMMANDS_LITERAL["NOT"] = "not";
    LOGIC_COMMANDS_LITERAL["NOR"] = "nor";
})(LOGIC_COMMANDS_LITERAL = exports.LOGIC_COMMANDS_LITERAL || (exports.LOGIC_COMMANDS_LITERAL = {}));
var LogicCommand = (function () {
    function LogicCommand(operator, operands, fieldName) {
        this._internalType = symbol_1.SYMBOL_LOGIC_COMMAND;
        Object.defineProperties(this, {
            _internalType: {
                enumerable: false,
                configurable: false,
            },
        });
        this.operator = operator;
        this.operands = operands;
        this.fieldName = fieldName || symbol_1.SYMBOL_UNSET_FIELD_NAME;
        if (this.fieldName !== symbol_1.SYMBOL_UNSET_FIELD_NAME) {
            operands = operands.slice();
            this.operands = operands;
            for (var i = 0, len = operands.length; i < len; i++) {
                var query = operands[i];
                if (isLogicCommand(query) || query_1.isQueryCommand(query)) {
                    operands[i] = query._setFieldName(this.fieldName);
                }
            }
        }
    }
    LogicCommand.prototype._setFieldName = function (fieldName) {
        var operands = this.operands.map(function (operand) {
            if (operand instanceof LogicCommand) {
                return operand._setFieldName(fieldName);
            }
            else {
                return operand;
            }
        });
        var command = new LogicCommand(this.operator, operands, fieldName);
        return command;
    };
    LogicCommand.prototype.and = function () {
        var __expressions__ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            __expressions__[_i] = arguments[_i];
        }
        var expressions = Array.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        expressions.unshift(this);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.AND, expressions, this.fieldName);
    };
    LogicCommand.prototype.or = function () {
        var __expressions__ = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            __expressions__[_i] = arguments[_i];
        }
        var expressions = Array.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        expressions.unshift(this);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.OR, expressions, this.fieldName);
    };
    return LogicCommand;
}());
exports.LogicCommand = LogicCommand;
function isLogicCommand(object) {
    return object && (object instanceof LogicCommand) && (object._internalType === symbol_1.SYMBOL_LOGIC_COMMAND);
}
exports.isLogicCommand = isLogicCommand;
function isKnownLogicCommand(object) {
    return isLogicCommand && (object.operator.toUpperCase() in LOGIC_COMMANDS_LITERAL);
}
exports.isKnownLogicCommand = isKnownLogicCommand;
exports.default = LogicCommand;
