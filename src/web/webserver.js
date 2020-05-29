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
const tg = require("../telegram/telegramBot");
const roles = require("../telegram/utils/roles");

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
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
app.use("/stylesheets", express.static('stylesheets'))
app.use(express.static('public'))
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/dashboard', function (req, res) {
    if (req.session.user === undefined) {
        res.redirect("/loginPrompt")
    } else {
        let userGroups = db.getUserGroups(req.session.user.id);

        userGroups.forEach(userGroup => {
            userGroup.group = db.getGroup(userGroup.groupId);
        });
        res.render('dashboard', {userGroups: userGroups});
    }
})
;
app.get("/gamble", function (req, res) {
    res.render('gamble');
});
app.get('/loginPrompt', function (req, res) {
    res.render('loginError', {message: "Bitte melde dich an"});
});
app.get('/loginUnknown', function (req, res) {
    res.render('loginError', {message: "Auf das Web Interface kann nur von Nutzern zugegriffen werden"});
});
app.get('/loginError', function (req, res) {
    res.render('loginError', {message: "Falsche Antwort von Telegram erhalten"});
});
app.get('/impressum', function (req, res) {
    res.render('impressum');
});
app.get('/features', function (req, res) {
    res.render('features');
});
app.get('/features', function (req, res) {
    res.render('features');
});
app.get('/profile', function (req, res) {
    res.render('profile');
});
app.get('/logout', function (req, res) {
    if (req.session.user !== undefined) {
        delete req.session.user
        res.render('index', {notification: "Du wurdest erfolgreich abgemeldet"});
    } else {
        res.redirect("/");
    }
});
app.get('/login', function (req, res) {
    let data;
    if (req.query.id !== undefined) {
        data = {id: req.query.id};
    } else {
        data = checkLogin(req.query, secret);
    }
    if (data !== false) {
        let user = db.getUserByTGID(data.id)
        if (user === undefined) {
            res.redirect("/loginUnknown")
        } else {
            req.session.user = user;
            req.session.user.isAdmin = false;
            db.getUserRoles(user.id).forEach(userRole => {
                if (userRole.roleId === roles.admin)
                    req.session.user.isAdmin = true;
            })
            res.redirect("/dashboard")
        }
    } else
        res.redirect("/loginError")
});
app.use(function (req, res) {
    res.status(404);
    res.render('error', {error: {status: 404}, message: "Seite konnte nicht gefunden werden"});
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