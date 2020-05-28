const fs = require("fs");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const app = express();
const https = require("https");
const db = require("../data/db.js");
const crypto = require('crypto');

let secret = crypto.createHash('sha256').update(process.env.BOT_TOKEN).digest();

function checkLogin(data, secret) {
    data = JSON.parse(JSON.stringify(data));
    let input_hash = data.hash;
    delete data.hash;
    let array = [];
    for (let key in data) {
        if (data.hasOwnProperty(key))
            array.push(key + '=' + data[key]);
    }
    array = array.sort();
    let check_string = array.join('\n');
    let check_hash = crypto.createHmac('sha256', secret).update(check_string).digest('hex');
    if (check_hash === input_hash) {
        return data;
    } else {
        return false;
    }
}

app.set('view engine', 'pug');
app.use(express.json());
app.use(cookieParser());
if (process.env.SESSION_SECRET === undefined) {
    console.warn("SESSION_SECRET NICHT GESETZT!");
}
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/login', function (req, res) {
    let data = checkLogin(req.query, secret);
    if (data !== null) {
        console.log(data)

        res.redirect("/dashboard")
    } else
        res.redirect("/")
});
app.use(function (req, res, err) {
    res.status(404);
    res.render('error', {error: err, message: "Unbekannte Seite"});
});

let running = false;

exports.isRunning = function () {
    return running
};

const webserver = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}, app).listen(process.env.WEB_PORT, function () {
    running = true;
    let host = webserver.address().address;
    const port = webserver.address().port;
    if (host === "::") host = "localhost";
    console.log("Webserver listening at https://%s:%s", host, port)
});

webserver.on('close', () => running = false);