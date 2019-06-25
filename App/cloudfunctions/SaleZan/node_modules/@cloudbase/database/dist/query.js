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
var util_1 = require("./lib/util");
var db_1 = require("./db");
var validate_1 = require("./validate");
var util_2 = require("./util");
var query_1 = require("./serializer/query");
var update_1 = require("./serializer/update");
var Query = (function () {
    function Query(db, coll, fieldFilters, fieldOrders, queryOptions) {
        this._db = db;
        this._coll = coll;
        this._fieldFilters = fieldFilters;
        this._fieldOrders = fieldOrders || [];
        this._queryOptions = queryOptions || {};
        this._request = new db_1.Db.reqClass(this._db.config);
    }
    Query.prototype.get = function (callback) {
        callback = callback || util_1.createPromiseCallback();
        var newOder = [];
        if (this._fieldOrders) {
            this._fieldOrders.forEach(function (order) {
                newOder.push(order);
            });
        }
        var param = {
            collectionName: this._coll
        };
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        if (newOder.length > 0) {
            param.order = newOder;
        }
        if (this._queryOptions.offset) {
            param.offset = this._queryOptions.offset;
        }
        if (this._queryOptions.limit) {
            param.limit =
                this._queryOptions.limit < 100 ? this._queryOptions.limit : 100;
        }
        else {
            param.limit = 100;
        }
        if (this._queryOptions.projection) {
            param.projection = this._queryOptions.projection;
        }
        this._request.send('database.queryDocument', param).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                var documents = util_2.Util.formatResDocumentData(res.data.list);
                var result = {
                    data: documents,
                    requestId: res.requestId
                };
                if (res.TotalCount)
                    result.total = res.TotalCount;
                if (res.Limit)
                    result.limit = res.Limit;
                if (res.Offset)
                    result.offset = res.Offset;
                callback(0, result);
            }
        }).catch(function (err) {
            callback(err);
        });
        return callback.promise;
    };
    Query.prototype.count = function (callback) {
        callback = callback || util_1.createPromiseCallback();
        var param = {
            collectionName: this._coll
        };
        if (this._fieldFilters) {
            param.query = this._fieldFilters;
        }
        this._request.send('database.countDocument', param).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    requestId: res.requestId,
                    total: res.data.total
                });
            }
        });
        return callback.promise;
    };
    Query.prototype.where = function (query) {
        return new Query(this._db, this._coll, query_1.QuerySerializer.encode(query), this._fieldOrders, this._queryOptions);
    };
    Query.prototype.orderBy = function (fieldPath, directionStr) {
        validate_1.Validate.isFieldPath(fieldPath);
        validate_1.Validate.isFieldOrder(directionStr);
        var newOrder = {
            field: fieldPath,
            direction: directionStr
        };
        var combinedOrders = this._fieldOrders.concat(newOrder);
        return new Query(this._db, this._coll, this._fieldFilters, combinedOrders, this._queryOptions);
    };
    Query.prototype.limit = function (limit) {
        validate_1.Validate.isInteger('limit', limit);
        var option = __assign({}, this._queryOptions);
        option.limit = limit;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    };
    Query.prototype.skip = function (offset) {
        validate_1.Validate.isInteger('offset', offset);
        var option = __assign({}, this._queryOptions);
        option.offset = offset;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    };
    Query.prototype.update = function (data, callback) {
        callback = callback || util_1.createPromiseCallback();
        if (!data || typeof data !== 'object') {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '参数必需是非空对象'
            });
        }
        if (data.hasOwnProperty('_id')) {
            return Promise.resolve({
                code: 'INVALID_PARAM',
                message: '不能更新_id的值'
            });
        }
        var param = {
            collectionName: this._coll,
            query: this._fieldFilters,
            multi: true,
            merge: true,
            upsert: false,
            data: update_1.UpdateSerializer.encode(data)
        };
        this._request.send('database.updateDocument', param).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    requestId: res.requestId,
                    updated: res.data.updated,
                    upsertId: res.data.upsert_id
                });
            }
        });
        return callback.promise;
    };
    Query.prototype.field = function (projection) {
        for (var k in projection) {
            if (projection[k]) {
                projection[k] = 1;
            }
            else {
                projection[k] = 0;
            }
        }
        var option = __assign({}, this._queryOptions);
        option.projection = projection;
        return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option);
    };
    Query.prototype.remove = function (callback) {
        callback = callback || util_1.createPromiseCallback();
        if (Object.keys(this._queryOptions).length > 0) {
            console.warn('`offset`, `limit` and `projection` are not supported in remove() operation');
        }
        if (this._fieldOrders.length > 0) {
            console.warn('`orderBy` is not supported in remove() operation');
        }
        var param = {
            collectionName: this._coll,
            query: query_1.QuerySerializer.encode(this._fieldFilters),
            multi: true
        };
        this._request.send('database.deleteDocument', param).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    requestId: res.requestId,
                    deleted: res.data.deleted
                });
            }
        });
        return callback.promise;
    };
    return Query;
}());
exports.Query = Query;
