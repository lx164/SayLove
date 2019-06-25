"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geo = require("./geo");
var collection_1 = require("./collection");
var command_1 = require("./command");
var serverDate_1 = require("./serverDate");
var regexp_1 = require("./regexp");
var Db = (function () {
    function Db(config) {
        this.config = config;
        this.Geo = Geo;
        this.serverDate = serverDate_1.ServerDateConstructor;
        this.command = command_1.Command;
        this.RegExp = regexp_1.RegExpConstructor;
    }
    Db.prototype.collection = function (collName) {
        if (!collName) {
            throw new Error('Collection name is required');
        }
        return new collection_1.CollectionReference(this, collName);
    };
    Db.prototype.createCollection = function (collName) {
        var request = new Db.reqClass(this.config);
        var params = {
            collectionName: collName
        };
        return request.send('database.addCollection', params);
    };
    return Db;
}());
exports.Db = Db;
