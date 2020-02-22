var express = require('express');
var app = express();
db = require("../data/db.js");
ValidationMiddleware = require("./middlewares/ValidationMiddleware");
AuthenticationMiddleware = require("./middlewares/AuthenticationMiddleware");

app.get('/getTop',ValidationMiddleware.validTokenNeeded,AuthenticationMiddleware.roleRequired("user"), function (req, res) {
    res.json( db.getTopPoints(10));
})

app.get('/status', function (req, res) {
    res.json({status:"ok"});
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})