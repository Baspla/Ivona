const Database = require('better-sqlite3');
const db = new Database('ivona.db', /*{verbose: console.log}*/);
const crypto = require("crypto");
const fs = require("fs");

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

const setupFile = fs.readFileSync('setup.sql', 'utf8');
const roleFile = fs.readFileSync('role.sql', 'utf8');
const featureFile = fs.readFileSync('feature.sql', 'utf8');
db.exec(setupFile);
if (0 === db.prepare("SELECT Count(*) AS \"i\" FROM role").get().i) {
    db.exec(roleFile);
}
if (0 === db.prepare("SELECT Count(*) AS \"i\" FROM feature").get().i) {
    db.exec(featureFile);
}

function Award(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
}

function parseAward(dbAward) {
    if (dbAward === undefined) return undefined;
    return new Award(dbAward.award_id, dbAward.award_title, dbAward.award_description);
}

function Code(rowid, name, description, userId) {
    this.rowid = rowid;
    this.name = name;
    this.description = description;
    this.userId = userId;
}

function parseCode(dbCode) {
    if (dbCode === undefined) return undefined;
    return new Code(dbCode.rowid, dbCode.code_name, dbCode.code_description, dbCode.code_creator);
}

function Group(id, tgid, name) {
    this.id = id;
    this.tgid = tgid;
    this.name = name;
}

function parseGroup(dbGroup) {
    if (dbGroup === undefined) return undefined;
    return new Group(dbGroup.group_id, dbGroup.group_tgid, dbGroup.group_name);
}

function Role(id, name) {
    this.id = id;
    this.name = name;
}

function parseRole(dbRole) {
    if (dbRole === undefined) return undefined;
    return new Role(dbRole.role_id, dbRole.role_name);
}

function Token(id, user, text) {
    this.id = id;
    this.user = user;
    this.text = text;
}

function parseToken(dbToken) {
    if (dbToken === undefined) return undefined;
    return new Token(dbToken.token_id, dbToken.user_id, dbToken.token_text);
}

function User(id, name, tgid) {
    this.id = id;
    this.name = name;
    this.tgid = tgid;
}

function parseUser(dbUser) {
    if (dbUser === undefined) return undefined;
    return new User(dbUser.user_id, dbUser.user_name, dbUser.user_tgid);
}

function UserAward(userId, awardId, date) {
    this.userId = userId;
    this.awardId = awardId;
    this.date = date;
}

function parseUserAward(dbUserAward) {
    if (dbUserAward === undefined) return undefined;
    return new UserAward(dbUserAward.user_id, dbUserAward.award_id, dbUserAward.award_date);
}

function UserGroup(userId, groupId, karma, points, lastUp, lastDown, lastSuper, lastReward) {
    this.userId = userId;
    this.groupId = groupId;
    this.karma = karma;
    this.points = points;
    this.lastUp = lastUp;
    this.lastUp = lastUp;
    this.lastDown = lastDown;
    this.lastSuper = lastSuper;
    this.lastReward = lastReward;
}

function parseUserGroup(dbUserGroup) {
    if (dbUserGroup === undefined) return undefined;
    return new UserGroup(dbUserGroup.user_id, dbUserGroup.group_id, dbUserGroup.user_group_karma,
        dbUserGroup.user_group_points, dbUserGroup.user_group_last_up, dbUserGroup.user_group_last_down,
        dbUserGroup.user_group_last_super, dbUserGroup.user_group_last_reward);
}

function UserRole(userId, roleId) {
    this.userId = userId;
    this.roleId = roleId;
}

function parseUserRole(dbUserRole) {
    if (dbUserRole === undefined) return undefined;
    return new UserRole(dbUserRole.user_id, dbUserRole.role_id);
}

function Feature(id, name) {
    this.id = id;
    this.name = name;
}

function parseFeature(dbFeature) {
    if (dbFeature === undefined) return undefined;
    return new Feature(dbFeature.feature_id, dbFeature.feature_name);
}

function GroupFeature(groupId, featureId) {
    this.featureId = featureId;
    this.groupId = groupId;
}

function parseGroupFeature(dbGroupFeature) {
    if (dbGroupFeature === undefined) return undefined;
    return new GroupFeature(dbGroupFeature.group_id, dbGroupFeature.feature_id);
}

//add & remove für relations
//create & delete für base-objects
module.exports = {
    backup(filename) {
        return db.backup(filename);
    },
    createUser(tgid, name) {
        if (module.exports.getUserByTGID(tgid) === undefined) {
            let fname = name;
            let i = 0;
            while (module.exports.getUserByName(fname) !== undefined) {
                i++;
                fname = name + i;
                if (i > 1000) {
                    throw "Keine Nutzernamen frei";
                }
            }
            insertUserQuery.run(tgid, fname);
            console.log("Nutzer \"" + fname + "\" erstellt");
        } else throw "TGID schon benutzt";
    }, createGroup(tgid, name) {
        if (module.exports.getGroupByTGID(tgid) === undefined) {
            let title = name;
            if (title === undefined) title = "Gruppe";
            let fname = title;
            let i = 0;
            while (module.exports.getGroupByName(name) !== undefined) {
                i++;
                fname = title + i;
                if (i > 1000) {
                    throw "Keine Gruppennamen frei";
                }
            }
            insertGroupQuery.run(tgid, fname);
            console.log("Gruppe \"" + fname + "\" erstellt");
        } else throw "TGID schon benutzt";
    }, createRole(name) {
        if (module.exports.getRoleByName(name) === undefined) {
            insertRoleQuery.run(name);
            console.log("Rolle \"" + name + "\" erstellt");
        } else throw "Rollenname schon benutzt"
    }, createCode(name, description, userId) {
        if (module.exports.getCodeByName(name) === undefined) {
            insertCodeQuery.run(name, description, userId);
            console.log("Code \"" + name + "\" erstellt");
        } else throw "Code schon benutzt"
    }, createAward(title, description) {
        if (module.exports.getAwardByTitle(title) === undefined) {
            insertAwardQuery.run(title, description);
            console.log("Award \"" + title + "\" erstellt");
        } else throw "Titel schon benutzt"
    }, createToken(userId) {
        const salt = crypto.randomBytes(128).toString('base64');
        const token = require('crypto').createHash('md5').update(id + salt).digest("hex");
        insertTokenQuery.run(userId, token);
    }, deleteUser(userId) {
        if (module.exports.getUser(userId) !== undefined) {
            deleteUserTransaction({userId: userId});
        } else throw "Unbekannter Nutzer";
    }, deleteGroup(groupId) {
        if (module.exports.getGroup(groupId) !== undefined) {
            deleteGroupTransaction({groupId: groupId});
        } else throw "Unbekannte Gruppe";
    }, deleteRole(roleId) {
        if (module.exports.getRole(roleId) !== undefined) {
            deleteRoleTransaction({roleId: roleId});
        } else throw "Unbekannte Rolle";
    }, deleteCode(rowid) {
        if (module.exports.getCode(rowid) !== undefined) {
            deleteCodeQuery.run(rowid);
        } else throw "Unbekannter Nutzer";
    }, deleteAward(awardId) {
        if (module.exports.getAward(awardId) !== undefined) {
            deleteAwardQuery.run({awardId: awardId});
        } else throw "Unbekannter Award";
    }, deleteToken(tokenId) {
        if (module.exports.getToken(tokenId) !== undefined) {
            deleteTokenQuery.run(tokenId);
        } else throw "Unbekannter Token";
    }, addUserAward(userId, awardId, date) {
        if (module.exports.getUserAward(userId, awardId) === undefined) {
            insertUserAwardQuery.run(userId, awardId, date);
            console.log("Award " + awardId + " an " + userId + " gegeben");
        } else throw "Nutzer hat Award schon";
    }, addUserGroup(userId, groupId) {
        if (module.exports.getUserGroup(userId, groupId) === undefined) {
            insertUserGroupQuery.run(userId, groupId);
            console.log("Nutzer " + userId + " zu Gruppe " + groupId + " hinzugefügt");
        } else throw "Nutzer ist schon in Gruppe";
    }, addUserRole(userId, roleId) {
        if (module.exports.getUserRole(userId, roleId) === undefined) {
            insertUserRoleQuery.run(userId, roleId);
            console.log("Role " + roleId + " an " + userId + " gegeben");
        } else throw "Nutzer hat Rolle schon";
    }, removeUserAward(userId, awardId) {
        //TODO
    }, removeUserGroup(userId, groupId) {
        //TODO
    }, removeUserRole(userId, roleId) {
        //TODO
    }, getUser(userId) {
        return parseUser(getUserQuery.get(userId));
    }, getGroup(groupId) {
        return parseGroup(getGroupQuery.get(groupId));
    }, getCode(rowid) {
        return parseCode(getCodeQuery.get(rowid));
    }, getAward(awardId) {
        return parseAward(getAwardQuery.get(awardId));
    }, getToken(tokenId) {
        return parseToken(getTokenQuery.get(tokenId));
    }, getRole(roleId) {
        return parseRole(getRoleQuery.get(roleId));
    }, getRoleByName(name) {
        return parseRole(getRoleByNameQuery.get(name));
    }, getUserByName(name) {
        return parseUser(getUserByNameQuery.get(name));
    }, getUserByTGID(tgid) {
        return parseUser(getUserByTGIDQuery.get(tgid));
    }, getGroupByName(name) {
        return parseGroup(getGroupByNameQuery.get(name));
    }, getGroupByTGID(tgid) {
        return parseGroup(getGroupByTGIDQuery.get(tgid));
    }, getCodeByName(name) {
        return parseCode(getCodeByNameQuery.get(name));
    }, getCodesMatchingNameOrDescription(text, limit, offset) {
        return getCodesMatchingNameOrDescriptionQuery.all(limit, offset, {text: "\"\"\"" + text + "\"\"\""}).map(db => parseCode(db));
    }, getCodesByUser(userId) {
        //TODO
    }, getAwardByTitle(title) {
        return parseAward(getAwardByTitleQuery.get(title));
    }, getAwardsByDescription(description) {
        //TODO
    }, getTokensByUser(userId) {
        //TODO
    }, getTokensByText(text) {
        //TODO
    }, getUserAward(userId, awardId) {
        return parseUserAward(getUserAwardQuery.get(userId, awardId));
    }, getUserGroup(userId, groupId) {
        return parseUserGroup(getUserGroupQuery.get(userId, groupId));
    }, getUserRole(userId, roleId) {
        return parseUserRole(getUserRoleQuery.get(userId, roleId));
    }, getUserAwards(userId) {
        return getUserAwardsQuery.all(userId).map(db => parseUserAward(db));
    }, getUserGroups(userId) {
        return getUserGroupsQuery.all(userId).map(db => parseUserGroup(db));
    }, getUserRoles(userId) {
        return getUserRolesQuery.all(userId).map(db => parseUserRole(db));
    }, getAwardUsers(awardId) {
        return getAwardUsersQuery.all(awardId).map(db => parseUser(db));
    }, getGroupUsers(groupId) {
        return getGroupUsersQuery.all(groupId).map(db => parseUser(db));
    }, getRoleUsers(roleId) {
        return getRoleUsersQuery.all(roleId).map(db => parseUser(db));
    }, getUserAwardsByDate(date) {
        return getUserAwardsByDateQuery.all(date).map(db => parseUserAward(db));
    }, setUserName(userId, name) {
        setUserNameQuery.run(name, userId);
    }, setGroupName(groupId, name) {
        setGroupNameQuery.run(name, groupId);
    }, setCodeName(rowid, name) {
        setCodeNameQuery.run(name, rowid);
    }, setCodeDescription(rowid, description) {
        setCodeDescriptionQuery.run(description, rowid);
    }, setCodeCreator(rowid, creator) {
        setCodeCreatorQuery.run(creator, rowid);
    }, setAwardTitle(awardId, title) {
        setAwardTitleQuery.run(title, awardId);
    }, setAwardDescription(awardId, description) {
        setAwardDescriptionQuery.run(description, awardId);
    }, setUserAwardDate(userId, awardId, date) {
        setUserAwardDateQuery.run(date, userId, awardId);
    }, setUserGroupKarma(userId, groupId, karma) {
        setUserGroupKarmaQuery.run(karma, userId, groupId);
    }, setUserGroupPoints(userId, groupId, points) {
        setUserGroupPointsQuery.run(points, userId, groupId);
    }, setUserGroupLastUp(userId, groupId, lastUp) {
        setUserGroupLastUpQuery.run(lastUp, userId, groupId);
    }, setUserGroupLastDown(userId, groupId, lastDown) {
        setUserGroupLastDownQuery.run(lastDown, userId, groupId);
    }, setUserGroupLastSuper(userId, groupId, lastSuper) {
        setUserGroupLastSuperQuery.run(lastSuper, userId, groupId);
    }, setUserGroupLastReward(userId, groupId, lastReward) {
        setUserGroupLastRewardQuery.run(lastReward, userId, groupId);
    }, hasUserRole(userId, roleId) {
        return module.exports.getUserRole(userId, roleId) !== undefined;
    }, hasUserGroup(userId, groupId) {
        return module.exports.getUserGroup(userId, groupId) !== undefined;
    }, hasUserAward(userId, awardId) {
        return module.exports.getUserAward(userId, awardId) !== undefined;
    }, getAwards(limit, offset) {
        if (limit === undefined || offset === undefined)
            return getAwardsQuery.all().map(db => parseAward(db));
        return getAwardsLimitedQuery.all(limit, offset).map(db => parseAward(db));
    }, getCodes(limit, offset) {
        if (limit === undefined || offset === undefined)
            return getCodesQuery.all().map(db => parseCode(db));
        return getCodesLimitedQuery.all(limit, offset).map(db => parseCode(db));
    }, getGroups(limit, offset) {
        if (limit === undefined || offset === undefined)
            return getGroupsQuery.all().map(db => parseGroup(db));
        return getGroupsLimitedQuery.all(limit, offset).map(db => parseGroup(db));
    }, getRoles(limit, offset) {
        if (limit === undefined || offset === undefined)
            return getRolesQuery.all().map(db => parseRole(db));
        return getRolesLimitedQuery.all(limit, offset).map(db => parseRole(db));
    }, getTokens(limit, offset) {
        if (limit === undefined || offset === undefined)
            return getTokensQuery.all().map(db => parseToken(db));
        return getTokensQuery.all(limit, offset).map(db => parseToken(db));
    }, getUsers(limit, offset) {
        if (limit === undefined || offset === undefined)
            return getUsersQuery.all().map(db => parseUser(db));
        return getUsersLimitedQuery.all(limit, offset).map(db => parseUser(db));
    }, getUsersOrderedByPoints(groupId, limit, offset) {
        return getUsersOrderedByPointsQuery.all(groupId, limit, offset).map(db => {
            let ug = parseUserGroup(db);
            Object.assign(ug, parseUser(db));
            return ug;
        });
    }, getUsersOrderedByKarma(groupId, limit, offset) {
        return getUsersOrderedByKarmaQuery.all(groupId, limit, offset).map(db => {
            let ug = parseUserGroup(db);
            Object.assign(ug, parseUser(db));
            return ug;
        });
    }, getFeature(featureId) {
        return parseFeature(getFeatureQuery.get(featureId));
    }, getFeatureByName(name) {
        return parseFeature(getFeatureByNameQuery.get(name));
    }, getGroupFeature(groupId, featureId) {
        return parseGroupFeature(getGroupFeatureQuery.get(groupId, featureId));
    }, hasGroupFeature(groupId, featureId) {
        return module.exports.getGroupFeature(groupId, featureId) !== undefined;
    }, createFeature(name) {
        if (module.exports.getFeatureByName(name) === undefined) {
            insertFeatureQuery.run(name);
            console.log("feature \"" + name + "\" erstellt");
        } else throw "Name schon benutzt"
    }, deleteFeature(featureId) {
        if (module.exports.getFeature(featureId) !== undefined) {
            deleteFeatureTransaction({featureId: featureId});
        } else throw "Unbekanntes Feature";
    }, addGroupFeature(groupId, featureId) {
        console.log(groupId,featureId);
        if (module.exports.getGroupFeature(groupId, featureId) === undefined) {
            insertGroupFeatureQuery.run(groupId, featureId);
            console.log("Feature " + featureId + " an " + groupId + " gegeben");
        } else throw "Gruppe hat Feature schon";
    }, removeGroupFeature(groupId, featureId) {
        if (module.exports.getGroupFeature(groupId, featureId) !== undefined) {
            deleteGroupFeatureQuery.run(groupId, featureId);
        } else throw "Unbekanntes Feature";
    }, getFeatures(limit, offset) {
        if (limit === undefined || offset === undefined)
            return getFeaturesQuery.all().map(db => parseFeature(db));
        return getFeaturesLimitedQuery.all(limit, offset).map(db => parseFeature(db));
    },
};

const getFeaturesQuery = db.prepare("SELECT * FROM feature");
const getFeaturesLimitedQuery = db.prepare("SELECT * FROM feature ORDER BY feature_id LIMIT ? OFFSET ?");
const getFeatureQuery = db.prepare("SELECT * FROM feature WHERE feature_id = ?");
const getFeatureByNameQuery = db.prepare("SELECT * FROM feature WHERE feature_name = ?");
const getGroupFeatureQuery = db.prepare("SELECT * FROM group_feature WHERE group_id = ? AND feature_id = ?");
const insertFeatureQuery = db.prepare("INSERT INTO \"feature\" (feature_name) VALUES (?)");
const deleteFeatureTransaction = db.transaction((params) => {
    db.prepare("DELETE FROM group_feature WHERE feature_id = $featureId;").run(params);
    db.prepare("DELETE FROM feature WHERE feature_id = $featureId;").run(params);
});
const insertGroupFeatureQuery = db.prepare("INSERT INTO \"group_feature\" (group_id,feature_id) VALUES (?,?)");
const deleteGroupFeatureQuery = db.prepare("DELETE FROM group_feature WHERE group_id = ? AND feature_id = ?");

const getUserQuery = db.prepare("SELECT * FROM \"user\" WHERE user_id = ?");
const getGroupQuery = db.prepare("SELECT * FROM \"group\" WHERE group_id = ?");
const getCodeQuery = db.prepare("SELECT rowid,* FROM code WHERE rowid = ?");
const getAwardQuery = db.prepare("SELECT * FROM award WHERE award_id = ?");
const getTokenQuery = db.prepare("SELECT * FROM token WHERE token_id = ?");
const getRoleQuery = db.prepare("SELECT * FROM role WHERE role_id = ?");
const getRoleByNameQuery = db.prepare("SELECT * FROM role WHERE role_name = ?");
const getUserByNameQuery = db.prepare("SELECT * FROM \"user\" WHERE user_name = ?");
const getUserByTGIDQuery = db.prepare("SELECT * FROM \"user\" WHERE user_tgid = ?");
const getGroupByNameQuery = db.prepare("SELECT * FROM \"group\" WHERE group_name = ?");
const getGroupByTGIDQuery = db.prepare("SELECT * FROM \"group\" WHERE group_tgid = ?");
const getAwardByTitleQuery = db.prepare("SELECT * FROM award WHERE award_title = ?");
const getUserAwardQuery = db.prepare("SELECT * FROM user_award WHERE user_id = ? AND award_id = ?");
const getUserGroupQuery = db.prepare("SELECT * FROM user_group WHERE user_id = ? AND group_id = ?");
const getUserRoleQuery = db.prepare("SELECT * FROM user_role WHERE user_id = ? AND role_id = ?");
const getCodeByNameQuery = db.prepare("SELECT rowid,* FROM code WHERE code_name = ?");

const getUserAwardsQuery = db.prepare("SELECT * FROM \"user_award\" WHERE user_id = ?");
const getUserGroupsQuery = db.prepare("SELECT * FROM \"user_group\" WHERE user_id = ?");
const getUserRolesQuery = db.prepare("SELECT * FROM \"user_role\" WHERE user_id = ?");
const getAwardUsersQuery = db.prepare("SELECT * FROM \"user_award\" WHERE award_id = ?");
const getGroupUsersQuery = db.prepare("SELECT * FROM \"user_group\" WHERE group_id = ?");
const getRoleUsersQuery = db.prepare("SELECT * FROM \"user_role\" WHERE role_id = ?");
const getUserAwardsByDateQuery = db.prepare("SELECT * FROM \"user_award\" WHERE user_award_date = ?");

const getCodesMatchingNameOrDescriptionQuery = db.prepare("SELECT rowid,* FROM code WHERE code_name MATCH @text OR code_description MATCH @text ORDER BY rowid LIMIT ? OFFSET ?");

const getAwardsLimitedQuery = db.prepare("SELECT * FROM award ORDER BY award_id LIMIT ? OFFSET ?");
const getCodesLimitedQuery = db.prepare("SELECT rowid,* FROM code ORDER BY rowid LIMIT ? OFFSET ?");
const getGroupsLimitedQuery = db.prepare("SELECT * FROM \"group\" ORDER BY group_id LIMIT ? OFFSET ?");
const getRolesLimitedQuery = db.prepare("SELECT * FROM role ORDER BY role_id LIMIT ? OFFSET ?");
const getTokensLimitedQuery = db.prepare("SELECT * FROM token ORDER BY token_id LIMIT ? OFFSET ?");
const getUsersLimitedQuery = db.prepare("SELECT * FROM user ORDER BY user_id LIMIT ? OFFSET ?");
const getAwardsQuery = db.prepare("SELECT * FROM award ORDER BY award_id");
const getCodesQuery = db.prepare("SELECT rowid,* FROM code ORDER BY rowid");
const getGroupsQuery = db.prepare("SELECT * FROM \"group\" ORDER BY group_id");
const getRolesQuery = db.prepare("SELECT * FROM role ORDER BY role_id");
const getTokensQuery = db.prepare("SELECT * FROM token ORDER BY token_id");
const getUsersQuery = db.prepare("SELECT * FROM user ORDER BY user_id");

const getUsersOrderedByPointsQuery = db.prepare("SELECT * FROM \"user\",\"user_group\" WHERE user.user_id = user_group.user_id AND group_id = ? ORDER BY user_group_points DESC LIMIT ? OFFSET ?");
const getUsersOrderedByKarmaQuery = db.prepare("SELECT * FROM \"user\",\"user_group\" WHERE user.user_id = user_group.user_id AND group_id = ? ORDER BY user_group_karma DESC LIMIT ? OFFSET ?");

const setUserNameQuery = db.prepare("UPDATE \"user\" SET user_name = ? WHERE user_id = ?");
const setGroupNameQuery = db.prepare("UPDATE \"group\" SET group_name = ? WHERE group_id = ?");
const setCodeNameQuery = db.prepare("UPDATE code SET code_name = ? WHERE rowid = ?");
const setCodeDescriptionQuery = db.prepare("UPDATE code SET code_description = ? WHERE rowid = ?");
const setCodeCreatorQuery = db.prepare("UPDATE code SET code_creator = ? WHERE rowid = ?");
const setAwardTitleQuery = db.prepare("UPDATE award SET award_title = ? WHERE award_id = ?");
const setAwardDescriptionQuery = db.prepare("UPDATE award SET award_description = ? WHERE award_id = ?");
const setUserAwardDateQuery = db.prepare("UPDATE user_award SET user_award_date = ? WHERE user_id = ? AND award_id = ?");
const setUserGroupKarmaQuery = db.prepare("UPDATE user_group SET user_group_karma = ? WHERE user_id = ? AND group_id = ?");
const setUserGroupPointsQuery = db.prepare("UPDATE user_group SET user_group_points = ? WHERE user_id = ? AND group_id = ?");
const setUserGroupLastUpQuery = db.prepare("UPDATE user_group SET user_group_last_up = ? WHERE user_id = ? AND group_id = ?");
const setUserGroupLastDownQuery = db.prepare("UPDATE user_group SET user_group_last_down = ? WHERE user_id = ? AND group_id = ?");
const setUserGroupLastSuperQuery = db.prepare("UPDATE user_group SET user_group_last_super = ? WHERE user_id = ? AND group_id = ?");
const setUserGroupLastRewardQuery = db.prepare("UPDATE user_group SET user_group_last_reward = ? WHERE user_id = ? AND group_id = ?");

const insertGroupQuery = db.prepare("INSERT INTO \"group\" (group_tgid,group_name) VALUES (?,?)");
const insertUserQuery = db.prepare("INSERT INTO \"user\" (user_tgid,user_name) VALUES (?,?)");
const insertCodeQuery = db.prepare("INSERT INTO \"code\" (code_name,code_description,code_creator) VALUES (?,?,?)");
const insertAwardQuery = db.prepare("INSERT INTO \"award\" (award_title,award_description) VALUES (?,?)");
const insertTokenQuery = db.prepare("INSERT INTO \"token\" (user_id,token_text) VALUES (?,?)");
const insertUserGroupQuery = db.prepare("INSERT INTO user_group (user_id,group_id) VALUES (?,?)");
const insertUserRoleQuery = db.prepare("INSERT INTO user_role (user_id,role_id) VALUES (?,?)");
const insertUserAwardQuery = db.prepare("INSERT INTO user_award (user_id,award_id,user_award_date) VALUES (?,?,?)");

const deleteUserTransaction = db.transaction((params) => {
    db.prepare("DELETE FROM user_award WHERE user_id = $userId;").run(params);
    db.prepare("DELETE FROM user_group WHERE user_id = $userId;").run(params);
    db.prepare("DELETE FROM user_role WHERE user_id = $userId;").run(params);
    db.prepare("DELETE FROM token WHERE user_id = $userId;").run(params);
    db.prepare("DELETE FROM user WHERE user_id = $userId;").run(params);
});
const deleteGroupTransaction = db.transaction((params) => {
    db.prepare("DELETE FROM user_group WHERE group_id = $groupId;");
    db.prepare("DELETE FROM group WHERE group_id = $groupId;").run(params);
});
const deleteRoleTransaction = db.transaction((params) => {
    db.prepare("DELETE FROM user_role WHERE role_id = $roleId;");
    db.prepare("DELETE FROM role WHERE role_id = $roleId;").run(params);
});
const deleteAwardTransaction = db.transaction((params) => {
    db.prepare("DELETE FROM user_award WHERE award_id = $awardId;").run(params);
    db.prepare("DELETE FROM award WHERE award_id = $awardId;").run(params);
});
const deleteCodeQuery = db.prepare("DELETE FROM code WHERE rowid = ?");
const deleteTokenQuery = db.prepare("DELETE FROM token WHERE token_id = ?");

/*e = {
    insertUser(tgid, name) {
        insertUserQuery.run(tgid, name);
    },
    insertUserIfNotExists(user) {
        let result = getUserQueryByTGID.get(user.id);
        if (result === undefined && !user.is_bot) {
            let name = user.first_name;
            let i = 0;
            while (getUserByNameQuery.get(name) !== undefined) {
                i++;
                name = user.first_name + i;
                if (i > 1000) {
                    throw "Keine Nutzernamen frei";
                }
            }
            module.exports.insertUser(user.id, user.first_name);
            console.log("Nutzer erstellt");
        }
    },
    insertUserRole(user_id, role_name) {
        insertUserRoleQuery.run(user_id, role_name);
    },
    insertGroup(tgid, groupname) {
        insertGroupQuery.run(tgid, groupname);
    },
    getGroupByNameQuery(name) {

    },
    hasUserRole(id, role) {
        return hasUserRoleQuery.get(id, role) !== undefined;
    },
    isRegisteredGroup(id) {
        return getGroupQuery.get(id) !== undefined;
    },
    getUserByToken(token) {
        return getUserByTokenQuery.get(token);
    },
    getUserByName(name) {
        return getUserByNameQuery.get(name);
    },
    deleteUserRole(id, role) {
        deleteUserRoleQuery.run(id, role);
    },
    getUsers() {
        return getUsersQuery.all();
    },
    getUsersWithRoles() {
        return getUsersWithRolesQuery.all();
    },
    getUserWithRoles(id) {
        return getUserWithRolesQuery.get(id);
    },
    insertCode(code, description, user_id) {
        insertCodeQuery.run(code, description, user_id);
    },
    getCodeByName(name) {
        return getCodeByCodeQuery.get(name);
    },
    getCodes(limit, offset) {
        return getCodesQuery.all(limit, offset);
    },
    getTokens(id) {
        return getTokenQuery.all(id);
    },
    removeAllTokens(id) {
        removeAllTokensQuery.run(id);
    },
    insertToken(id) {
        const salt = crypto.randomBytes(128).toString('base64');
        const token = require('crypto').createHash('md5').update(id + salt).digest("hex");
        insertTokenQuery.run(id, token);
        return token;
    },
    removeUsersWithoutRoles() {
        return removeUsersWithoutRolesQuery.run();
    },
    backup(filename) {
        return db.backup(filename);
    }
};*/

/*
const getCodesQuery = db.prepare("SELECT rowid,* FROM code ORDER BY rowid LIMIT ? OFFSET ?");
const getUsersQuery = db.prepare("SELECT * FROM user");
const getCodeByCodeQuery = db.prepare("SELECT * FROM code WHERE code_name=?");
const getUserWithRolesQuery = db.prepare("SELECT user.*,group_concat(role.role_name,\", \") AS \"roles\" FROM user,user_role,role WHERE user.user_id=? AND user_role.user_id=user.user_id AND role.role_id=user_role.role_id GROUP BY user.user_id");
const getUsersWithRolesQuery = db.prepare("SELECT user.*,group_concat(role.role_name,\", \") AS \"roles\" FROM user,user_role,role WHERE user.user_id = user_role.user_id AND role.role_id=user_role.role_id GROUP BY user_role.user_id\n");
const getUserByTokenQuery = db.prepare("SELECT user_id FROM api_token WHERE token_text = ?");
const getUserQueryByTGID = db.prepare("SELECT * FROM user WHERE user_tgid = ?");
const getGroupsQuery = db.prepare("SELECT * FROM \"group\"");

const insertUserQuery = db.prepare("INSERT INTO user (user_tgid,user_name) VALUES (?,?)");
const insertGroupQuery = db.prepare("INSERT INTO \"group\" (group_tgid,group_name) VALUES (?,?)");
const insertCodeQuery = db.prepare("INSERT INTO \"code\" (code_name,code_description,code_creator) VALUES (?,?,?)");
const insertTokenQuery = db.prepare("INSERT INTO \"api_token\" (user_id,token_text) VALUES (?,?)");
const insertUserRoleQuery = db.prepare("INSERT INTO user_role (user_id,role_id) VALUES (?,(SELECT role_id FROM role WHERE role_name = ?))");

const deleteUsersWithoutRolesQuery = db.prepare("DELETE FROM user WHERE user_id NOT IN (SELECT user_id FROM user_role GROUP BY user_id)");
const deleteAllTokensQuery = db.prepare("DELETE FROM api_token WHERE user_id = ?");
const deleteUserRoleQuery = db.prepare("DELETE FROM user_role WHERE user_id = ? AND role_id=(SELECT role_id FROM role WHERE role_name = ?)");
const hasUserRoleQuery = db.prepare("SELECT * FROM user_role WHERE user_id = ? AND role_id = (SELECT role_id FROM role where role_name = ?)");
*/