const fs = require("fs");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const app = express();
const https = require("https");
const db = require("../data/db.js");

app.set('view engine', 'pug');
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'uTdryBACv8BGcBzBvBskRodL9fooyYmXyNnYDqkzcytMmHztHNv46TuAMgNiW3Y5jHJKCcjSQiNneNnkdXvidQHiQHZYY9C9RFFF9jN7kSeNnf7tYcYwLBh9pWWU2pip',
    resave: true,
    saveUninitialized: false
}));
app.get('/', function (req, res) {
    res.render('index');
});
app.use(function (req, res,err) {
    res.status(404);
    res.render('error',{error:err,message:"Unbekannte Seite"});
});

let running = false;

exports.isRunning = function() {return running};

const webserver = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
},app).listen(process.env.WEB_PORT, function () {
    running = true;
    let host = webserver.address().address;
    const port = webserver.address().port;
    if(host==="::")host = "localhost";
    console.log("Webserver listening at https://%s:%s", host, port)
});

webserver.on('close', () => running = false);