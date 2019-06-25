"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_1 = require("./commands/query");
var logic_1 = require("./commands/logic");
var update_1 = require("./commands/update");
exports.OperatorMap = {};
for (var key in query_1.QUERY_COMMANDS_LITERAL) {
    exports.OperatorMap[key] = "$" + key.toLowerCase();
}
for (var key in logic_1.LOGIC_COMMANDS_LITERAL) {
    exports.OperatorMap[key] = "$" + key.toLowerCase();
}
for (var key in update_1.UPDATE_COMMANDS_LITERAL) {
    exports.OperatorMap[key] = "$" + key.toLowerCase();
}
exports.OperatorMap[query_1.QUERY_COMMANDS_LITERAL.NEQ] = '$ne';
exports.OperatorMap[update_1.UPDATE_COMMANDS_LITERAL.REMOVE] = '$unset';
exports.OperatorMap[update_1.UPDATE_COMMANDS_LITERAL.SHIFT] = '$pop';
exports.OperatorMap[update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT] = '$push';
function operatorToString(operator) {
    return exports.OperatorMap[operator] || "$" + operator.toLowerCase();
}
exports.operatorToString = operatorToString;
