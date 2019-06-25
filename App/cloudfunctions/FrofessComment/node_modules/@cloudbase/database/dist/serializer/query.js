"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_1 = require("../commands/query");
var logic_1 = require("../commands/logic");
var symbol_1 = require("../helper/symbol");
var type_1 = require("../utils/type");
var operator_map_1 = require("../operator-map");
var common_1 = require("./common");
var QuerySerializer = (function () {
    function QuerySerializer() {
    }
    QuerySerializer.encode = function (query) {
        var encoder = new QueryEncoder();
        return encoder.encodeQuery(query);
    };
    return QuerySerializer;
}());
exports.QuerySerializer = QuerySerializer;
var QueryEncoder = (function () {
    function QueryEncoder() {
    }
    QueryEncoder.prototype.encodeQuery = function (query, key) {
        var _a;
        if (common_1.isConversionRequired(query)) {
            if (logic_1.isLogicCommand(query)) {
                return this.encodeLogicCommand(query);
            }
            else if (query_1.isQueryCommand(query)) {
                return this.encodeQueryCommand(query);
            }
            else {
                return _a = {}, _a[key] = this.encodeQueryObject(query), _a;
            }
        }
        else {
            if (type_1.isObject(query)) {
                return this.encodeQueryObject(query);
            }
            else {
                return query;
            }
        }
    };
    QueryEncoder.prototype.encodeLogicCommand = function (query) {
        var _this = this;
        var _a, _b, _c;
        switch (query.operator) {
            case logic_1.LOGIC_COMMANDS_LITERAL.AND:
            case logic_1.LOGIC_COMMANDS_LITERAL.OR: {
                var $op = operator_map_1.operatorToString(query.operator);
                var subqueries = query.operands.map(function (oprand) { return _this.encodeQuery(oprand, query.fieldName); });
                return _a = {},
                    _a[$op] = subqueries,
                    _a;
            }
            default: {
                var $op = operator_map_1.operatorToString(query.operator);
                if (query.operands.length === 1) {
                    var subquery = this.encodeQuery(query.operands[0]);
                    return _b = {},
                        _b[$op] = subquery,
                        _b;
                }
                else {
                    var subqueries = query.operands.map(this.encodeQuery.bind(this));
                    return _c = {},
                        _c[$op] = subqueries,
                        _c;
                }
            }
        }
    };
    QueryEncoder.prototype.encodeQueryCommand = function (query) {
        if (query_1.isComparisonCommand(query)) {
            return this.encodeComparisonCommand(query);
        }
        else {
            return this.encodeComparisonCommand(query);
        }
    };
    QueryEncoder.prototype.encodeComparisonCommand = function (query) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (query.fieldName === symbol_1.SYMBOL_UNSET_FIELD_NAME) {
            throw new Error('Cannot encode a comparison command with unset field name');
        }
        var $op = operator_map_1.operatorToString(query.operator);
        switch (query.operator) {
            case query_1.QUERY_COMMANDS_LITERAL.EQ:
            case query_1.QUERY_COMMANDS_LITERAL.NEQ:
            case query_1.QUERY_COMMANDS_LITERAL.LT:
            case query_1.QUERY_COMMANDS_LITERAL.LTE:
            case query_1.QUERY_COMMANDS_LITERAL.GT:
            case query_1.QUERY_COMMANDS_LITERAL.GTE: {
                return _a = {},
                    _a[query.fieldName] = (_b = {},
                        _b[$op] = common_1.encodeInternalDataType(query.operands[0]),
                        _b),
                    _a;
            }
            case query_1.QUERY_COMMANDS_LITERAL.IN:
            case query_1.QUERY_COMMANDS_LITERAL.NIN: {
                return _c = {},
                    _c[query.fieldName] = (_d = {},
                        _d[$op] = common_1.encodeInternalDataType(query.operands),
                        _d),
                    _c;
            }
            case query_1.QUERY_COMMANDS_LITERAL.GEO_NEAR: {
                var options = query.operands[0];
                return _e = {},
                    _e[query.fieldName] = {
                        $nearSphere: {
                            $geometry: options.geometry.toJSON(),
                            $maxDistance: options.maxDistance,
                            $minDistance: options.minDistance
                        }
                    },
                    _e;
            }
            case query_1.QUERY_COMMANDS_LITERAL.GEO_WITHIN: {
                var options = query.operands[0];
                return _f = {},
                    _f[query.fieldName] = {
                        $geoWithin: {
                            $geometry: options.geometry.toJSON()
                        }
                    },
                    _f;
            }
            case query_1.QUERY_COMMANDS_LITERAL.GEO_INTERSECTS: {
                var options = query.operands[0];
                return _g = {},
                    _g[query.fieldName] = {
                        $geoIntersects: {
                            $geometry: options.geometry.toJSON()
                        }
                    },
                    _g;
            }
            default: {
                return _h = {},
                    _h[query.fieldName] = (_j = {},
                        _j[$op] = common_1.encodeInternalDataType(query.operands[0]),
                        _j),
                    _h;
            }
        }
    };
    QueryEncoder.prototype.encodeQueryObject = function (query) {
        var flattened = common_1.flattenQueryObject(query);
        for (var key in flattened) {
            var val = flattened[key];
            if (logic_1.isLogicCommand(val)) {
                flattened[key] = val._setFieldName(key);
                var condition = this.encodeLogicCommand(flattened[key]);
                this.mergeConditionAfterEncode(flattened, condition, key);
            }
            else if (query_1.isComparisonCommand(val)) {
                flattened[key] = val._setFieldName(key);
                var condition = this.encodeComparisonCommand(flattened[key]);
                this.mergeConditionAfterEncode(flattened, condition, key);
            }
            else if (common_1.isConversionRequired(val)) {
                flattened[key] = common_1.encodeInternalDataType(val);
            }
        }
        return flattened;
    };
    QueryEncoder.prototype.mergeConditionAfterEncode = function (query, condition, key) {
        if (!condition[key]) {
            delete query[key];
        }
        for (var conditionKey in condition) {
            if (query[conditionKey]) {
                if (type_1.isArray(query[conditionKey])) {
                    query[conditionKey].push(condition[conditionKey]);
                }
                else if (type_1.isObject(query[conditionKey])) {
                    if (type_1.isObject(condition[conditionKey])) {
                        Object.assign(query, condition);
                    }
                    else {
                        console.warn("unmergable condition, query is object but condition is " + type_1.getType(condition) + ", can only overwrite", condition, key);
                        query[conditionKey] = condition[conditionKey];
                    }
                }
                else {
                    console.warn("to-merge query is of type " + type_1.getType(query) + ", can only overwrite", query, condition, key);
                    query[conditionKey] = condition[conditionKey];
                }
            }
            else {
                query[conditionKey] = condition[conditionKey];
            }
        }
    };
    return QueryEncoder;
}());
