"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupKarmaOrdered = exports.incKarma = exports.setEntehrenCooldown = exports.isOnEntehrenCooldown = exports.setEhrenCooldown = exports.isOnEhrenCooldown = exports.setSuperEhrenCooldown = exports.isOnSuperEhrenCooldown = exports.addUserToGroup = exports.groupExists = exports.getAlias = exports.createUser = void 0;
const redis_1 = require("redis");
let client;
(async () => {
    client = (0, redis_1.createClient)();
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('connect', () => console.log('Verbunden'));
    await client.connect();
})();
function createUser(id, first_name, last_name = "", username, alias) {
    return client.HSET("user:" + id + ":info", { "first_name": first_name, "last_name": last_name, "username": username, "alias": alias });
}
exports.createUser = createUser;
function getAlias(id) {
    return client.hGet("user:" + id + ":info", "alias");
}
exports.getAlias = getAlias;
function groupExists(id) {
    return client.EXISTS("group:" + id + ":info");
}
exports.groupExists = groupExists;
function addUserToGroup(user_id, group_id) {
    return client.multi().SADD("user:" + user_id + ":groups", group_id.toString()).SADD("group:" + group_id + ":users", user_id.toString()).exec();
}
exports.addUserToGroup = addUserToGroup;
/**
 *
 * @param user_id
 * @param group_id
 * @returns 0 Falls er ehren kann 1 Falls nicht
 */
function isOnSuperEhrenCooldown(user_id, group_id) {
    return client.EXISTS("group:" + group_id + ":user:" + user_id + ":cooldowns:super");
}
exports.isOnSuperEhrenCooldown = isOnSuperEhrenCooldown;
function setSuperEhrenCooldown(user_id, group_id, time) {
    return client.SET("group:" + group_id + ":user:" + user_id + ":cooldowns:super", "true").then(() => client.EXPIRE("group:" + group_id + ":user:" + user_id + ":cooldowns:super", time));
}
exports.setSuperEhrenCooldown = setSuperEhrenCooldown;
/**
 *
 * @param user_id
 * @param group_id
 * @returns 0 Falls er ehren kann 1 Falls nicht
 */
function isOnEhrenCooldown(user_id, group_id) {
    return client.EXISTS("group:" + group_id + ":user:" + user_id + ":cooldowns:up");
}
exports.isOnEhrenCooldown = isOnEhrenCooldown;
function setEhrenCooldown(user_id, group_id, time) {
    return client.SET("group:" + group_id + ":user:" + user_id + ":cooldowns:up", "true").then(() => client.EXPIRE("group:" + group_id + ":user:" + user_id + ":cooldowns:up", time));
}
exports.setEhrenCooldown = setEhrenCooldown;
/**
 *
 * @param user_id
 * @param group_id
 * @returns 0 Falls er ehren kann 1 Falls nicht
 */
function isOnEntehrenCooldown(user_id, group_id) {
    return client.EXISTS("group:" + group_id + ":user:" + user_id + ":cooldowns:down");
}
exports.isOnEntehrenCooldown = isOnEntehrenCooldown;
function setEntehrenCooldown(user_id, group_id, time) {
    return client.SET("group:" + group_id + ":user:" + user_id + ":cooldowns:down", "true").then(() => client.EXPIRE("group:" + group_id + ":user:" + user_id + ":cooldowns:down", time));
}
exports.setEntehrenCooldown = setEntehrenCooldown;
function incKarma(user_id, group_id, inc) {
    return client.multi().ZINCRBY("user:" + user_id + ":karma", inc, group_id.toString()).ZINCRBY("group:" + group_id + ":karma", inc, user_id.toString()).exec();
}
exports.incKarma = incKarma;
function getGroupKarmaOrdered(group_id) {
    return client.zRangeWithScores("group:" + group_id + ":karma", 0, 9);
}
exports.getGroupKarmaOrdered = getGroupKarmaOrdered;
//# sourceMappingURL=data.js.map