const express = require('express');
const app = express();
db = require("../data/db.js");
ValidationMiddleware = require("./middlewares/ValidationMiddleware");
AuthenticationMiddleware = require("./middlewares/AuthenticationMiddleware");

app.use(express.json());
const router = express.Router();
router.use('/top', ValidationMiddleware.validTokenNeeded, AuthenticationMiddleware.roleRequired("user"));
router.use('/users', ValidationMiddleware.validTokenNeeded, AuthenticationMiddleware.roleRequired("user"));
router.get('/top/points', function (req, res) {
    let result = [];
    db.getTopPoints(10).forEach((value, index) => {
        let obj = {};
        obj.user_id = value.user_id;
        obj.user_points = value.user_points;
        result[index] = obj;
    });
    res.json(result);
});
router.get('/top/karma', function (req, res) {
    let result = [];
    db.getTopKarma(10).forEach((value, index) => {
        let obj = {};
        obj.user_id = value.user_id;
        obj.user_karma = value.user_karma;
        result[index] = obj;
    });
    res.json(result);
});
router.get('/users/:id', ValidationMiddleware.validTokenNeeded, AuthenticationMiddleware.roleRequired("user"), function (req, res) {
    res.json(db.getUser(req.params.id));
});

router.get('/codes/:code', ValidationMiddleware.validTokenNeeded, AuthenticationMiddleware.roleRequired("user"), function (req, res) {
    res.json(db.getCodeByCode(req.params.code));
});

router.post('/codes', ValidationMiddleware.validTokenNeeded, AuthenticationMiddleware.roleRequired("coder"), function (req, res) {
    if (req.body.code === undefined) {
        res.status(400).json({code: 400, message: "'code' fehlt"});
    } else if (req.body.description === undefined) {
        res.status(400).json({code: 400, message: "'description' fehlt"});
    } else if (db.getCodeByCode(req.body.code) === undefined) {
        db.insertCode(req.body.code, req.body.description, req.user_id);
        res.end();
    } else {
        res.status(500).json({code: 500, message: "Code existiert schon"});
    }
});

router.get('/status', function (req, res) {
    res.json({status: "ok"});
});

app.use('/api', router);

app.use(function (req, res) {
    res.status(404).json({code: 404, message: "Ungültiger Pfad"})
});

app.use(function (err, req, res) {
    console.error(err.stack);
    //TODO stack trace entfernen
    res.status(500).json({code: 500, message: "Da ist wohl Etwas schiefgegangen. Stimmen alle deine Eingaben?"})
});

let running = false;

exports.isRunning = function() {return running};

const webserver = app.listen(6969, function () {
    running = true;
    const host = webserver.address().address;
    const port = webserver.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});

webserver.on('close', () => running = false);