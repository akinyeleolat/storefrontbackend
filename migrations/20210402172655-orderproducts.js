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
  return db.createTable("orderproducts", {
    user_id: {
      type: "int", 
      notNull: true,
      foreignKey: {
        name: 'user_id',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: {
          user_id: "id"
        }
      }
    },
    orderid: {
      type: "int", 
      notNull: true,
      foreignKey: {
        name: 'orderid',
        table: 'orders',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: {
          orderid: "id"
        }
      }
    },
    productid: {
      type: "int", 
      notNull: true,
      foreignKey: {
        name: 'productid',
        table: 'products',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: {
          productid: "id"
        }
      }
    },
    productqty: "int"
  });
};

exports.down = function(db) {
  return db.dropTable("orderproducts");
};

exports._meta = {
  "version": 1
};
