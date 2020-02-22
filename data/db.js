const Database = require('better-sqlite3');
const db = new Database('ivona.db', {verbose: console.log});

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

db.exec("BEGIN TRANSACTION;\n" +
    "CREATE TABLE IF NOT EXISTS \"user_role\" (\n" +
    "\t\"user_id\"\tINTEGER NOT NULL,\n" +
    "\t\"role_id\"\tINTEGER NOT NULL,\n" +
    "\tFOREIGN KEY(\"role_id\") REFERENCES \"role\"(\"role_id\"),\n" +
    "\tPRIMARY KEY(\"user_id\",\"role_id\"),\n" +
    "\tFOREIGN KEY(\"user_id\") REFERENCES \"user\"(\"user_id\")\n" +
    ");\n" +
    "CREATE TABLE IF NOT EXISTS \"user\" (\n" +
    "\t\"user_id\"\tINTEGER NOT NULL UNIQUE,\n" +
    "\t\"user_name\"\tTEXT NOT NULL UNIQUE,\n" +
    "\t\"user_points\"\tINTEGER DEFAULT 0,\n" +
    "\t\"user_karma\"\tINTEGER DEFAULT 0,\n" +
    "\tPRIMARY KEY(\"user_id\")\n" +
    ");\n" +
    "CREATE TABLE IF NOT EXISTS \"award\" (\n" +
    "\t\"award_id\"\tINTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,\n" +
    "\t\"award_title\"\tTEXT NOT NULL,\n" +
    "\t\"award_description\"\tTEXT\n" +
    ");\n" +
    "CREATE TABLE IF NOT EXISTS \"role\" (\n" +
    "\t\"role_id\"\tINTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,\n" +
    "\t\"role_name\"\tTEXT\n" +
    ");\n" +
    "CREATE TABLE IF NOT EXISTS \"code\" (\n" +
    "\t\"code_id\"\tINTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,\n" +
    "\t\"code_code\"\tTEXT NOT NULL UNIQUE,\n" +
    "\t\"code_description\"\tTEXT NOT NULL,\n" +
    "\t\"code_creator\"\tINTEGER NOT NULL\n" +
    ");\n" +
    "CREATE TABLE IF NOT EXISTS \"user_award\" (\n" +
    "\t\"user_id\"\tINTEGER NOT NULL,\n" +
    "\t\"award_id\"\tINTEGER NOT NULL,\n" +
    "\tFOREIGN KEY(\"user_id\") REFERENCES \"user\"(\"user_id\"),\n" +
    "\tPRIMARY KEY(\"user_id\",\"award_id\"),\n" +
    "\tFOREIGN KEY(\"award_id\") REFERENCES \"award\"(\"award_id\")\n" +
    ");\n" +
    "CREATE TABLE IF NOT EXISTS \"group\" (\n" +
    "\t\"group_id\"\tINTEGER NOT NULL UNIQUE,\n" +
    "\tPRIMARY KEY(\"group_id\")\n" +
    ");\n" +"CREATE TABLE IF NOT EXISTS \"api_token\" (\n" +
    "\t\"token_id\"\tINTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,\n" +
    "\t\"user_id\"\tINTEGER NOT NULL,\n" +
    "\t\"token_text\"\tTEXT NOT NULL,\n" +
    "\tFOREIGN KEY(\"user_id\") REFERENCES \"user\"(\"user_id\")\n" +
    ");"+
    "COMMIT;\n");

module.exports = {
    getUser(id) {
        return getUserQuery.get(id);
    },
    insertUser(id, first_name, points, karma) {
        insertUserQuery.run(id, first_name, points, karma);
    },
    getTopPoints(count) {
        return getTopPointsQuery.all(count);
    },
    getTopKarma(count) {
        return getTopKarmaQuery.all(count);
    },
    addPoints(id, points) {
        addPointsQuery.run(points, id);
    },
    addKarma(id, points) {
        addKarmaQuery.run(points, id);
    },
    removePoints(id, points) {
        removePointsQuery.run(points, id);
    },
    removeKarma(id, points) {
        removeKarmaQuery.run(points, id);
    },
    setPoints(id, points) {
        setPointsQuery.run(points, id);
    },
    setKarma(id, points) {
        setKarmaQuery.run(points, id);
    },
    insertUserIfNotExists(user, points, karma) {
        let result = getUserQuery.get(user.id);
        if (result === undefined && !user.is_bot) {
            console.log("Nutzer erstellt");
            module.exports.insertUser(user.id, user.first_name, points, karma);
        }
    },
    insertUserRole(id, role_name) {
        insertUserRoleQuery.run(id, role_name);
    },
    hasUserRole(id, role) {
        console.log(id);
        console.log(role);
        return hasUserRoleQuery.get(id, role) !== undefined;
    },
    isRegisteredGroup(id) {
        return getGroupQuery.get(id) !== undefined;
    },
    insertGroup(id) {
        insertGroupQuery.run(id);
    },
    getUserFromToken(token){
        return getUserFromTokenQuery.get(token);
    }
};

const getUserFromTokenQuery = db.prepare("SELECT user_id FROM api_token WHERE token_text = ?")
const getUserQuery = db.prepare("SELECT * FROM user WHERE user_id = ?");
const insertUserQuery = db.prepare("INSERT INTO user (user_id,user_name,user_points,user_karma) VALUES (?,?,?,?)");
const insertGroupQuery = db.prepare("INSERT INTO \"group\" (group_id) VALUES (?)");
const insertUserRoleQuery = db.prepare("INSERT INTO user_role (user_id,role_id) VALUES (?,(SELECT role_id FROM role WHERE role_name = ?))");
const getUserRolesQuery = db.prepare("SELECT * FROM user_role WHERE user_id = ?");
const hasUserRoleQuery = db.prepare("SELECT * FROM user_role WHERE user_id = ? AND role_id = (SELECT role_id FROM role where role_name = ?)");
const getTopPointsQuery = db.prepare("SELECT * FROM user ORDER BY user_points DESC LIMIT ?");
const getTopKarmaQuery = db.prepare("SELECT * FROM user ORDER BY user_karma DESC LIMIT ?");
const getGroupQuery = db.prepare("SELECT * FROM \"group\" WHERE group_id = ?");
const addPointsQuery = db.prepare("UPDATE user SET user_points = user_points + ? WHERE user_id = ?");
const addKarmaQuery = db.prepare("UPDATE user SET user_karma = user_karma + ? WHERE user_id = ?");
const removePointsQuery = db.prepare("UPDATE user SET user_points = user_points - ? WHERE user_id = ?");
const removeKarmaQuery = db.prepare("UPDATE user SET user_karma = user_karma - ? WHERE user_id = ?");
const setPointsQuery = db.prepare("UPDATE user SET user_points = ? WHERE user_id = ?");
const setKarmaQuery = db.prepare("UPDATE user SET user_karma = ? WHERE user_id = ?");