var provider = require('../../lib/rethinkdb-provider')({});

module.exports = function(app) {

    var restServer = app.rest;

    //restServer.get("/query", function (req, res) {
    //    res.send(req.routeVars);
    //});

    restServer.post("/save", function (req, res) {
        var self = this;
        provider.save(req.body.app, req.body.type, req.body.entity, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    });

}