"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./lib/util");
var db_1 = require("./db");
var util_2 = require("./util");
var update_1 = require("./serializer/update");
var datatype_1 = require("./serializer/datatype");
var update_2 = require("./commands/update");
var DocumentReference = (function () {
    function DocumentReference(db, coll, docID, projection) {
        if (projection === void 0) { projection = {}; }
        this._db = db;
        this._coll = coll;
        this.id = docID;
        this.request = new db_1.Db.reqClass(this._db.config);
        this.projection = projection;
    }
    DocumentReference.prototype.create = function (data, callback) {
        callback = callback || util_1.createPromiseCallback();
        var params = {
            collectionName: this._coll,
            data: datatype_1.serialize(data)
        };
        if (this.id) {
            params['_id'] = this.id;
        }
        this.request.send('database.addDocument', params).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    id: res.data._id,
                    requestId: res.requestId
                });
            }
        }).catch(function (err) {
            callback(err);
        });
        return callback.promise;
    };
    DocumentReference.prototype.set = function (data, callback) {
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
        var hasOperator = false;
        var checkMixed = function (objs) {
            if (typeof objs === 'object') {
                for (var key in objs) {
                    if (objs[key] instanceof update_2.UpdateCommand) {
                        hasOperator = true;
                    }
                    else if (typeof objs[key] === 'object') {
                        checkMixed(objs[key]);
                    }
                }
            }
        };
        checkMixed(data);
        if (hasOperator) {
            return Promise.resolve({
                code: 'DATABASE_REQUEST_FAILED',
                message: 'update operator complicit'
            });
        }
        var merge = false;
        var param = {
            collectionName: this._coll,
            data: datatype_1.serialize(data),
            multi: false,
            merge: merge,
            upsert: true
        };
        if (this.id) {
            param['query'] = { _id: this.id };
        }
        this.request.send('database.updateDocument', param).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    updated: res.data.updated,
                    upsertedId: res.data.upserted_id,
                    requestId: res.requestId
                });
            }
        }).catch(function (err) {
            callback(err);
        });
        return callback.promise;
    };
    DocumentReference.prototype.update = function (data, callback) {
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
        var query = { _id: this.id };
        var merge = true;
        var param = {
            collectionName: this._coll,
            data: update_1.UpdateSerializer.encode(data),
            query: query,
            multi: false,
            merge: merge,
            upsert: false
        };
        this.request.send('database.updateDocument', param).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    updated: res.data.updated,
                    upsertedId: res.data.upserted_id,
                    requestId: res.requestId
                });
            }
        }).catch(function (err) {
            callback(err);
        });
        return callback.promise;
    };
    DocumentReference.prototype.remove = function (callback) {
        callback = callback || util_1.createPromiseCallback();
        var query = { _id: this.id };
        var param = {
            collectionName: this._coll,
            query: query,
            multi: false
        };
        this.request.send('database.deleteDocument', param).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                callback(0, {
                    deleted: res.data.deleted,
                    requestId: res.requestId
                });
            }
        }).catch(function (err) {
            callback(err);
        });
        return callback.promise;
    };
    DocumentReference.prototype.get = function (callback) {
        callback = callback || util_1.createPromiseCallback();
        var query = { _id: this.id };
        var param = {
            collectionName: this._coll,
            query: query,
            multi: false,
            projection: this.projection
        };
        this.request.send('database.queryDocument', param).then(function (res) {
            if (res.code) {
                callback(0, res);
            }
            else {
                var documents = util_2.Util.formatResDocumentData(res.data.list);
                callback(0, {
                    data: documents,
                    requestId: res.requestId,
                    total: res.TotalCount,
                    limit: res.Limit,
                    offset: res.Offset
                });
            }
        }).catch(function (err) {
            callback(err);
        });
        return callback.promise;
    };
    DocumentReference.prototype.field = function (projection) {
        for (var k in projection) {
            if (projection[k]) {
                projection[k] = 1;
            }
            else {
                projection[k] = 0;
            }
        }
        return new DocumentReference(this._db, this._coll, this.id, projection);
    };
    return DocumentReference;
}());
exports.DocumentReference = DocumentReference;
