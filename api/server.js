const express = require('express');
const app = express();
db = require("../data/db.js");
ValidationMiddleware = require("./middlewares/ValidationMiddleware");
AuthenticationMiddleware = require("./middlewares/AuthenticationMiddleware");
const router = express.Router();
router.use('/top',ValidationMiddleware.validTokenNeeded,AuthenticationMiddleware.roleRequired("user"));
router.use('/users',ValidationMiddleware.validTokenNeeded,AuthenticationMiddleware.roleRequired("user"));
router.get('/top/points', function (req, res) {
    res.json( db.getTopPoints(10));
});
router.get('/top/karma', function (req, res) {
    res.json( db.getTopKarma(10));
});
router.get('/users/:id',ValidationMiddleware.validTokenNeeded,AuthenticationMiddleware.roleRequired("user"), function (req, res) {
    res.json( db.getTopKarma(10));
});

router.get('/code/:id',ValidationMiddleware.validTokenNeeded,AuthenticationMiddleware.roleRequired("coder"), function (req, res) {
    res.json( db.getTopKarma(10));
});

router.get('/status', function (req, res) {
    res.json({status:"ok"});
});

app.use('/api',router);
app.use(function(req, res){
    res.status(404).json({code:404,message:"Ungültiger Pfad"})
});

const server = app.listen(6969, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});