"use strict";

var r = require('rethinkdbdash')({
    pool: true,
    cursor: false,
    servers: [
        {host: 'phoenix-rethinkdb', port: 28015}
    ],
    db: 'test'
});
var bluebird = require('bluebird');

module.exports = RethinkDBProvider;

function RethinkDBProvider(options) {
    if (!(this instanceof RethinkDBProvider)) return new RethinkDBProvider(options);
    var self = this;
    self.options = options;
    // -- set stuff here. Maybe require in here for object ref to r
}

//RethinkDBProvider.prototype.stream = function(type, ent, callback) {
//    r.db('test').table('test').changes().run().then(function(feed) {
//        feed.each(function(err, change) {
//            if (err) {
//                assert(err instanceof Error);
//                console.log(err.toString());
//                console.log(err.stack);
//            }
//            else {
//                console.log(change);
//            }
//        });
//    }).error(function(err) {
//        console.log(err);
//    });
//}

RethinkDBProvider.prototype.save = function(app, type, ent, callback) {
    var self = this;
    bluebird.coroutine(function*() {
        try {
            var collectionName = self.getCollectionName(app, type);
            let hasCollection = yield r.tableList().contains(collectionName).run();
            console.log("hasCollection:", hasCollection);
            if(hasCollection) {
                // -do something
            }
            else {
                let ctResult = yield r.tableCreate(collectionName).run();
                console.log("create table result:", ctResult);
                // -- error handling
            }
            var insertResult = yield r.table(collectionName).insert(ent).run();
            console.log("insert result:", insertResult);
            if(callback) callback(null, insertResult);
            // -- error handling
        } catch(err) {
            console.log("error:", err);
            if(callback) callback(err, null);
        }
    })();

    //var iterator = _save(type, ent);
    //for (let n of iterator) {
    //    console.log(n);
    //    //if (n.done) {
    //    //    //callback(n.result);
    //    //    break;
    //    //}
    //}
}

RethinkDBProvider.prototype.getCollectionName = function(app, type) {
    var collectionName = app.replace(/[^a-z0-9+]+/gi, '_') + '__' + type;
    return collectionName;
}


//function* _save(type, ent) {
//    let tl = yield r.tableList().contains(type).run();
//    if(tl && tl.errors) {
//        // -do something
//    }
//    else if(!tl || !tl.result) {
//        let tc = yield r.tableCreate(type).run();
//        // -- error handling
//    }
//    var result = yield r.table(type).insert(ent).run();
//    // -- error handling
//}

