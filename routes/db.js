var mongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/server';

var load_data = function(col, query, callback) {
    mongoClient.connect(DB_CONN_STR, function(err, db) {
        if (err) {
            console.log('err when connect:' + err);
            callback(null);
            return;
        }
        console.log('connect to mongodb ok');
        var collection = db.collection(col);
        console.dir(query);
        collection.find(query).toArray(function(err, result) {
            if (err) {
                console.log('err when find:' + err);
                callback(null);
                return;
            }
            console.dir(result);
            db.close();
            callback(result);
        });
    });
}

var save_data = function(col, query, data, callback) {
    mongoClient.connect(DB_CONN_STR, function(err, db) {
        if (err) {
            console.log('err when connect:' + err);
            callback(-1);
            return;
        }
        console.log('connect to mongodb ok');
        var collection = db.collection(col);
        collection.findOneAndUpdate(query, data, { 'upsert': true }, function(err, result) {
            if (err) {
                console.log('err when find and update:' + err);
                callback(-1);
                return;
            }
            console.log(result);
            db.close();
            callback(0);
        });
    });
}

var get_count = function(col, query, callback) {
    mongoClient.connect(DB_CONN_STR, function(err, db) {
        if (err) {
            console.log('err when connect:' + err);
            callback(-1);
            return;
        }
        console.log('connect to mongodb ok');
        var collection = db.collection(col);
        console.dir(query);
        collection.count(query, null, function(err, result) {
            if (err) {
                console.log('err when find:' + err);
                callback(-1);
                return;
            }
            console.log('col:' + col + ' query:' + query + ' count:' + result);
            db.close();
            callback(result);
        });
    });
}

module.exports.save_data = save_data;
module.exports.load_data = load_data;
module.exports.get_count = get_count;