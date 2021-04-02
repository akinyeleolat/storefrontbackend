'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var Promise;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  return db.createTable("orders", {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      notNull: true,
    },
    user_id: {
      type: "int", 
      foreignKey: {
        name: 'user_id',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          user_id: "id"
        }
      }
    },
    order_status: "int", // where 1 is active and 2 is complete
  });
};

exports.down = function(db) {
  return db.dropTable("orders");
};

exports._meta = {
  "version": 1
};
