const Database = require('better-sqlite3');
const db = new Database('ivona.db', { verbose: console.log });

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

db.exec("BEGIN TRANSACTION;\n" +
    "CREATE TABLE IF NOT EXISTS \"code\" (\n" +
    "\t\"id\"\tINTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,\n" +
    "\t\"code\"\tTEXT NOT NULL UNIQUE,\n" +
    "\t\"description\"\tTEXT NOT NULL\n" +
    ");\n" +
    "CREATE TABLE IF NOT EXISTS \"user\" (\n" +
    "\t\"id\"\tINTEGER NOT NULL UNIQUE,\n" +
    "\t\"username\"\tINTEGER NOT NULL UNIQUE,\n" +
    "\t\"points\"\tINTEGER DEFAULT 0,\n" +
    "\t\"karma\"\tINTEGER DEFAULT 0,\n" +
    "\tPRIMARY KEY(\"id\")\n" +
    ");\n" +
    "CREATE TABLE IF NOT EXISTS \"award\" (\n" +
    "\t\"id\"\tINTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,\n" +
    "\t\"title\"\tTEXT NOT NULL,\n" +
    "\t\"description\"\tINTEGER NOT NULL\n" +
    ");\n" +
    "COMMIT;\n");

module.exports = {
    getUser(id)  {
        return getUserQuery.get(id);
    },
    insertUser(id, first_name, points, karma) {
        insertUserQuery.run(id, first_name, points, karma);
    },
    getTopPoints(count){
        return getTopPointsQuery.all(count);
    },
    getTopKarma(count){
        return getTopKarmaQuery.all(count);
    },
    addPoints(id,points){
        addPointsQuery.run(points,id);
    },
    addKarma(id,points){
        addKarmaQuery.run(points,id);
    },
    removePoints(id,points){
        removePointsQuery.run(points,id);
    },
    removeKarma(id,points){
        removeKarmaQuery.run(points,id);
    },
    setPoints(id,points){
        setPointsQuery.run(points,id);
    },
    setKarma(id,points){
        setKarmaQuery.run(points,id);
    },
    insertUserIfNotExists(user, points, karma) {
        let result = getUserQuery.get(user.id);
        if (result === undefined && !user.is_bot) {
            console.log("Nutzer erstellt");
            module.exports.insertUser(user.id, user.first_name, points, karma);
        }
    }
};


const getUserQuery = db.prepare("SELECT * FROM user WHERE id = ?");
const insertUserQuery = db.prepare("INSERT INTO user (id,username,points,karma) VALUES (?,?,?,?)");
const getTopPointsQuery = db.prepare("SELECT * FROM user ORDER BY points DESC LIMIT ?");
const getTopKarmaQuery = db.prepare("SELECT * FROM user ORDER BY karma DESC LIMIT ?");
const addPointsQuery = db.prepare("UPDATE user SET points = points + ? WHERE id = ?");
const addKarmaQuery = db.prepare("UPDATE user SET karma = karma + ? WHERE id = ?");
const removePointsQuery = db.prepare("UPDATE user SET points = points - ? WHERE id = ?");
const removeKarmaQuery = db.prepare("UPDATE user SET karma = karma - ? WHERE id = ?");
const setPointsQuery = db.prepare("UPDATE user SET points = ? WHERE id = ?");
const setKarmaQuery = db.prepare("UPDATE user SET karma = ? WHERE id = ?");