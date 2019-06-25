"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var document_1 = require("./document");
var query_1 = require("./query");
var CollectionReference = (function (_super) {
    __extends(CollectionReference, _super);
    function CollectionReference(db, coll) {
        return _super.call(this, db, coll) || this;
    }
    Object.defineProperty(CollectionReference.prototype, "name", {
        get: function () {
            return this._coll;
        },
        enumerable: true,
        configurable: true
    });
    CollectionReference.prototype.doc = function (docID) {
        return new document_1.DocumentReference(this._db, this._coll, docID);
    };
    CollectionReference.prototype.add = function (data, callback) {
        var docRef = this.doc();
        return docRef.create(data, callback);
    };
    return CollectionReference;
}(query_1.Query));
exports.CollectionReference = CollectionReference;
