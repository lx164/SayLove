"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = require("../helper/symbol");
exports.SET = 'set';
exports.REMOVE = 'remove';
exports.INC = 'inc';
exports.MUL = 'mul';
exports.PUSH = 'push';
exports.POP = 'pop';
exports.SHIFT = 'shift';
exports.UNSHIFT = 'unshift';
var UPDATE_COMMANDS_LITERAL;
(function (UPDATE_COMMANDS_LITERAL) {
    UPDATE_COMMANDS_LITERAL["SET"] = "set";
    UPDATE_COMMANDS_LITERAL["REMOVE"] = "remove";
    UPDATE_COMMANDS_LITERAL["INC"] = "inc";
    UPDATE_COMMANDS_LITERAL["MUL"] = "mul";
    UPDATE_COMMANDS_LITERAL["PUSH"] = "push";
    UPDATE_COMMANDS_LITERAL["POP"] = "pop";
    UPDATE_COMMANDS_LITERAL["SHIFT"] = "shift";
    UPDATE_COMMANDS_LITERAL["UNSHIFT"] = "unshift";
})(UPDATE_COMMANDS_LITERAL = exports.UPDATE_COMMANDS_LITERAL || (exports.UPDATE_COMMANDS_LITERAL = {}));
var UpdateCommand = (function () {
    function UpdateCommand(operator, operands, fieldName) {
        this._internalType = symbol_1.SYMBOL_UPDATE_COMMAND;
        Object.defineProperties(this, {
            _internalType: {
                enumerable: false,
                configurable: false,
            },
        });
        this.operator = operator;
        this.operands = operands;
        this.fieldName = fieldName || symbol_1.SYMBOL_UNSET_FIELD_NAME;
    }
    UpdateCommand.prototype._setFieldName = function (fieldName) {
        var command = new UpdateCommand(this.operator, this.operands, fieldName);
        return command;
    };
    return UpdateCommand;
}());
exports.UpdateCommand = UpdateCommand;
function isUpdateCommand(object) {
    return object && (object instanceof UpdateCommand) && (object._internalType === symbol_1.SYMBOL_UPDATE_COMMAND);
}
exports.isUpdateCommand = isUpdateCommand;
function isKnownUpdateCommand(object) {
    return isUpdateCommand(object) && (object.operator.toUpperCase() in UPDATE_COMMANDS_LITERAL);
}
exports.isKnownUpdateCommand = isKnownUpdateCommand;
exports.default = UpdateCommand;
