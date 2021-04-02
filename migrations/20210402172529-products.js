"use strict";

var dbm;
var type;
var seed;
var fs = require("fs");
var path = require("path");
var Promise;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function (db) {
  return db.createTable("products", {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      notNull: true,
    },
    name: "string",
    price: "decimal",
    categoryid: { 
      type: "int", 
      foreignKey: {
        name: 'categoryid',
        table: 'categories',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          categoryid: "id"
        }
      }
    },
  });
};

exports.down = function (db) {
  return db.dropTable("products");
};

exports._meta = {
  version: 1,
};
