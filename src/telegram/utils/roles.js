const db = require("../../data/db");
module.exports = {
    moderator: db.getRoleByName("moderator").id,
    admin: db.getRoleByName("admin").id,
    coder: db.getRoleByName("coder").id,
};